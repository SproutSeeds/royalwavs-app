"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Professional distribution form data
type DistributionData = {
  // Track Info
  title: string
  artistName: string
  featuring: string
  albumTitle: string
  trackNumber: number
  totalTracks: number
  
  // Metadata
  genre: string
  subGenre: string
  mood: string[]
  bpm: number
  key: string
  language: string
  explicit: boolean
  
  // Release Info
  releaseDate: string
  releaseType: 'single' | 'ep' | 'album'
  previouslyReleased: boolean
  originalReleaseDate: string
  
  // Rights & Royalties
  composition: string
  writer: string[]
  publisher: string
  pLine: string
  cLine: string
  
  // Marketplace
  royaltyPool: number
  artistShare: number
  investorShare: number
  minimumInvestment: number
  
  // Distribution
  distributionTier: 'basic' | 'premium' | 'platinum'
  targetDSPs: string[]
  marketingBudget: number
}

const GENRES = [
  'Pop', 'Hip-Hop/Rap', 'R&B/Soul', 'Rock', 'Electronic/Dance', 'Country', 
  'Alternative', 'Indie', 'Folk', 'Jazz', 'Classical', 'Reggae', 'Latin', 'World'
]

const MOODS = [
  'Energetic', 'Chill', 'Happy', 'Melancholy', 'Aggressive', 'Romantic', 
  'Uplifting', 'Dark', 'Dreamy', 'Intense', 'Peaceful', 'Rebellious'
]

const DSP_PLATFORMS = [
  { name: 'Spotify', tier: 'basic', logo: '🎵' },
  { name: 'Apple Music', tier: 'basic', logo: '🍎' },
  { name: 'Amazon Music', tier: 'basic', logo: '📦' },
  { name: 'YouTube Music', tier: 'basic', logo: '📺' },
  { name: 'Deezer', tier: 'premium', logo: '🎶' },
  { name: 'Tidal', tier: 'premium', logo: '🌊' },
  { name: 'Pandora', tier: 'premium', logo: '📻' },
  { name: 'SoundCloud', tier: 'premium', logo: '☁️' },
  { name: 'Beatport', tier: 'platinum', logo: '🎧' },
  { name: 'Traxsource', tier: 'platinum', logo: '🎚️' },
  { name: 'Bandcamp', tier: 'platinum', logo: '🎪' },
  { name: 'TikTok Music', tier: 'platinum', logo: '📱' }
]

