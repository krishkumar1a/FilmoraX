# 🎬 FilmoraX

> A modern movie discovery and personal cinema platform built with Next.js.

FilmoraX is a movie-focused web application where users can discover films, create a personal profile, save favorite movies, manage private movie lists, and test their movie knowledge through quizzes.

## 🌐 Live Demo

**FilmoraX:**  
https://filmorax-six.vercel.app

---

## ✨ Features

### 🎞️ Movie Discovery

- Browse popular movies
- Movie posters and details powered by TMDB
- Movie ratings and release information
- Dedicated movie pages

### 👤 User Profiles

- Google authentication
- Personalized user profile
- Profile image support
- Username/name display
- Personal cinema archive

### ❤️ Favorite Movies

- Save movies to your personal favorites
- Maintain a personal top 5 favorite movies
- Favorite positions are preserved
- Remove movies from favorites directly from your profile
- Favorites are private to each user

### 📚 Private Movie Lists

- Create personal movie lists
- Organize movies into private collections
- Manage your own movie library

### 🧠 Movie Quiz

- Test your movie knowledge
- Track quiz attempts
- Store quiz scores
- View recent quiz history on your profile

### 🎨 Cinema-Inspired UI

- Dark cinematic interface
- Gold and warm accent colors
- Responsive design
- Movie-focused layouts and animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Prisma | Database ORM |
| PostgreSQL | Database |
| Auth.js / NextAuth | Authentication |
| Google OAuth | User login |
| TMDB API | Movie data |
| Vercel | Deployment |

---

## 🏗️ Project Structure

```text
filmorax/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── favorites/
│   │   └── movies/
│   │
│   ├── favorites/
│   ├── lists/
│   ├── movies/
│   ├── profile/
│   ├── quiz/
│   ├── setup-username/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── MyListsSection.tsx
│   └── RemoveFavoriteButton.tsx
│
├── lib/
│   ├── prisma.ts
│   └── tmdb.ts
│
├── prisma/
│   └── schema.prisma
│
├── auth.ts
├── package.json
└── README.md


🚀 Getting Started
1. Clone the Repository
git clone https://github.com/krishkumar1a/FilmoraX.git
2. Enter the Project
cd FilmoraX
3. Install Dependencies
npm install
4. Configure Environment Variables

Create a .env file in the project root:

DATABASE_URL="your_postgresql_database_url"

TMDB_ACCESS_TOKEN="your_tmdb_access_token"

AUTH_SECRET="your_auth_secret"

GOOGLE_CLIENT_ID="your_google_client_id"

GOOGLE_CLIENT_SECRET="your_google_client_secret"

Never commit your .env file or expose your API keys and secrets publicly.

5. Generate Prisma Client
npx prisma generate
6. Run Database Migrations
npx prisma migrate dev
7. Start the Development Server
npm run dev

Open the application at:

http://localhost:3000
🔐 Authentication

FilmoraX uses Auth.js / NextAuth with Google OAuth.

For local development, configure the Google OAuth callback URL:

http://localhost:3000/api/auth/callback/google

For production:

https://filmorax-six.vercel.app/api/auth/callback/google
🎬 TMDB

FilmoraX uses The Movie Database (TMDB) to retrieve movie information such as:

Movie titles
Posters
Release dates
Ratings
Movie details

A TMDB API access token is required to run the project locally.

🗄️ Database

FilmoraX uses PostgreSQL with Prisma.

The database contains models for:

Users
Authentication accounts
Sessions
Favorites
Movie lists
Movie list items
Reviews
Quiz questions
Quiz attempts
Quiz attempt questions
❤️ Favorites System

Favorites are associated with individual users.

Each favorite contains:

User
 └── Favorites
      ├── Movie ID
      └── Position

The application ensures that a user can only remove their own favorite records.

Users can remove a movie directly from the My 5 Favorite Movies section of their profile.

📚 Private Movie Lists

FilmoraX allows users to create private movie collections.

Users can organize movies into different lists and manage their personal movie library from their account.

🧠 Quiz System

Quiz attempts are stored in the database and associated with the authenticated user.

The profile displays recent quiz activity, including:

Score
Total questions
Percentage
Attempt date
👤 Profile

The FilmoraX profile acts as a personal cinema archive.

The profile includes:

User information
Profile image
Favorite movies
Private movie lists
Quiz history
Movie discovery links
🎨 Design

FilmoraX uses a cinematic visual style inspired by classic movie experiences.

The interface features:

Dark backgrounds
Warm gold accents
Film-inspired visual elements
Responsive layouts
Movie posters
Hover animations
Clean typography
☁️ Deployment

FilmoraX is deployed using Vercel.

Production

https://filmorax-six.vercel.app

Environment variables must be configured in the Vercel project settings.

🔒 Environment Variables

The following environment variables are required:

DATABASE_URL
TMDB_ACCESS_TOKEN
AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

Never publish the actual values of these variables.

📱 Responsive Design

FilmoraX is designed to work across:

Desktop
Laptop
Tablet
Mobile

The interface uses responsive Tailwind CSS layouts to adapt to different screen sizes.

🧪 Development Commands

Start the development server:

npm run dev

Build the project:

npm run build

Start the production server:

npm start
📌 Roadmap

Possible future improvements include:

Movie search
Advanced movie filtering
Genre-based discovery
More quiz categories
Movie reviews and ratings
Improved recommendation system
Watchlist functionality
Social features
More profile customization
Additional movie statistics
👨‍💻 Author

Krish Kumar

GitHub:
https://github.com/krishkumar1a

📄 License

This project is currently intended as a personal/learning project.

⭐ FilmoraX

Discover films. Build your collection. Test your movie knowledge.

🎬 Welcome to your personal cinema archive.

