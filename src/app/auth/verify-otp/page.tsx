import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import '../../../styles/auth-form.css';
import '../../../styles/forgot-password.css';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from navigation state (passed from register page)
    const email = location.state?.email || '';

    useEffect(() => {
        // Redirect to register if no email is provided
        if (!email) {
            navigate('/auth/register');
        }
    }, [email, navigate]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError('');

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ mã OTP 6 số');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.verifyOtp(email, otpCode);
            setSuccessMessage(response.message || 'Xác minh thành công!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/auth/login', {
                    state: { message: 'Tài khoản đã được xác minh, vui lòng đăng nhập.' }
                });
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Xác minh thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Re-trigger registration to resend OTP (if backend supports this)
            // For now, just show a message
            setSuccessMessage('Vui lòng kiểm tra lại email của bạn');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể gửi lại mã OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <div className="step-indicator">
                    <div className="step-dot completed">1</div>
                    <div className="step-line"></div>
                    <div className="step-dot active">2</div>
                </div>
                <h2>Xác minh tài khoản</h2>
            </div>

            <form className="auth-form-content" onSubmit={handleSubmit}>
                <p className="step-description">
                    Chúng tôi đã gửi mã xác nhận 6 số đến <strong>{email}</strong>
                </p>

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

                <div className="otp-container" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="otp-input"
                            required
                            disabled={isLoading}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'ĐANG XÁC MINH...' : 'XÁC NHẬN'}
                </button>

                <div className="resend-otp">
                    Không nhận được mã?{' '}
                    <button
                        type="button"
                        className="resend-btn"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                    >
                        Gửi lại
                    </button>
                </div>

                <div className="auth-switch">
                    <Link to="/auth/register">← Quay lại đăng ký</Link>
                </div>
            </form>

            <button className="help-button">?</button>
        </div>
    );
};

export default VerifyOtpPage;