export default function ProfessionalUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverArt, setCoverArt] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  const [formData, setFormData] = useState<DistributionData>({
    // Track Info
    title: '',
    artistName: session?.user?.name || '',
    featuring: '',
    albumTitle: '',
    trackNumber: 1,
    totalTracks: 1,
    
    // Metadata
    genre: '',
    subGenre: '',
    mood: [],
    bpm: 120,
    key: 'C Major',
    language: 'English',
    explicit: false,
    
    // Release Info
    releaseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    releaseType: 'single',
    previouslyReleased: false,
    originalReleaseDate: '',
    
    // Rights & Royalties
    composition: 'Original',
    writer: [],
    publisher: '',
    pLine: `℗ ${new Date().getFullYear()} ${session?.user?.name || '[Artist Name]'}`,
    cLine: `© ${new Date().getFullYear()} ${session?.user?.name || '[Artist Name]'}`,
    
    // Marketplace
    royaltyPool: 25000,
    artistShare: 60,
    investorShare: 40,
    minimumInvestment: 25,
    
    // Distribution
    distributionTier: 'premium',
    targetDSPs: ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music'],
    marketingBudget: 500
  })

  const totalSteps = 6

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, router])

  const handleFileUpload = useCallback((file: File) => {
    setAudioFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    // Auto-extract metadata if possible
    if (file.name) {
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: fileName }))
      }
    }
  }, [formData.title])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find(file => file.type.startsWith('audio/'))
    
    if (audioFile) {
      handleFileUpload(audioFile)
    }
  }, [handleFileUpload])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (updates: Partial<DistributionData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Header */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Professional Distribution
              </span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl">
              Get your music on all major platforms — completely FREE
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-amber-400 font-medium">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Labels */}
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span className={currentStep >= 1 ? 'text-amber-400' : ''}>Upload</span>
              <span className={currentStep >= 2 ? 'text-amber-400' : ''}>Track Info</span>
              <span className={currentStep >= 3 ? 'text-amber-400' : ''}>Metadata</span>
              <span className={currentStep >= 4 ? 'text-amber-400' : ''}>Release</span>
              <span className={currentStep >= 5 ? 'text-amber-400' : ''}>Royalties</span>
              <span className={currentStep >= 6 ? 'text-amber-400' : ''}>Distribution</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-8">
          
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Upload Your Track</h2>
              
              <div 
                className="border-2 border-dashed border-amber-400/50 hover:border-amber-400 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('audio-upload')?.click()}
              >
                {audioFile ? (
                  <div className="space-y-4">
                    <div className="text-6xl">🎵</div>
                    <div>
                      <div className="text-xl font-semibold text-white">{audioFile.name}</div>
                      <div className="text-white/60">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    {previewUrl && (
                      <audio controls className="mx-auto">
                        <source src={previewUrl} type={audioFile.type} />
                      </audio>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl text-amber-400">🎧</div>
                    <div>
                      <div className="text-xl font-semibold text-white mb-2">Drop your audio file here</div>
                      <div className="text-white/60">WAV, MP3, FLAC, or AIFF • Max 200MB</div>
                      <div className="text-amber-400 text-sm mt-2">Professional quality recommended (24-bit/48kHz or higher)</div>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0])
                  }
                }}
                className="hidden"
              />

              {/* Quality Check */}
              {audioFile && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <span>✅</span>
                    <span>Audio quality check passed • Ready for professional distribution</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Track Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Track Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="Enter track title"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    value={formData.artistName}
                    onChange={(e) => updateFormData({ artistName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="Your artist name"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Featuring (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.featuring}
                    onChange={(e) => updateFormData({ featuring: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="Featured artists"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Album/EP Title
                  </label>
                  <input
                    type="text"
                    value={formData.albumTitle}
                    onChange={(e) => updateFormData({ albumTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="Leave blank for single"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.explicit}
                    onChange={(e) => updateFormData({ explicit: e.target.checked })}
                    className="rounded border-white/20 bg-white/10 cursor-pointer"
                  />
                  <span>This track contains explicit content</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Metadata */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Music Metadata</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Primary Genre *
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => updateFormData({ genre: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    <option value="" className="bg-slate-800 text-white">Select Genre</option>
                    {GENRES.map(genre => (
                      <option key={genre} value={genre} className="bg-slate-800 text-white">{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Sub-Genre
                  </label>
                  <input
                    type="text"
                    value={formData.subGenre}
                    onChange={(e) => updateFormData({ subGenre: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="e.g. Trap, House, Indie Rock"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    BPM (Beats Per Minute)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="200"
                    value={formData.bpm}
                    onChange={(e) => updateFormData({ bpm: parseInt(e.target.value) || 120 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="120"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Musical Key
                  </label>
                  <select
                    value={formData.key}
                    onChange={(e) => updateFormData({ key: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    {['C Major', 'C# Major', 'D Major', 'D# Major', 'E Major', 'F Major', 'F# Major', 'G Major', 'G# Major', 'A Major', 'A# Major', 'B Major',
                      'C Minor', 'C# Minor', 'D Minor', 'D# Minor', 'E Minor', 'F Minor', 'F# Minor', 'G Minor', 'G# Minor', 'A Minor', 'A# Minor', 'B Minor'].map(key => (
                      <option key={key} value={key} className="bg-slate-800 text-white">{key}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Mood & Vibe (Select up to 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MOODS.map(mood => (
                    <label key={mood} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mood.includes(mood)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (formData.mood.length < 3) {
                              updateFormData({ mood: [...formData.mood, mood] })
                            }
                          } else {
                            updateFormData({ mood: formData.mood.filter(m => m !== mood) })
                          }
                        }}
                        disabled={!formData.mood.includes(mood) && formData.mood.length >= 3}
                        className="rounded border-white/20 bg-white/10 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className={`text-sm ${!formData.mood.includes(mood) && formData.mood.length >= 3 ? 'text-white/40' : 'text-white'}`}>
                        {mood}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  {formData.mood.length}/3 selected
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => updateFormData({ language: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Arabic', 'Russian', 'Other'].map(lang => (
                      <option key={lang} value={lang} className="bg-slate-800 text-white">{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Release Type
                  </label>
                  <select
                    value={formData.releaseType}
                    onChange={(e) => updateFormData({ releaseType: e.target.value as 'single' | 'ep' | 'album' })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    <option value="single" className="bg-slate-800 text-white">Single</option>
                    <option value="ep" className="bg-slate-800 text-white">EP (3-6 tracks)</option>
                    <option value="album" className="bg-slate-800 text-white">Album (7+ tracks)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Release Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Release & Distribution</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Release Date *
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => updateFormData({ releaseDate: e.target.value })}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 1 week minimum
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  />
                  <p className="text-white/60 text-xs mt-1">Minimum 7 days from today for processing</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Distribution Tier
                  </label>
                  <div className="space-y-3">
                    {[
                      { tier: 'basic', name: 'Basic (FREE)', platforms: '4 Major DSPs', price: '$0' },
                      { tier: 'premium', name: 'Premium (FREE)', platforms: '8+ Platforms + Playlisting', price: '$0' },
                      { tier: 'platinum', name: 'Platinum (FREE)', platforms: 'All Platforms + Marketing', price: '$0' }
                    ].map(({ tier, name, platforms, price }) => (
                      <label key={tier} className="flex items-center space-x-3 p-4 rounded-xl border border-white/20 hover:border-amber-400/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="distributionTier"
                          value={tier}
                          checked={formData.distributionTier === tier}
                          onChange={(e) => updateFormData({ distributionTier: e.target.value as any })}
                          className="cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{name}</div>
                          <div className="text-white/60 text-sm">{platforms}</div>
                        </div>
                        <div className="text-green-400 font-bold">{price}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Target Platforms (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {DSP_PLATFORMS.map(platform => {
                    const isAvailable = formData.distributionTier === 'basic' ? platform.tier === 'basic' :
                                       formData.distributionTier === 'premium' ? ['basic', 'premium'].includes(platform.tier) :
                                       true
                    
                    return (
                      <label key={platform.name} className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isAvailable 
                          ? 'border-white/20 hover:border-amber-400/50' 
                          : 'border-white/10 opacity-50 cursor-not-allowed'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.targetDSPs.includes(platform.name)}
                          disabled={!isAvailable}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData({ targetDSPs: [...formData.targetDSPs, platform.name] })
                            } else {
                              updateFormData({ targetDSPs: formData.targetDSPs.filter(dsp => dsp !== platform.name) })
                            }
                          }}
                          className="cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-xl">{platform.logo}</span>
                        <span className={`text-sm ${isAvailable ? 'text-white' : 'text-white/40'}`}>
                          {platform.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.previouslyReleased}
                    onChange={(e) => updateFormData({ previouslyReleased: e.target.checked })}
                    className="rounded border-white/20 bg-white/10 cursor-pointer"
                  />
                  <span>This song was previously released elsewhere</span>
                </label>
                
                {formData.previouslyReleased && (
                  <div className="mt-4">
                    <label className="block text-white text-sm font-medium mb-2">
                      Original Release Date
                    </label>
                    <input
                      type="date"
                      value={formData.originalReleaseDate}
                      onChange={(e) => updateFormData({ originalReleaseDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Royalty Marketplace */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Royalty Marketplace Setup</h2>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-400/20 mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  Monetize Your Music Through Fan Investment
                </h3>
                <p className="text-white/80 mb-4">
                  Allow fans to invest in your song's royalties and share in your success. Set up your investment pool to get funding for promotion and marketing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-black/20 rounded-xl p-3">
                    <div className="text-green-400 font-bold">Fan Investment</div>
                    <div className="text-white/60 text-sm">Get upfront funding</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <div className="text-purple-400 font-bold">Shared Success</div>
                    <div className="text-white/60 text-sm">Fans earn as you earn</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <div className="text-cyan-400 font-bold">Marketing Budget</div>
                    <div className="text-white/60 text-sm">Fund your promotion</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Total Royalty Pool ($)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={formData.royaltyPool}
                    onChange={(e) => updateFormData({ royaltyPool: parseInt(e.target.value) || 25000 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    placeholder="25000"
                  />
                  <p className="text-white/60 text-xs mt-1">Total investment pool available to fans</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Your Share (%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    value={formData.artistShare}
                    onChange={(e) => {
                      const artistShare = parseInt(e.target.value)
                      updateFormData({ 
                        artistShare,
                        investorShare: 100 - artistShare
                      })
                    }}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-amber-400 font-medium">{formData.artistShare}% You</span>
                    <span className="text-purple-400 font-medium">{formData.investorShare}% Investors</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">How royalties are split between you and investors</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Minimum Investment ($)
                  </label>
                  <select
                    value={formData.minimumInvestment}
                    onChange={(e) => updateFormData({ minimumInvestment: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    {[10, 25, 50, 100, 250, 500].map(amount => (
                      <option key={amount} value={amount} className="bg-slate-800 text-white">${amount}</option>
                    ))}
                  </select>
                  <p className="text-white/60 text-xs mt-1">Lowest amount fans can invest</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Marketing Budget ($)
                  </label>
                  <select
                    value={formData.marketingBudget}
                    onChange={(e) => updateFormData({ marketingBudget: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                  >
                    {[0, 250, 500, 1000, 2500, 5000, 10000].map(amount => (
                      <option key={amount} value={amount} className="bg-slate-800 text-white">
                        {amount === 0 ? 'No marketing budget' : `$${amount.toLocaleString()}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-white/60 text-xs mt-1">Optional: Budget for playlist pitching & promotion</p>
                </div>
              </div>

              {/* Investment Preview */}
              <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-2xl p-6 border border-purple-400/20">
                <h4 className="text-lg font-bold text-white mb-4">Investment Preview</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">${formData.royaltyPool.toLocaleString()}</div>
                    <div className="text-white/60 text-sm">Total Pool</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">${formData.minimumInvestment}</div>
                    <div className="text-white/60 text-sm">Min Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{Math.floor(formData.royaltyPool / formData.minimumInvestment)}</div>
                    <div className="text-white/60 text-sm">Max Investors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{formData.investorShare}%</div>
                    <div className="text-white/60 text-sm">Investor Share</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Final Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Review & Submit</h2>
              
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-400/20 mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  Ready for Professional Distribution
                </h3>
                <p className="text-white/80">
                  Your track will be distributed to all major platforms within 7-14 days. You'll receive email updates throughout the process.
                </p>
              </div>

              {/* Track Summary */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">Track Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Title:</span>
                    <span className="text-white font-medium ml-2">{formData.title || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Artist:</span>
                    <span className="text-white font-medium ml-2">{formData.artistName || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Genre:</span>
                    <span className="text-white font-medium ml-2">{formData.genre || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Release Date:</span>
                    <span className="text-white font-medium ml-2">{formData.releaseDate ? new Date(formData.releaseDate).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Distribution:</span>
                    <span className="text-white font-medium ml-2 capitalize">{formData.distributionTier} Tier</span>
                  </div>
                  <div>
                    <span className="text-white/60">Platforms:</span>
                    <span className="text-white font-medium ml-2">{formData.targetDSPs.length} selected</span>
                  </div>
                </div>
              </div>

              {/* Royalty Summary */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">Royalty Marketplace</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Investment Pool:</span>
                    <span className="text-amber-400 font-bold ml-2">${formData.royaltyPool.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Your Share:</span>
                    <span className="text-green-400 font-bold ml-2">{formData.artistShare}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">Investor Share:</span>
                    <span className="text-purple-400 font-bold ml-2">{formData.investorShare}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">Min Investment:</span>
                    <span className="text-cyan-400 font-bold ml-2">${formData.minimumInvestment}</span>
                  </div>
                </div>
              </div>

              {/* Rights & Legal */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Rights & Ownership</h4>
                <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-white/60">P-Line:</span>
                      <span className="text-white ml-2">{formData.pLine}</span>
                    </div>
                    <div>
                      <span className="text-white/60">C-Line:</span>
                      <span className="text-white ml-2">{formData.cLine}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => {
                    setLoading(true)
                    // Here you would submit the form data to your API
                    console.log('Submitting form data:', formData)
                    setTimeout(() => {
                      alert('Success! Your track has been submitted for distribution. You\'ll receive updates via email.')
                      setLoading(false)
                    }, 2000)
                  }}
                  disabled={loading}
                  className="group px-12 py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center space-x-4">
                    <span className="text-3xl group-hover:animate-bounce">🚀</span>
                    <span>{loading ? 'Submitting...' : 'Submit for Distribution'}</span>
                    <span className="text-3xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>💫</span>
                  </div>
                </button>
              </div>

              <p className="text-center text-white/60 text-sm">
                By submitting, you agree to RoyalWavs' Terms of Service and Distribution Agreement
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                currentStep === 1 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Previous
            </button>

            <div className="text-center">
              <div className="text-amber-400 text-sm font-medium">FREE Professional Distribution</div>
              <div className="text-white/60 text-xs">Worth $50+ with traditional distributors</div>
            </div>

            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !audioFile) ||
                (currentStep === 2 && (!formData.title || !formData.artistName)) ||
                (currentStep === 3 && !formData.genre) ||
                (currentStep === 4 && !formData.releaseDate) ||
                (currentStep === 5) ||
                (currentStep === 6)
              }
              className={`px-6 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                (currentStep === 1 && !audioFile) ||
                (currentStep === 2 && (!formData.title || !formData.artistName)) ||
                (currentStep === 3 && !formData.genre) ||
                (currentStep === 4 && !formData.releaseDate) ||
                (currentStep === 5) ||
                (currentStep === 6)
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
              }`}
            >
              {currentStep === totalSteps ? 'Review Complete' : 'Next Step'}
            </button>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-green-400 font-bold">$0 Distribution Fee</div>
            <div className="text-white/60 text-sm">Others charge $20-50/year</div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-blue-400 font-bold">Premium Features</div>
            <div className="text-white/60 text-sm">AI mastering, playlist pitching</div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-purple-400 font-bold">Royalty Marketplace</div>
            <div className="text-white/60 text-sm">Get funded by your fans</div>
          </div>
        </div>
      </div>
    </div>
  )
}