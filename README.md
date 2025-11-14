# AdPlatform

A full-stack AI-powered marketplace for creating, managing, and enhancing advertisement posts with intelligent content generation.

## Overview

AdPlatform is a production-ready web application that combines modern web technologies with generative AI to streamline the ad creation process. Users can authenticate, create posts, and leverage AI to enhance their content with optimized titles, descriptions, hashtags, and custom-generated imagery.

## Demo

**[View Live Demo Video](https://drive.google.com/file/d/1Nqyk5QjppxGTPtq7SRDob4487VvLOHS1/view?usp=sharing)**

## Screenshots

| Main Feed | AI Enhancement | Final Post |
|-----------|----------------|------------|
| ![Feed](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%201.jpg) | ![Creation](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%202.png) | ![Post](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%203.jpg) |

The platform features a clean, intuitive interface with real-time AI content generation and seamless post management.

## Features

### Authentication & Security
- **Multi-provider authentication** via NextAuth.js v5
  - Email/password with secure hashing
  - Google OAuth 2.0 integration
- **Email verification** using Resend
- **Protected API routes** with granular error messaging
- **Session-based authorization** for all sensitive operations

### Content Management
- **Dynamic ad feed** with real-time updates
- **Rich post creation** supporting:
  - Text content (title, description)
  - Media uploads
  - Price specifications
  - Category/sub-category organization
- **Ownership-based deletion** with automatic media cleanup
- **Chronological sorting** (newest first)

### AI-Powered Features
- **Content Enhancement** (Google Gemini 2.5 Flash)
  - Optimized ad titles
  - Professional descriptions
  - Relevant hashtag generation
- **Image Generation** (Google Imagen API)
  - Custom thumbnail creation
  - Intelligent fallback system
  - Automatic storage integration

### Social Integration
- **Automated webhook distribution** to simulated platforms
  - WhatsApp integration endpoint
  - Facebook integration endpoint
- Fire-and-forget architecture for non-blocking operations

### Developer Experience
- **Comprehensive error handling** with user-friendly messages
- **Loading states** for all async operations
- **API documentation** via Postman collection
- **Type-safe database** operations with Prisma

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (App Router), React, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | NextAuth.js v5 (Auth.js) |
| **File Storage** | Local filesystem (`/public/uploads`) |
| **AI Services** | Google Gemini, Google Imagen (via Vercel AI SDK) |
| **Email** | Resend |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Postman Desktop App (for API testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/Muhammedbeig/ad-platform-demo.git
cd ad-platform-demo

# Install dependencies
npm install
```

### Configuration

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE my_ad_db;
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/my_ad_db
   
   # NextAuth
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email
   RESEND_API_KEY=your_resend_api_key
   
   # AI Services
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   ```

3. **Initialize database**
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

```bash
# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## API Testing

The repository includes a complete Postman collection for API testing and documentation.

### Setup Instructions

1. Open **Postman Desktop App**
2. Click **Import**
3. Select `AdPlatform.postman_collection.json` from the repository
4. The "AdPlatform API" collection will be available with all endpoints

### Authentication for Protected Routes

To test authenticated endpoints:

1. Log in through the web interface at `http://localhost:3000`
2. Postman Desktop will automatically use your browser's session cookie
3. Execute protected route tests directly from the collection

## Project Structure

```
ad-platform-demo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (pages)/           # Page components
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── AdPlatform.postman_collection.json
```

## API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/signup` | POST | Create new account | No |
| `/api/auth/signin` | POST | Login | No |
| `/api/check-user` | POST | Verify credentials | No |
| `/api/ads` | GET | Fetch all ads | No |
| `/api/ads` | POST | Create new ad | Yes |
| `/api/ads/:id` | DELETE | Delete ad | Yes (owner) |
| `/api/enhance-ad` | POST | AI content enhancement | Yes |
| `/api/generate-image` | POST | AI image generation | Yes |

## Development

```bash
# Run development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is available for educational and portfolio purposes.

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Google AI**
