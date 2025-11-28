# 🎵 MusicHub - Modern Music Streaming Website

A beautiful, modern music streaming website built with React, TypeScript, and Vite. Features a premium UI with glassmorphism design, smooth animations, and layout-based routing.

![Music Website](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)

## ✨ Features

### 🎨 Premium Design
- **Glassmorphism UI** with backdrop blur effects
- **Vibrant gradient backgrounds** (purple/blue theme)
- **Smooth animations** and micro-interactions
- **Responsive design** - works on desktop and mobile
- **Modern typography** using Google's Inter font
- **Custom scrollbars** and focus states

### 🎵 Music Player
- Play/Pause controls
- Seek bar for track navigation
- Volume control
- Track information display
- Queue management (coming soon)

### 🧭 Navigation
- **Layout-based routing** using React Router
- Sidebar navigation with active states
- Nested routes with Outlet pattern
- Separate authentication routes

### 📱 Pages
- **Home** - Featured playlists and recently played tracks
- **Search** - Search for songs, artists, and albums (placeholder)
- **Library** - Your saved music and playlists (placeholder)
- **Settings** - App configuration (placeholder)
- **Admin** - Dashboard with statistics
- **Login** - Authentication page

## 🏗️ Project Structure

```
src/
├── app/                      # App routes (Next.js-style structure)
│   ├── layout.tsx           # Main layout with sidebar
│   ├── page.tsx             # Home page
│   ├── admin/
│   │   └── page.tsx         # Admin dashboard
│   └── auth/
│       └── login/
│           └── page.tsx     # Login page
│
├── components/              # Reusable components
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── MusicPlayer.tsx     # Music player controls
│   └── TrackList.tsx       # Track listing component
│
├── styles/                  # CSS modules
│   ├── layout.css          # Layout styles
│   ├── page.css            # Page styles
│   ├── auth.css            # Authentication styles
│   └── admin.css           # Admin dashboard styles
│
├── lib/                     # Utilities
│   ├── icons.tsx           # SVG icon components
│   └── utils.ts            # Helper functions
│
├── config/                  # Configuration
│   └── api.ts              # API endpoints
│
├── constants/               # App constants
│   └── index.ts            # Constant values
│
├── hooks/                   # Custom React hooks
│   └── index.ts            # useLocalStorage, useMediaQuery
│
├── providers/               # Context providers
│   └── PlayerProvider.tsx  # Music player state
│
├── services/                # API services
│   ├── authService.ts      # Authentication API
│   └── musicService.ts     # Music data API
│
├── types/                   # TypeScript types
│   └── index.ts            # Type definitions
│
├── main.tsx                 # App entry with router
└── index.css                # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd SE357-FE
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🛠️ Technologies Used

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Vanilla CSS** - Styling with modern features

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎯 Key Concepts

### Layout-Based Routing
Instead of using a single `App.tsx`, we use a **layout pattern** similar to Next.js:
- `app/layout.tsx` - Wraps all pages with sidebar
- `app/page.tsx` - Home page component
- Nested routes use `<Outlet />` from React Router

### Component Structure
- **Presentational components** in `/components`
- **Page components** in `/app` folders
- **Shared logic** in `/hooks` and `/providers`
- **Business logic** in `/services`

### Styling Approach
- **CSS custom properties** for theming
- **Glassmorphism** design pattern
- **Mobile-first** responsive design
- **Smooth animations** with CSS transitions

## 🎨 Design System

### Colors
- Primary: `#667eea` → `#764ba2` (gradient)
- Background: `#0f0c29` → `#302b63` → `#24243e` (gradient)
- Glass effect: `rgba(255, 255, 255, 0.05)`

### Typography
- Font: **Inter** (Google Fonts)
- Weights: 400, 500, 600, 700, 800

### Spacing
- Base unit: `1rem` (16px)
- Consistent padding/margins using multiples

## 🔜 Next Steps

Here are some features you can add next:

1. **Actual Music Playback**
   - Integrate with a music API (Spotify, SoundCloud)
   - Implement audio streaming
   - Add playlist functionality

2. **Search Functionality**
   - Create search page
   - Implement search API
   - Add filters and sorting

3. **User Authentication**
   - Connect login to backend
   - Add registration page
   - Implement JWT tokens

4. **Library Management**
   - Create user playlists
   - Save favorite tracks
   - Recent plays tracking

5. **Advanced Features**
   - Lyrics display
   - Social sharing
   - Queue management
   - Equalizer controls

## 📝 Notes

- The old `App.tsx` and `App.css` files are kept for reference but not used
- TypeScript strict mode is enabled for better type safety
- All components use functional components with hooks
- No external UI libraries - pure CSS for full control

## 🤝 Contributing

Feel free to extend this project! Some areas to explore:
- Add more pages and routes
- Integrate with real music APIs
- Improve accessibility (ARIA labels)
- Add tests (Jest, React Testing Library)
- Implement dark/light theme toggle

## 📄 License

This project is part of SE357 coursework.

---

**Built with ❤️ using modern web technologies**
