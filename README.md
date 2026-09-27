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
