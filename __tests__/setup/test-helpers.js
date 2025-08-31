// Test helper functions and mock data

export const mockUsers = {
  artist1: {
    id: 'user_artist_1',
    name: 'Test Artist',
    email: 'artist@test.com',
    stripeCustomerId: 'cus_test_artist1',
  },
  investor1: {
    id: 'user_investor_1',
    name: 'Test Investor',
    email: 'investor@test.com',
    stripeCustomerId: 'cus_test_investor1',
  },
  investor2: {
    id: 'user_investor_2',
    name: 'Test Investor 2',
    email: 'investor2@test.com',
    stripeCustomerId: 'cus_test_investor2',
  },
}

export const mockSongs = {
  song1: {
    id: 'song_test_1',
    title: 'Amazing Song',
    artistName: 'Test Artist',
    albumArtUrl: 'https://example.com/album1.jpg',
    totalRoyaltyPool: 1000,
    monthlyRevenue: 50,
    artistId: mockUsers.artist1.id,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  song2: {
    id: 'song_test_2',
    title: 'Another Hit',
    artistName: 'Test Artist',
    albumArtUrl: 'https://example.com/album2.jpg',
    totalRoyaltyPool: 2000,
    monthlyRevenue: 100,
    artistId: mockUsers.artist1.id,
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  emptySong: {
    id: 'song_test_empty',
    title: 'New Song',
    artistName: 'Test Artist',
    albumArtUrl: null,
    totalRoyaltyPool: 500,
    monthlyRevenue: 0,
    artistId: mockUsers.artist1.id,
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
}

export const mockInvestments = {
  investment1: {
    id: 'inv_test_1',
    amountInvested: 300,
    royaltyPercentage: 30,
    songId: mockSongs.song1.id,
    userId: mockUsers.investor1.id,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  investment2: {
    id: 'inv_test_2',
    amountInvested: 200,
    royaltyPercentage: 20,
    songId: mockSongs.song1.id,
    userId: mockUsers.investor2.id,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
}

export const mockPayouts = {
  payout1: {
    id: 'payout_test_1',
    amount: 15, // 30% of $50 monthly revenue
    period: '2024-01',
    investmentId: mockInvestments.investment1.id,
    userId: mockUsers.investor1.id,
    stripeTransferId: 'tr_test_1',
    paidAt: new Date('2024-02-01'),
  },
  payout2: {
    id: 'payout_test_2',
    amount: 10, // 20% of $50 monthly revenue
    period: '2024-01',
    investmentId: mockInvestments.investment2.id,
    userId: mockUsers.investor2.id,
    stripeTransferId: 'tr_test_2',
    paidAt: new Date('2024-02-01'),
  },
}

// Helper functions
export function createMockSession(userId: string) {
  const user = Object.values(mockUsers).find(u => u.id === userId)
  return {
    user: {
      id: userId,
      name: user?.name,
      email: user?.email,
      image: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }
}

export function createMockStripeSession(metadata: Record<string, string>) {
  return {
    id: `cs_test_${Date.now()}`,
    url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
    payment_status: 'paid',
    metadata,
  }
}

export function calculateRoyaltyPercentage(investment: number, totalPool: number): number {
  if (totalPool === 0) return 0
  return (investment / totalPool) * 100
}

export function distributeRevenue(monthlyRevenue: number, investments: Array<{ userId: string; royaltyPercentage: number }>) {
  return investments.map(inv => ({
    userId: inv.userId,
    amount: Math.round((monthlyRevenue * inv.royaltyPercentage / 100) * 100) / 100, // Round to 2 decimals
  }))
}

// Test data validation helpers
export function validateSongData(song: any) {
  expect(song).toHaveProperty('id')
  expect(song).toHaveProperty('title')
  expect(song).toHaveProperty('artistName')
  expect(song).toHaveProperty('totalRoyaltyPool')
  expect(song).toHaveProperty('monthlyRevenue')
  expect(typeof song.totalRoyaltyPool).toBe('number')
  expect(typeof song.monthlyRevenue).toBe('number')
  expect(song.totalRoyaltyPool).toBeGreaterThanOrEqual(0)
  expect(song.monthlyRevenue).toBeGreaterThanOrEqual(0)
}

export function validateInvestmentData(investment: any) {
  expect(investment).toHaveProperty('id')
  expect(investment).toHaveProperty('amountInvested')
  expect(investment).toHaveProperty('royaltyPercentage')
  expect(investment).toHaveProperty('songId')
  expect(investment).toHaveProperty('userId')
  expect(typeof investment.amountInvested).toBe('number')
  expect(typeof investment.royaltyPercentage).toBe('number')
  expect(investment.amountInvested).toBeGreaterThan(0)
  expect(investment.royaltyPercentage).toBeGreaterThan(0)
  expect(investment.royaltyPercentage).toBeLessThanOrEqual(100)
}