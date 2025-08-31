"use client"

import { useState } from "react"
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
  const [isDragOver, setIsDragOver] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)

    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          artistName: formData.artistName,
          albumArtUrl: formData.albumArtUrl || undefined,
          totalRoyaltyPool: 10000, // Default base for calculations
          artistPercentage,
          publicPercentage,
        }),
      })

      if (response.ok) {
        const song = await response.json()
        router.push(`/song/${song.id}`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create song")
      }
    } catch (error) {
      alert("Failed to create song")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidAudioFile(file)) {
      setAudioFile(file)
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && isValidAudioFile(file)) {
      setAudioFile(file)
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
    const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB
    
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-400/30">
            <span className="text-4xl">🎵</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Ready to Share Your Music?
            </span>
          </h1>
          <p className="text-white/70 mb-8 text-lg">
            Join RoyalWavs to upload your tracks and let fans partner with your success
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative flex items-center space-x-3">
              <span className="text-2xl group-hover:animate-bounce">🌴</span>
              <span>Enter Paradise</span>
              <span className="text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Upload Your Track
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Share your music with the world and let partners join your success journey
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center space-x-8 mb-12">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= stepNum 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50 scale-110' 
                  : 'bg-gray-600/40'
              }`}>
                <span className="text-white font-bold">{stepNum}</span>
              </div>
              {stepNum < 3 && (
                <div className={`w-16 h-1 mx-4 transition-all duration-500 ${
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
              <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl shadow-amber-500/20">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
                  Tell Us About Your Track
                </h2>
                
                <div className="space-y-6 max-w-xl mx-auto">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Song Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter your song title..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Artist Name
                    </label>
                    <input
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
                    <label className="block text-white/80 text-sm font-medium mb-2">
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
                          <div className="text-4xl mb-4 animate-bounce">🎵</div>
                          <div className="text-emerald-300 font-bold text-lg mb-2">{audioFile.name}</div>
                          <div className="text-white/60 text-sm mb-4">
                            {formatFileSize(audioFile.size)} • Ready to upload
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setAudioFile(null)
                            }}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                          >
                            Remove File
                          </button>
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
                            Supports MP3, WAV, FLAC up to 50MB
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Album Art URL (Optional)
                    </label>
                    <input
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
              <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl shadow-amber-500/20">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
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
                    onClick={handleSubmit}
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
              disabled={step === 1 && (!formData.title || !formData.artistName || !audioFile)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <div className="w-20"></div> // Spacer
          )}
        </div>
      </div>
    </div>
  )
}