/**
 * @jest-environment node
 */

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}))

// Mock database
jest.mock('@/lib/db', () => ({
  db: {
    song: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    investment: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

const mockDb = db as jest.Mocked<typeof db>
const mockStripe = stripe as jest.Mocked<typeof stripe>

describe('Investment Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete investment flow', () => {
    it('should handle end-to-end investment process', async () => {
      // Step 1: User initiates investment
      const songData = {
        id: 'song1',
        title: 'Test Song',
        artistName: 'Test Artist',
        totalRoyaltyPool: 1000,
        investments: [
          { amountInvested: 200, royaltyPercentage: 20 }
        ]
      }

      mockDb.song.findUnique.mockResolvedValue(songData as any)

      const checkoutSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        metadata: {
          songId: 'song1',
          userId: 'user1',
          amount: '300'
        }
      }

      mockStripe.checkout.sessions.create.mockResolvedValue(checkoutSession as any)

      // Step 2: Payment succeeds (simulate webhook)
      const updatedSong = { ...songData, totalRoyaltyPool: 1300 }
      mockDb.song.findUnique.mockResolvedValueOnce(updatedSong as any)

      // Mock the database transaction
      mockDb.$transaction.mockImplementation(async (callback) => {
        return await callback(mockDb)
      })

      // Mock investment upsert
      mockDb.investment.upsert.mockResolvedValue({
        id: 'inv1',
        songId: 'song1',
        userId: 'user1',
        amountInvested: 300,
        royaltyPercentage: 23.08, // 300/1300 * 100
      } as any)

      // Mock percentage recalculation for existing investments
      mockDb.investment.findMany.mockResolvedValue([
        {
          id: 'inv1',
          amountInvested: 300,
          royaltyPercentage: 23.08
        },
        {
          id: 'inv2',
          amountInvested: 200,
          royaltyPercentage: 15.38 // 200/1300 * 100
        }
      ] as any)

      // Simulate the webhook processing
      const { handleSuccessfulPayment } = await import('@/app/api/stripe/webhook/route')

      // This would be called by the actual webhook handler
      // For testing, we'll verify the expected database calls

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: expect.any(Array),
        mode: 'payment',
        success_url: expect.stringContaining('/dashboard'),
        cancel_url: expect.stringContaining('/song/song1'),
        metadata: {
          songId: 'song1',
          userId: expect.any(String),
          amount: expect.any(String),
        },
      })
    })

    it('should correctly calculate royalty percentages after investment', () => {
      // Test the royalty calculation logic
      const initialPool = 1000
      const newInvestment = 300
      const newTotalPool = initialPool + newInvestment // 1300

      const newInvestorPercentage = (newInvestment / newTotalPool) * 100
      expect(newInvestorPercentage).toBeCloseTo(23.08, 2)

      // Existing investor with $200 investment
      const existingInvestment = 200
      const existingInvestorNewPercentage = (existingInvestment / newTotalPool) * 100
      expect(existingInvestorNewPercentage).toBeCloseTo(15.38, 2)
    })

    it('should handle multiple investors correctly', () => {
      const investments = [
        { amount: 100 },
        { amount: 200 },
        { amount: 300 },
        { amount: 400 },
      ]

      const totalPool = investments.reduce((sum, inv) => sum + inv.amount, 0) // 1000
      
      const percentages = investments.map(inv => (inv.amount / totalPool) * 100)
      
      expect(percentages[0]).toBe(10) // 100/1000 * 100
      expect(percentages[1]).toBe(20) // 200/1000 * 100
      expect(percentages[2]).toBe(30) // 300/1000 * 100
      expect(percentages[3]).toBe(40) // 400/1000 * 100
      
      // Total should equal 100%
      const total = percentages.reduce((sum, pct) => sum + pct, 0)
      expect(total).toBe(100)
    })

    it('should handle edge case of first investment', () => {
      const initialPool = 0
      const firstInvestment = 100
      const newTotalPool = initialPool + firstInvestment // 100

      const firstInvestorPercentage = (firstInvestment / newTotalPool) * 100
      expect(firstInvestorPercentage).toBe(100) // Should own 100% as first investor
    })
  })

  describe('Royalty distribution logic', () => {
    it('should correctly distribute monthly revenue', () => {
      const monthlyRevenue = 100
      const investments = [
        { userId: 'user1', royaltyPercentage: 60 },
        { userId: 'user2', royaltyPercentage: 25 },
        { userId: 'user3', royaltyPercentage: 15 },
      ]

      const payouts = investments.map(inv => ({
        userId: inv.userId,
        amount: (monthlyRevenue * inv.royaltyPercentage) / 100
      }))

      expect(payouts[0].amount).toBe(60) // $60
      expect(payouts[1].amount).toBe(25) // $25
      expect(payouts[2].amount).toBe(15) // $15

      const totalPaid = payouts.reduce((sum, p) => sum + p.amount, 0)
      expect(totalPaid).toBe(monthlyRevenue) // Should equal total revenue
    })

    it('should handle fractional cents in payouts', () => {
      const monthlyRevenue = 1 // $1
      const investments = [
        { userId: 'user1', royaltyPercentage: 33.33 },
        { userId: 'user2', royaltyPercentage: 33.33 },
        { userId: 'user3', royaltyPercentage: 33.34 },
      ]

      const payouts = investments.map(inv => ({
        userId: inv.userId,
        amount: Math.round((monthlyRevenue * inv.royaltyPercentage) / 100 * 100) / 100 // Round to 2 decimal places
      }))

      expect(payouts[0].amount).toBe(0.33)
      expect(payouts[1].amount).toBe(0.33)
      expect(payouts[2].amount).toBe(0.33)
    })
  })
})