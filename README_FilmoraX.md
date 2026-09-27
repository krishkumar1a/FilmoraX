# 🎬 FilmoraX

> A full-stack movie discovery and personal cinema platform built with Next.js, TypeScript, PostgreSQL, Prisma, Auth.js, and the TMDB API.

FilmoraX is a full-stack web application where users can discover movies, create personalized profiles, manage their top 5 favorites, write reviews, organize private movie collections, and test their movie knowledge through interactive quizzes.

## 🌐 Live Demo

**FilmoraX:**  
https://filmorax-six.vercel.app

**GitHub:**  
https://github.com/krishkumar1a/FilmoraX

---

## ✨ Features

### 🎞️ Movie Discovery

- Browse popular movies using the TMDB API
- View movie posters, ratings, release information, and details
- Dedicated movie detail pages
- Server-side API routes for movie data
- Reusable TMDB API integration

### 👤 Authentication & Profiles

- Google OAuth authentication using Auth.js
- Prisma Adapter integration
- User profile creation
- Unique usernames
- Profile image support
- User-specific application data

### ❤️ Top 5 Favorites

- Add movies to a personal favorites collection
- Maintain up to 5 favorite positions
- Preserve favorite positions
- Prevent duplicate movies
- Favorites are associated with individual users

### ⭐ Movie Reviews

- Authenticated users can rate movies from 1–5
- Add written movie reviews
- View reviews associated with a movie
- One review per user per movie
- Existing reviews can be updated

### 📚 Private Movie Lists

- Create personal movie lists
- Add a name and description to each list
- Organize movies into private collections
- Lists are associated with the authenticated user
- Prevent duplicate movies inside the same list

### 🧠 Interactive Movie Quiz

- Generate movie-based questions using TMDB data
- Multiple-choice questions with four options
- Create quiz attempts for authenticated users
- Calculate scores on the server
- Store submitted answers
- Track completed quiz attempts and scores
- Display recent quiz history on the user profile

### 🎨 Responsive UI

- Dark cinematic interface
- Movie-focused layouts
- Responsive design
- Tailwind CSS styling
- Interactive user experience

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive UI |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and schema management |
| Auth.js | Authentication |
| Google OAuth | User authentication |
| TMDB API | Movie data |
| Vercel | Deployment |
| Git & GitHub | Version control |

---

## 🏗️ Application Architecture

The application follows a full-stack Next.js architecture:

**Frontend**

React + Next.js + Tailwind CSS

↓

**Next.js API Routes**

Movies / Favorites / Reviews / Lists / Quiz

↓

**Prisma ORM**

↓

**PostgreSQL**

↓

**TMDB API**

Movie data is fetched from TMDB through reusable server-side API utilities.

---

## 🗄️ Database Design

FilmoraX uses PostgreSQL with Prisma ORM.

Main database models include:

- User
- Account
- Session
- Review
- Favorite
- MovieList
- MovieListItem
- QuizQuestion
- QuizAttempt
- QuizAttemptQuestion

### Important Relationships

- Users can have multiple favorites
- Users can create multiple private movie lists
- Users can review multiple movies
- Each user can have one review per movie
- Movie lists contain multiple movie items
- Quiz attempts contain individual question responses
- Authentication data is linked to users through Auth.js and Prisma

The schema uses relational constraints, unique constraints, indexes, and cascading deletes where appropriate.

---

## 🔌 API Routes

FilmoraX uses Next.js API routes for backend functionality.

| Endpoint | Purpose |
|---|---|
| `/api/movies` | Fetch popular movies from TMDB |
| `/api/movies/[id]/reviews` | Read and manage movie reviews |
| `/api/favorites` | Manage user favorites |
| `/api/lists` | Create and retrieve private movie lists |
| `/api/quiz/start` | Start a quiz attempt |
| `/api/quiz/questions` | Generate quiz questions |
| `/api/quiz/complete` | Submit answers and calculate quiz score |
| `/api/auth/[...nextauth]` | Authentication flow |

Authenticated routes validate the current user session before accessing user-specific data.

---

## 🧠 Quiz Data Flow

The quiz system uses a database-backed workflow:

User starts quiz

↓

Quiz attempt is created

↓

Question is generated using TMDB data

↓

Question is stored in the database

↓

User submits answer

↓

Server validates the answer

↓

Score is calculated

↓

Answer is stored

↓

Completed quiz attempt is stored

↓

Score and quiz history are displayed

---

## 📁 Project Structure

The main project structure is:

- `app/` — Next.js pages and API routes
- `components/` — Reusable React components
- `lib/` — Prisma and TMDB utilities
- `prisma/` — Database schema and migrations
- `public/` — Static assets
- `auth.ts` — Auth.js configuration
- `next.config.ts` — Next.js configuration
- `package.json` — Project dependencies and scripts

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/krishkumar1a/FilmoraX.git
cd FilmoraX
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

Add:

```env
DATABASE_URL="your_postgresql_connection_string"

TMDB_API_READ_ACCESS_TOKEN="your_tmdb_read_access_token"

GOOGLE_CLIENT_ID="your_google_client_id"

GOOGLE_CLIENT_SECRET="your_google_client_secret"

AUTH_SECRET="your_auth_secret"
```

Use your own credentials for each service.

### 4. Set Up the Database

Run:

```bash
npx prisma migrate dev
```

Then:

```bash
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

---

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection |
| `TMDB_API_READ_ACCESS_TOKEN` | TMDB API authentication |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | Auth.js session secret |

> Never commit `.env` files or API credentials to GitHub.

---

## 🚀 Deployment

FilmoraX is deployed using Vercel.

Before deployment, configure the required environment variables in the deployment environment and ensure the PostgreSQL database is accessible from the deployed application.

---

## 🔮 Future Improvements

- Improve quiz question security and attempt ownership validation
- Add advanced movie search and filtering
- Add pagination and infinite scrolling
- Add more movie categories and recommendations
- Improve movie list management
- Add detailed user statistics
- Add automated testing
- Improve API rate-limit handling
- Improve loading and error states
- Add additional accessibility improvements

---

## 📚 External API

FilmoraX uses the TMDB API for movie-related information such as movie metadata, posters, ratings, and release information.

This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 👨‍💻 Author

**Krish Kumar**

GitHub:  
https://github.com/krishkumar1a

LinkedIn:  
Add your LinkedIn profile here

---

## 📄 License

This project is currently intended as a personal/academic portfolio project.
