# Music Website Project Structure

## Overview
Successfully restructured the SE357-FE project to use layout-based routing for a music listening website.

## Project Structure

```
src/
├── app/                    # App routes (Next.js-style structure)
│   ├── layout.tsx         # Main layout with sidebar
│   ├── page.tsx           # Home page
│   ├── admin/
│   │   └── page.tsx       # Admin dashboard
│   └── auth/
│       └── login/
│           └── page.tsx   # Login page
│
├── components/            # Reusable components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── MusicPlayer.tsx   # Music player controls
│   └── TrackList.tsx     # Track listing
│
├── styles/               # CSS modules
│   ├── layout.css       # Layout styles
│   ├── page.css         # Page styles
│   ├── auth.css         # Authentication styles
│   └── admin.css        # Admin dashboard styles
│
├── lib/                  # Utilities
│   └── icons.tsx        # SVG icon components
│
├── main.tsx             # App entry with router
└── index.css            # Global styles
```

## Key Features

### ✨ Design
- **Glassmorphism UI** with backdrop blur effects
- **Gradient backgrounds** (purple/blue theme)
- **Smooth animations** and transitions
- **Responsive design** with mobile support
- **Modern typography** using Inter font

### 🎵 Components
- **Sidebar Navigation** with active states
- **Music Player** with play/pause, seek, volume controls
- **Track List** with sample music data
- **Admin Dashboard** with stats cards
- **Login Page** with form validation

### 🛣️ Routing
- Layout-based routing using React Router
- Nested routes with Outlet
- Separate auth routes (no sidebar)
- Named routes: `/`, `/search`, `/library`, `/settings`, `/admin`, `/auth/login`

## Technologies Used
- **React 19.2.0**
- **React Router DOM** (latest)
- **TypeScript**
- **Vite** for build tooling
- **Vanilla CSS** with modern features

## Running the Project
```bash
npm run dev
```

The website runs on http://localhost:5173

## Next Steps
You can extend this by:
1. Adding more pages (Search, Library, Settings)
2. Implementing actual music playback
3. Connecting to a backend API
4. Adding user authentication
5. Creating playlist management features
6. Adding music upload functionality
