import { render, screen } from '@testing-library/react'
import { SongCard } from '@/components/SongCard'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    <img src={src} alt={alt} style={fill ? { objectFit: 'cover', width: '100%', height: '100%' } : {}} {...props} />
  ),
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockSong = {
  id: 'song1',
  title: 'Test Song',
  artistName: 'Test Artist',
  albumArtUrl: 'https://example.com/album-art.jpg',
  totalRoyaltyPool: 1000,
  monthlyRevenue: 50,
  investments: [
    { amountInvested: 200, royaltyPercentage: 20 },
    { amountInvested: 100, royaltyPercentage: 10 },
  ]
}

describe('SongCard', () => {
  it('renders song information correctly', () => {
    render(<SongCard song={mockSong} />)

    expect(screen.getByText('Test Song')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('$1000')).toBeInTheDocument() // Pool size
    expect(screen.getByText('$50.00 / month')).toBeInTheDocument() // Monthly revenue
  })

  it('calculates available investment correctly', () => {
    render(<SongCard song={mockSong} />)
    
    // Total invested: 200 + 100 = 300
    // Available: 1000 - 300 = 700
    expect(screen.getByText('$700')).toBeInTheDocument()
  })

  it('calculates funding percentage correctly', () => {
    render(<SongCard song={mockSong} />)
    
    // (300 / 1000) * 100 = 30%
    expect(screen.getByText('30.0% funded')).toBeInTheDocument()
  })

  it('calculates monthly yield correctly', () => {
    render(<SongCard song={mockSong} />)
    
    // (50 / 1000) * 100 = 5%
    expect(screen.getByText('5.0% monthly yield')).toBeInTheDocument()
  })

  it('displays album art when provided', () => {
    render(<SongCard song={mockSong} />)
    
    const image = screen.getByAltText('Test Song album art')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/album-art.jpg')
  })

  it('displays music emoji when no album art', () => {
    const songWithoutArt = { ...mockSong, albumArtUrl: undefined }
    render(<SongCard song={songWithoutArt} />)
    
    expect(screen.getByText('🎵')).toBeInTheDocument()
  })

  it('creates correct link to song page', () => {
    render(<SongCard song={mockSong} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/song/song1')
  })

  it('handles new song with no investments', () => {
    const newSong = {
      ...mockSong,
      investments: [],
      totalRoyaltyPool: 0,
    }
    render(<SongCard song={newSong} />)
    
    expect(screen.getByText('New song')).toBeInTheDocument()
    // Both pool size and available amount should be $0
    const dollarZeros = screen.getAllByText('$0')
    expect(dollarZeros).toHaveLength(2) // Pool Size and Available
  })

  it('displays invest call to action', () => {
    render(<SongCard song={mockSong} />)
    
    expect(screen.getByText('Invest Now →')).toBeInTheDocument()
  })

  it('handles zero monthly revenue', () => {
    const songWithoutRevenue = { ...mockSong, monthlyRevenue: 0 }
    render(<SongCard song={songWithoutRevenue} />)
    
    expect(screen.getByText('$0.00 / month')).toBeInTheDocument()
    expect(screen.getByText('0.0% monthly yield')).toBeInTheDocument()
  })
})