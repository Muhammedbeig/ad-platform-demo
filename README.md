# AdPlatform - Full-Stack AI-Powered Marketplace

AdPlatform is a modern, full-stack web application that allows users to create, view, and enhance advertisement posts with generative AI. It is a feature-rich platform demonstrating a complete, production-ready workflow from user authentication to AI content generation and social media integration.

## 🎬 Live Demo Video

A short video demonstrating the live, running product:

**[Watch the Full Demo on Google Drive](https://drive.google.com/file/d/1Nqyk5QjppxGTPtq7SRDob4487VvLOHS1/view?usp=sharing)**

---

## 📸 Screenshots

### Main Ad Feed
The main page displays a clean, scrollable feed of all user-posted ads, sorted by newest first.
![Main Ad Feed](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%201.png)

### AI-Powered Ad Creation
A modal form allows users to create new ads, with on-demand AI features to enhance their post.
![AI-Powered Ad Creation](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%202.png)

### Final Post Example
A finished post showing the user's image, AI-enhanced title, AI-generated description, and AI-generated hashtags.
![Final Post Example](https://raw.githubusercontent.com/Muhammedbeig/ad-platform-demo/main/Screenshot%203.png)

---

## ✨ Core Features

### 1. Authentication
* **Email & Password:** Full sign-up and login flow.
* **Google Sign-In:** OAuth 2.0 integration.
* **Custom Email Verification:** Users receive a verification link via Resend before they can log in.
* **Protected Routes:** Custom API route (`/api/check-user`) provides specific login error messages (e.g., "Email not verified", "No user found").

### 2. Ad Feed & Post Creation
* **Dynamic Feed:** The main page fetches all ads from the PostgreSQL database and displays them in a scrollable feed, sorted by newest.
* **Create Post:** A modal form allows users to post new ads with a title, description, price, media, and categories/sub-categories.
* **Delete Post:** Logged-in users can delete their own posts. This securely checks for ownership on the backend and also removes all associated media from storage.

### 3. Generative AI Features
* **On-Demand Content Generation:** An "Enhance with AI" button uses the Google Gemini API (`gemini-2.5-flash`) to enhance the ad title, generate a new description, and create relevant hashtags.
* **On-Demand Image Generation:** A "Generate AI Thumbnail" button uses the Google Imagen API (via Vercel AI SDK) to generate a relevant banner image for the post, which is then saved to local storage.
* **Smart Fallback:** If the AI image generation fails (e.g., due to billing/permissions), a relevant placeholder image is fetched and used.

### 4. Social Media Integration
* **Mock Webhooks:** After an ad is successfully created, a "fire-and-forget" function sends the ad data to mock API endpoints (`/api/webhooks/whatsapp` and `/api/webhooks/facebook`), simulating a social media share.

### 5. Professional Standards
* **Loading & Error Handling:** All forms and API calls feature loading spinners and display clear, user-friendly error messages (e.g., "Model is overloaded," "Billing limit reached").
* **API Documentation:** The repository includes a `AdPlatform.postman_collection.json` file for complete API documentation and testing.

---

## 💻 Tech Stack

* **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS
* **Backend:** Next.js (API Routes), Node.js
* **Database:** PostgreSQL with Prisma
* **Authentication:** NextAuth.js v5 (Auth.js)
* **Storage:** Local File System (`/public/uploads`)
* **AI (Text):** Google Gemini (via Vercel AI SDK)
* **AI (Image):** Google Imagen (via Vercel AI SDK)
* **Email:** Resend

---

## 🚀 How to Run This Project

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL
- Postman (for testing API)

### 2. Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Muhammedbeig/ad-platform-demo.git](https://github.com/Muhammedbeig/ad-platform-demo.git)
    cd ad-platform-demo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3. Environment Setup
1.  **Create your database:** Create a new PostgreSQL database (e.g., `my_ad_db`).
2.  **Set up environment variables:** Copy the `.env.example` file to a new file named `.env` and fill in all the required API keys.
    ```bash
    cp .env.example .env
    ```
    You will need keys for:
    - `DATABASE_URL`
    - Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
    - Resend (`RESEND_API_KEY`)
    - Google AI (`GOOGLE_GENERATIVE_AI_API_KEY`)

### 4. Run Database Migrations
Run the following command to sync your database schema:
```bash
npx prisma migrate dev
