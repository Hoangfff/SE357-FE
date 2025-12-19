import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenManager } from '@/lib/apiClient';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Decodes a JWT token to check expiration
 */
function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        // exp is in seconds, Date.now() is in milliseconds
        const expirationTime = decoded.exp * 1000;
        // Add 30 second buffer to prevent edge cases
        return Date.now() >= expirationTime - 30000;
    } catch {
        return true; // If we can't decode, treat as expired
    }
}

/**
 * Attempts to refresh the access token using the refresh token
 */
async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        if (data.accessToken) {
            tokenManager.setToken(data.accessToken);
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

/**
 * ProtectedRoute component that checks authentication
 * Redirects to /auth/login if user is not authenticated
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = tokenManager.getToken();

            // No access token at all
            if (!accessToken) {
                // Try to refresh
                const refreshed = await tryRefreshToken();
                setIsAuthenticated(refreshed);
                setIsChecking(false);
                return;
            }

            // Check if access token is expired
            if (isTokenExpired(accessToken)) {
                // Try to refresh
                const refreshed = await tryRefreshToken();
                if (!refreshed) {
                    // Clear all tokens if refresh failed
                    tokenManager.clearAll();
                }
                setIsAuthenticated(refreshed);
                setIsChecking(false);
                return;
            }

            // Token exists and is not expired
            setIsAuthenticated(true);
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
