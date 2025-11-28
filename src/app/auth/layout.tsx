import { Outlet } from 'react-router-dom';
import '../../styles/auth-layout.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div className="auth-branding">
                    <div className="brand-logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill="white" />
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
