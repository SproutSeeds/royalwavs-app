# File Storage Configuration

## ⚠️ IMPORTANT: Do NOT store uploaded files in git!

The current upload system is configured for development only and does not save files locally to avoid bloating the git repository.

## Production Storage Setup

For production, you MUST configure cloud storage. Choose one of these providers:

### Option 1: AWS S3 (Recommended)
```bash
npm install aws-sdk
```

Add to your .env:
```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=royalwavs-audio-files
```

### Option 2: Google Cloud Storage
```bash
npm install @google-cloud/storage
```

Add to your .env:
```
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=royalwavs-audio-files
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### Option 3: Cloudinary (Easiest)
```bash
npm install cloudinary
```

Add to your .env:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Implementation

Update `/src/app/api/upload/route.ts` to integrate with your chosen cloud storage provider. The current version only simulates uploads to prevent local file storage.

## Security Notes

- Never commit uploaded files to git
- Always validate file types and sizes
- Implement proper access controls for file URLs
- Consider CDN integration for better performance