import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiClient, { userSession, tokenManager, refreshAccessToken } from '@/lib/apiClient';
import { authService } from '@/services/authService';
import { ENDPOINTS } from '@/config/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks authentication
 * Uses tokenManager and userSession for auth state
 * Redirects to /auth/login if user is not authenticated
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = tokenManager.getToken();

            if (token) {
                // Restore user session from localStorage if needed
                if (!userSession.getUser()) {
                    const storedRole = localStorage.getItem('userRole');
                    const storedEmail = localStorage.getItem('userEmail');
                    if (storedRole && storedEmail) {
                        userSession.setUser({
                            id: '',
                            email: storedEmail,
                            role: storedRole,
                        });
                    }
                }
                try {
                    await authService.refreshAuthToken();
                    setIsAuthenticated(true);
                } catch (err) {
                    console.log("Error while refreshing: ", err);
                    setIsAuthenticated(false);
                }
            }
            setIsChecking(false);
        };

        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#121212',
                color: '#fff',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #333',
                        borderTopColor: '#1db954',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px',
                    }} />
                    <p>Loading...</p>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
        // Save the current location to redirect back after login
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Authenticated, render children
    return <>{children}</>;
};

export default ProtectedRoute;
