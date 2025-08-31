# RoyalWavs - Song Royalty Investment Platform

A streamlined platform where fans can invest in song royalties and artists can raise funds from their music.

## Core Features

- **Simple Investment Model**: One card per song, load money to buy more royalty shares
- **Clean Design**: Professional cards using album artwork without complex design
- **Real-time Updates**: See investment progress and monthly earnings
- **Stripe Integration**: Seamless payments and payouts
- **Artist Dashboard**: Upload songs and track revenue

## Tech Stack

- **Frontend**: Next.js 14 with Tailwind CSS
- **Backend**: Next.js API routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe for investments and payouts
- **Deployment**: Vercel (recommended)

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd royalwavs
npm install
```

### 2. Database Setup
```bash
# Install PostgreSQL locally or use a cloud provider
# Update DATABASE_URL in .env

# Run database migrations
npx prisma migrate dev
npx prisma generate
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Fill in your API keys:
# - Google OAuth credentials
# - Stripe keys (test mode)
# - Database URL
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Required API Keys

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000` and `http://localhost:3000/api/auth/callback/google` to authorized URLs

### Stripe
1. Create account at [Stripe](https://stripe.com)
2. Get publishable and secret keys from dashboard
3. Set up webhook endpoint: `http://localhost:3000/api/stripe/webhook`
4. Add webhook events: `checkout.session.completed`

## Project Structure

```
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # User dashboard
│   │   ├── song/[id]/      # Individual song pages
│   │   └── upload/         # Artist upload page
│   ├── components/         # Reusable components
│   │   ├── SongCard.tsx    # Main card component
│   │   ├── InvestmentForm.tsx
│   │   └── Navigation.tsx
│   └── lib/               # Utilities and config
│       ├── db.ts          # Prisma client
│       ├── auth.ts        # NextAuth config
│       └── stripe.ts      # Stripe client
├── prisma/
│   └── schema.prisma      # Database schema
└── package.json
```

## How It Works

1. **Artists** upload songs with album art and set a royalty pool size
2. **Investors** browse songs and invest money to buy royalty shares
3. **Smart Calculation**: System automatically calculates ownership percentages
4. **Monthly Payouts**: Artists update revenue, investors get proportional payouts
5. **Growing Investment**: Users can add more money to increase their share

## Database Schema

- **Users**: Authentication and payment info
- **Songs**: Track details and royalty pools
- **Investments**: User ownership in songs (one record per user/song pair)
- **Payouts**: Historical earnings distribution

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Update NEXTAUTH_URL to your production domain
4. Set up production database (Supabase, Railway, etc.)

### Database Migration
```bash
# For production deployment
npx prisma migrate deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for music lovers and artists worldwide.