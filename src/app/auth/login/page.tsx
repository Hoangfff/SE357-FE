import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import '../../../styles/auth-form.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Check for success message from OTP verification
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }

        // Load remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [location.state]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password);

            // Store both access token and refresh token
            authService.storeTokens(response.accessToken, response.refreshToken);

            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Decode token to get user role
            const decoded = authService.decodeToken(response.accessToken);

            if (decoded) {
                localStorage.setItem('userRole', decoded.role);
                localStorage.setItem('userEmail', decoded.email);

                // Navigate based on role
                if (decoded.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                // Default navigation if decode fails
                navigate('/home');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <h3>CHÀO MỪNG TRỞ LẠI</h3>
                <h2>Đăng nhập vào tài khoản</h2>
            </div>

            <form className="auth-form-content" onSubmit={handleLogin}>
                {error && (
                    <div className="error-message" style={{
                        color: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message" style={{
                        color: '#51cf66',
                        backgroundColor: 'rgba(81, 207, 102, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {successMessage}
                    </div>
                )}

                <div className="form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-field">
                    <label>Mật khẩu</label>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            👁
                        </button>
                    </div>
                </div>

                <div className="form-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Nhớ tôi</span>
                    </label>
                    <Link to="/auth/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'TIẾP TỤC'}
                </button>

                <div className="divider">
                    <span>Hoặc</span>
                </div>

                <div className="social-buttons">
                    <button type="button" className="social-btn google">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z'/%3E%3Cpath fill='%2334A853' d='M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z'/%3E%3Cpath fill='%23FBBC05' d='M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z'/%3E%3Cpath fill='%23EA4335' d='M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z'/%3E%3C/svg%3E" alt="Google" />
                        Đăng nhập với Google
                    </button>
                    <button type="button" className="social-btn facebook">
                        <svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        Đăng nhập với Facebook
                    </button>
                    <button type="button" className="social-btn apple">
                        <svg viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                        Đăng nhập với Apple
                    </button>
                </div>

                <div className="auth-switch">
                    Người dùng mới? <Link to="/auth/register"><strong>ĐĂNG KÝ TẠI ĐÂY</strong></Link>
                </div>
            </form>

            <button className="help-button">?</button>
        </div>
    );
};

export default LoginPage;
