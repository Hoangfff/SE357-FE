import { Outlet } from 'react-router-dom';
import '../../styles/auth-layout.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div className="auth-branding">
                    <div className="brand-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </div>
                    <div className="brand-text">
                        <h1>MusicStream</h1>
                        <p>Your music, your way</p>
                    </div>
                </div>

                <div className="auth-welcome">
                    <h2>Chào mừng trở lại!</h2>
                    <p className="auth-description">
                        Khám phá hàng triệu bài hát từ các nghệ sĩ yêu thích của bạn.
                        Nghe nhạc mọi lúc, mọi nơi với chất lượng cao nhất.
                    </p>
                </div>

                <div className="auth-stats">
                    <div className="stat-item">
                        <h3>10M+</h3>
                        <p>Bài hát</p>
                    </div>
                    <div className="stat-item">
                        <h3>500K+</h3>
                        <p>Nghệ sĩ</p>
                    </div>
                    <div className="stat-item">
                        <h3>2M+</h3>
                        <p>Người dùng</p>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
