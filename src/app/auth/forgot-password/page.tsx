import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import '../../../styles/auth-form.css';
import '../../../styles/forgot-password.css';

type Step = 'email' | 'otp' | 'new-password';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.forgotPassword(email);
            setSuccessMessage(response.message || 'OTP đã được gửi đến email của bạn.');
            setStep('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể gửi OTP. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ mã OTP 6 số');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.verifyResetOtp(email, otpCode);
            setSuccessMessage(response.message || 'OTP hợp lệ!');
            setStep('new-password');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'OTP không hợp lệ. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword) {
            setError('Vui lòng nhập mật khẩu mới');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.resetPassword(email, newPassword);
            setSuccessMessage(response.message || 'Đặt lại mật khẩu thành công!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/auth/login', {
                    state: { message: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.' }
                });
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await authService.forgotPassword(email);
            setSuccessMessage(response.message || 'OTP mới đã được gửi đến email của bạn.');
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể gửi lại OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmailStep = () => (
        <form className="auth-form-content" onSubmit={handleEmailSubmit}>
            <p className="step-description">
                Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để xác nhận.
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

            <div className="form-field">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1 }}
            >
                {isLoading ? 'ĐANG GỬI...' : 'GỬI MÃ OTP'}
            </button>

            <div className="auth-switch">
                <Link to="/auth/login">← Quay lại đăng nhập</Link>
            </div>
        </form>
    );

    const renderOtpStep = () => (
        <form className="auth-form-content" onSubmit={handleOtpSubmit}>
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
                {isLoading ? 'ĐANG XÁC NHẬN...' : 'XÁC NHẬN'}
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
                <button type="button" className="back-link" onClick={() => setStep('email')}>
                    ← Thay đổi email
                </button>
            </div>
        </form>
    );

    const renderPasswordStep = () => (
        <form className="auth-form-content" onSubmit={handlePasswordSubmit}>
            <p className="step-description">
                Tạo mật khẩu mới cho tài khoản của bạn.
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

            <div className="form-field">
                <label>Mật khẩu mới</label>
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••"
                        required
                        minLength={6}
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

            <div className="form-field">
                <label>Xác nhận mật khẩu</label>
                <div className="password-field">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••"
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        👁
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1 }}
            >
                {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐẶT LẠI MẬT KHẨU'}
            </button>
        </form>
    );

    const getStepTitle = () => {
        switch (step) {
            case 'email':
                return 'Quên mật khẩu?';
            case 'otp':
                return 'Nhập mã xác nhận';
            case 'new-password':
                return 'Đặt mật khẩu mới';
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-header">
                <div className="step-indicator">
                    <div className={`step-dot ${step === 'email' ? 'active' : 'completed'}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === 'otp' ? 'active' : step === 'new-password' ? 'completed' : ''}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === 'new-password' ? 'active' : ''}`}>3</div>
                </div>
                <h2>{getStepTitle()}</h2>
            </div>

            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'new-password' && renderPasswordStep()}

            <button className="help-button">?</button>
        </div>
    );
};

export default ForgotPasswordPage;
