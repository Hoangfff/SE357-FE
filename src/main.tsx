import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'

// App Routes
import Layout from './app/layout'
import HomePage from './app/page'
import AdminPage from './app/admin/page'
import LoginPage from './app/auth/login/page'

// Import auth components
import AuthLayout from './app/auth/layout'
import RegisterPage from './app/auth/register/page'
import ForgotPasswordPage from './app/auth/forgot-password/page'
import VerifyOtpPage from './app/auth/verify-otp/page'
import AdminLayout from './app/admin/components/AdminLayout'
import AccountsPage from './app/admin/accounts/page'
import ApplicationsPage from './app/admin/applications/page'
import MusicPage from './app/admin/music/page'
import ReportsPage from './app/admin/reports/page'
import HelpCenterPage from './app/admin/help/page'

// Import new pages
import PlaylistsPage from './app/playlists/page'
import LikedSongsPage from './app/liked-songs/page'
import AlbumsPage from './app/albums/page'
import ArtistsPage from './app/artists/page'

// Create router with layout-based structure
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOtpPage />,
      },
    ],
  },
  {
    path: '/home',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'playlists',
        element: <PlaylistsPage />,
      },
      {
        path: 'liked-songs',
        element: <LikedSongsPage />,
      },
      {
        path: 'albums',
        element: <AlbumsPage />,
      },
      {
        path: 'artists',
        element: <ArtistsPage />,
      },
      {
        path: 'search',
        element: <div style={{ padding: '2rem' }}><h1>Search Page</h1><p>Coming soon...</p></div>,
      },
      {
        path: 'library',
        element: <div style={{ padding: '2rem' }}><h1>Your Library</h1><p>Coming soon...</p></div>,
      },
      {
        path: 'settings',
        element: <div style={{ padding: '2rem' }}><h1>Settings</h1><p>Coming soon...</p></div>,
      },
      {
        path: '*',
        element: <div style={{ padding: '2rem' }}><h1>Comming Soon...</h1></div>
      }
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'applications',
        element: <ApplicationsPage />,
      },
      {
        path: 'music',
        element: <MusicPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'help',
        element: <HelpCenterPage />,
      },
      {
        path: '*',
        element: <div style={{ padding: '2rem' }}><h1>Comming Soon</h1></div>
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
