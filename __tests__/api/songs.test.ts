/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/songs/route'
import { getServerSession } from 'next-auth/next'
import { db } from '@/lib/db'

// Mock dependencies
jest.mock('next-auth/next')
jest.mock('@/lib/db', () => ({
  db: {
    song: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockDb = db as jest.Mocked<typeof db>

describe('/api/songs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/songs', () => {
    it('should return all active songs', async () => {
      const mockSongs = [
        {
          id: 'song1',
          title: 'Test Song',
          artistName: 'Test Artist',
          albumArtUrl: 'https://example.com/art.jpg',
          totalRoyaltyPool: 1000,
          monthlyRevenue: 50,
          artist: { id: 'user1', name: 'Test Artist' },
          investments: [],
        },
      ]

      mockDb.song.findMany.mockResolvedValue(mockSongs)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSongs)
      expect(mockDb.song.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          artist: {
            select: { id: true, name: true }
          },
          investments: {
            select: {
              amountInvested: true,
              royaltyPercentage: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should handle database errors', async () => {
      mockDb.song.findMany.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch songs')
    })
  })

  describe('POST /api/songs', () => {
    it('should create a new song when authenticated', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const mockCreatedSong = {
        id: 'song1',
        title: 'New Song',
        artistName: 'Test Artist',
        albumArtUrl: 'https://example.com/art.jpg',
        totalRoyaltyPool: 1000,
        artistId: 'user1',
      }
      mockDb.song.create.mockResolvedValue(mockCreatedSong)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'New Song',
          artistName: 'Test Artist',
          albumArtUrl: 'https://example.com/art.jpg',
          totalRoyaltyPool: 1000,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCreatedSong)
      expect(mockDb.song.create).toHaveBeenCalledWith({
        data: {
          title: 'New Song',
          artistName: 'Test Artist',
          albumArtUrl: 'https://example.com/art.jpg',
          totalRoyaltyPool: 1000,
          artistId: 'user1',
        },
      })
    })

    it('should reject unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'New Song',
          artistName: 'Test Artist',
          totalRoyaltyPool: 1000,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should validate required fields', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: '', // Invalid: empty title
          artistName: 'Test Artist',
          totalRoyaltyPool: 1000,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
      expect(data.details).toBeDefined()
    })

    it('should handle negative royalty pool', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'POST',
        body: {
          title: 'New Song',
          artistName: 'Test Artist',
          totalRoyaltyPool: -100, // Invalid: negative amount
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
    })
  })
})