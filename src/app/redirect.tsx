import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated (you can add real auth logic here)
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!isAuthenticated) {
            navigate('/auth/login');
        }
    }, [navigate]);

    return null;
};

export default RedirectToAuth;
