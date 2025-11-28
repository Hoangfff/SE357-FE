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
        path: 'admin',
        element: <AdminPage />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
