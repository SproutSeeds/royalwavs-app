"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { RoyaltyAllocationChart } from "@/components/RoyaltyAllocationChart"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [artistPercentage, setArtistPercentage] = useState(60)
  const [publicPercentage, setPublicPercentage] = useState(40)
  const [formData, setFormData] = useState({
    title: "",
    artistName: "",
    albumArtUrl: "",
    totalRoyaltyPool: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [titleCheckStatus, setTitleCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [titleError, setTitleError] = useState('')

  const handleAllocationChange = (artist: number, publicShare: number) => {
    setArtistPercentage(artist)
    setPublicPercentage(publicShare)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('audioFile', file)

      // Simulate progress for now since fetch doesn't easily support upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 200)

      console.log("Starting upload with fetch...")
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include' // This ensures cookies are sent
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log("Upload response status:", response.status)
      
      if (!response.ok) {
        try {
          const error = await response.json()
          console.error("Upload error:", error)
          setUploadStatus('error')
          setIsUploading(false)
          throw new Error(error.error || `Upload failed with status ${response.status}`)
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError)
          console.error("Raw response:", await response.text())
          setUploadStatus('error')
          setIsUploading(false)
          throw new Error(`Upload failed with status ${response.status}`)
        }
      }

      const result = await response.json()
      console.log("Upload successful:", result)
      setUploadStatus('success')
      setIsUploading(false)
      return result

    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus('error')
      setIsUploading(false)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert("You must be signed in to upload songs")
      return
    }

    setLoading(true)
    console.log("Starting song submission process...")

    try {
      let fileInfo = uploadedFileInfo

      // Upload file if not already uploaded
      if (audioFile && !uploadedFileInfo) {
        console.log("Uploading file first...")
        fileInfo = await uploadFile(audioFile)
        setUploadedFileInfo(fileInfo)
        console.log("File uploaded:", fileInfo)
      }

      console.log("Creating song with data:", {
        title: formData.title,
        artistName: formData.artistName,
        albumArtUrl: formData.albumArtUrl || undefined,
        audioFileUrl: fileInfo?.fileUrl,
        audioFileName: fileInfo?.originalName,
        audioFileSize: fileInfo?.fileSize,
        audioMimeType: fileInfo?.mimeType,
        totalRoyaltyPool: 10000,
        artistPercentage,
        publicPercentage,
      })

      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          artistName: formData.artistName,
          albumArtUrl: formData.albumArtUrl || undefined,
          audioFileUrl: fileInfo?.fileUrl,
          audioFileName: fileInfo?.originalName,
          audioFileSize: fileInfo?.fileSize,
          audioMimeType: fileInfo?.mimeType,
          totalRoyaltyPool: 10000, // Default base for calculations
          artistPercentage,
          publicPercentage,
        }),
      })

      console.log("Song creation response status:", response.status)
      
      if (response.ok) {
        const song = await response.json()
        console.log("Song created successfully:", song)
        alert(`Song "${formData.title}" created successfully! Redirecting...`)
        // For now, just redirect to dashboard since we don't have individual song pages yet
        router.push("/dashboard")
      } else {
        const error = await response.json()
        console.error("Song creation error:", error)
        alert(`Failed to create song: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Song submission error:", error)
      alert(`Error during submission: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  // Debounced function to check for duplicate song titles
  const checkTitleAvailability = useCallback(
    async (title: string) => {
      if (!title.trim() || !session) {
        setTitleCheckStatus('idle')
        setTitleError('')
        return
      }

      setTitleCheckStatus('checking')
      setTitleError('')

      try {
        // First get all songs to check for duplicates (this would normally be a dedicated API endpoint)
        const response = await fetch('/api/songs')
        if (response.ok) {
          const songs = await response.json()
          const duplicateFound = songs.some((song: any) => 
            song.title.toLowerCase() === title.toLowerCase() && 
            song.artist?.id === session.user.id
          )
          
          if (duplicateFound) {
            setTitleCheckStatus('taken')
            setTitleError(`You already have a song titled "${title}"`)
          } else {
            setTitleCheckStatus('available')
            setTitleError('')
          }
        } else {
          setTitleCheckStatus('idle')
          setTitleError('')
        }
      } catch (error) {
        setTitleCheckStatus('idle')
        setTitleError('')
      }
    },
    [session]
  )

  // Debounce the title check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.title) {
        checkTitleAvailability(formData.title)
      }
    }, 800) // Wait 800ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [formData.title, checkTitleAvailability])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Reset title check status when user starts typing
    if (name === 'title') {
      setTitleCheckStatus('idle')
      setTitleError('')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected!")
    console.log("Current session:", session)
    console.log("Session status:", status)
    
    const file = e.target.files?.[0]
    console.log("Selected file:", file ? { name: file.name, size: file.size, type: file.type } : "No file")
    
    if (!session) {
      console.error("No session found - user not authenticated")
      alert("Please sign in first to upload files")
      return
    }
    
    if (file && isValidAudioFile(file)) {
      console.log("File is valid, starting auto-upload...")
      console.log("User ID:", session.user?.id)
      setAudioFile(file)
      setUploadedFileInfo(null) // Reset upload info when new file selected
      setUploadStatus('idle')
      setUploadProgress(0)
      
      // Auto-upload the file
      try {
        console.log("Calling uploadFile...")
        const result = await uploadFile(file)
        console.log("Upload result:", result)
        setUploadedFileInfo(result)
      } catch (error) {
        console.error('Auto-upload failed:', error)
        // Error state is already handled in uploadFile function
      }
    } else if (file) {
      console.log("File is invalid!")
      alert("Please select a valid audio file (MP3, WAV, or FLAC, max 200MB)")
    }
  }

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && isValidAudioFile(file)) {
      setAudioFile(file)
      setUploadedFileInfo(null) // Reset upload info when new file selected
      setUploadStatus('idle')
      setUploadProgress(0)
      
      // Auto-upload the file
      try {
        const result = await uploadFile(file)
        setUploadedFileInfo(result)
      } catch (error) {
        console.error('Auto-upload failed:', error)
        // Error state is already handled in uploadFile function
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const isValidAudioFile = (file: File): boolean => {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/mpeg', 'audio/x-wav']
    const validExtensions = ['.mp3', '.wav', '.flac']
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    const isValidSize = file.size <= 200 * 1024 * 1024 // 200MB
    
    return (hasValidType || hasValidExtension) && isValidSize
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-amber-400/30">
            <span className="text-3xl sm:text-4xl">🎵</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Ready to Share Your Music?
            </span>
          </h1>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Join RoyalWavs to upload your tracks and let fans partner with your success
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl group-hover:animate-bounce">🌴</span>
              <span>Enter Paradise</span>
              <span className="text-xl sm:text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Upload Your Track
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Share your music with the world and let partners join your success journey
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 mb-6 sm:mb-8 md:mb-12 px-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= stepNum 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50 scale-110' 
                  : 'bg-gray-600/40'
              }`}>
                <span className="text-white font-bold text-xs sm:text-sm md:text-base">{stepNum}</span>
              </div>
              {stepNum < 3 && (
                <div className={`w-6 sm:w-8 md:w-12 lg:w-16 h-0.5 sm:h-1 mx-1 sm:mx-2 md:mx-3 lg:mx-4 transition-all duration-500 ${
                  step > stepNum ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-600/40'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="relative">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-amber-500/20">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-white px-2">
                  Tell Us About Your Track
                </h2>
                
                <div className="space-y-6 max-w-xl mx-auto">
                  <div>
                    <label htmlFor="title" className="block text-white/80 text-sm font-medium mb-2">
                      Song Title
                    </label>
                    <div className="relative">
                      <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter your song title..."
                        className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          titleCheckStatus === 'taken' 
                            ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50' 
                            : titleCheckStatus === 'available'
                            ? 'border-emerald-400/50 focus:ring-emerald-400/50 focus:border-emerald-400/50'
                            : 'border-white/20 focus:ring-amber-400/50 focus:border-amber-400/50'
                        }`}
                        required
                      />
                      
                      {/* Status Indicator */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {titleCheckStatus === 'checking' && (
                          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {titleCheckStatus === 'available' && (
                          <div className="text-emerald-400 text-xl">✓</div>
                        )}
                        {titleCheckStatus === 'taken' && (
                          <div className="text-red-400 text-xl">⚠</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {titleError && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {titleError}
                      </p>
                    )}
                    
                    {/* Success Message */}
                    {titleCheckStatus === 'available' && formData.title && (
                      <p className="text-emerald-400 text-sm mt-2 flex items-center">
                        <span className="mr-1">✓</span>
                        Title is available!
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="artistName" className="block text-white/80 text-sm font-medium mb-2">
                      Artist Name
                    </label>
                    <input
                      id="artistName"
                      type="text"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleChange}
                      placeholder="Your artist name..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Audio File Upload */}
                  <div>
                    <label htmlFor="audioFileInput" className="block text-white/80 text-sm font-medium mb-2">
                      Upload Audio File
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                        isDragOver 
                          ? 'border-amber-400/70 bg-amber-400/10' 
                          : audioFile
                            ? 'border-emerald-400/50 bg-emerald-400/10'
                            : 'border-white/30 hover:border-amber-400/50 hover:bg-amber-400/5'
                      }`}
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById('audioFileInput')?.click()}
                    >
                      {/* Background shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      
                      <input
                        id="audioFileInput"
                        type="file"
                        accept=".mp3,.wav,.flac,audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {audioFile ? (
                        <div className="relative z-10">
                          {isUploading ? (
                            <div className="text-center">
                              <div className="text-4xl mb-4 animate-pulse">📤</div>
                              <div className="text-amber-300 font-bold text-lg mb-2">Uploading...</div>
                              <div className="text-white/60 text-sm mb-4">{audioFile.name}</div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-700/30 rounded-full h-3 mb-4 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              
                              <div className="text-white/80 text-sm font-medium mb-2">
                                {uploadProgress}% Complete
                              </div>
                              
                              <div className="text-white/60 text-xs">
                                {formatFileSize(audioFile.size)} • Uploading to server...
                              </div>
                            </div>
                          ) : uploadStatus === 'success' && uploadedFileInfo ? (
                            <div className="text-center">
                              <div className="text-4xl mb-4">✅</div>
                              <div className="text-emerald-300 font-bold text-lg mb-2">Upload Complete!</div>
                              <div className="text-white/60 text-sm mb-4">{audioFile.name}</div>
                              <div className="text-emerald-400/80 text-sm mb-4">
                                {formatFileSize(audioFile.size)} • Ready for submission
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setAudioFile(null)
                                  setUploadedFileInfo(null)
                                  setUploadStatus('idle')
                                  setUploadProgress(0)
                                }}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                              >
                                Remove File
                              </button>
                            </div>
                          ) : uploadStatus === 'error' ? (
                            <div className="text-center">
                              <div className="text-4xl mb-4">❌</div>
                              <div className="text-red-300 font-bold text-lg mb-2">Upload Failed</div>
                              <div className="text-white/60 text-sm mb-4">{audioFile.name}</div>
                              <div className="text-red-400/80 text-sm mb-4">
                                Please try again or choose a different file
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    if (audioFile) {
                                      try {
                                        const result = await uploadFile(audioFile)
                                        setUploadedFileInfo(result)
                                      } catch (error) {
                                        console.error('Upload retry failed:', error)
                                      }
                                    }
                                  }}
                                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                                >
                                  Retry Upload
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setAudioFile(null)
                                    setUploadedFileInfo(null)
                                    setUploadStatus('idle')
                                    setUploadProgress(0)
                                  }}
                                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                                >
                                  Remove File
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="text-4xl mb-4 animate-bounce">🎵</div>
                              <div className="text-emerald-300 font-bold text-lg mb-2">{audioFile.name}</div>
                              <div className="text-white/60 text-sm mb-4">
                                {formatFileSize(audioFile.size)} • Ready to upload
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setAudioFile(null)
                                  setUploadedFileInfo(null)
                                  setUploadStatus('idle')
                                  setUploadProgress(0)
                                }}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                              >
                                Remove File
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative z-10">
                          <div className={`text-4xl mb-4 transition-all duration-300 ${isDragOver ? 'animate-bounce' : 'group-hover:animate-pulse'}`}>
                            {isDragOver ? '🎯' : '🎵'}
                          </div>
                          <div className="text-white/70 mb-2 font-medium">
                            {isDragOver ? 'Drop your audio file here' : 'Drag & drop your audio file here'}
                          </div>
                          <div className="text-white/50 text-sm mb-4">or click to browse</div>
                          <div className="text-white/40 text-xs">
                            Supports MP3, WAV, FLAC up to 200MB
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="albumArtUrl" className="block text-white/80 text-sm font-medium mb-2">
                      Album Art URL (Optional)
                    </label>
                    <input
                      id="albumArtUrl"
                      type="url"
                      name="albumArtUrl"
                      value={formData.albumArtUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/album-art.jpg"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                    />
                    <p className="text-white/50 text-xs mt-1">
                      Direct link to your album artwork
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Step 2: Royalty Split */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <RoyaltyAllocationChart onAllocationChange={handleAllocationChange} />
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
                  Review Your Submission
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Track Info */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">Track Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Song Title:</span>
                        <span className="text-white font-medium">{formData.title || "Untitled"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Artist:</span>
                        <span className="text-white font-medium">{formData.artistName || "Unknown Artist"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Audio File:</span>
                        <span className="text-white font-medium">{audioFile?.name || "No file"}</span>
                      </div>
                      {audioFile && (
                        <div className="flex justify-between">
                          <span className="text-white/70">File Size:</span>
                          <span className="text-white font-medium">{formatFileSize(audioFile.size)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Royalty Split */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">Royalty Split</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg p-4 text-center">
                        <div className="text-amber-300 font-bold text-2xl">{artistPercentage}%</div>
                        <div className="text-white/80 text-sm">You Keep</div>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg p-4 text-center">
                        <div className="text-cyan-300 font-bold text-2xl">{publicPercentage}%</div>
                        <div className="text-white/80 text-sm">For Partners</div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      console.log("Submit button clicked!")
                      console.log("Button state:", { 
                        loading, 
                        session: !!session,
                        title: formData.title,
                        artistName: formData.artistName,
                        audioFile: !!audioFile,
                        uploadedFileInfo: !!uploadedFileInfo
                      })
                      handleSubmit(e)
                    }}
                    disabled={loading}
                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    {loading ? (
                      <div className="relative flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Your Track...</span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center space-x-3">
                        <span className="text-2xl group-hover:animate-bounce">🚀</span>
                        <span>Launch Your Track</span>
                        <span className="text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              step === 1
                ? 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            ← Back
          </button>

          <div className="text-center">
            <span className="text-white/60 text-sm">Step {step} of 3</span>
          </div>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                step === 1 && 
                (!formData.title || !formData.artistName || !audioFile || isUploading || uploadStatus === 'error' || titleCheckStatus === 'taken' || titleCheckStatus === 'checking')
              }
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Next →'}
            </button>
          ) : (
            <div className="w-20"></div> // Spacer
          )}
        </div>
      </div>
    </div>
  )
}