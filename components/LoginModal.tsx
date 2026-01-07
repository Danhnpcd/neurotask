import React, { useState } from 'react';
import { loginWithGoogle, registerWithPassword, loginWithPassword } from '../services/authService';
import { sendWelcomeEmail } from '../services/emailService';
import { Box, X, User, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        emailOrUsername: '',
        password: '',
        confirmPassword: '' // Added for validation
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                // VALIDATION
                if (!form.name || !form.emailOrUsername || !form.password || !form.confirmPassword) {
                    throw new Error("Vui lòng điền đầy đủ thông tin.");
                }
                if (form.password !== form.confirmPassword) {
                    throw new Error("Mật khẩu xác nhận không khớp.");
                }
                if (form.password.length < 6) {
                    throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
                }

                // 1. REGISTER ON FIREBASE
                await registerWithPassword(form.name, form.emailOrUsername, form.password);

                // 2. SEND WELCOME EMAIL
                // Note: We use 'form.name' as 'username/to_name' and 'form.emailOrUsername' as 'email'
                // Assuming user entered a valid email in emailOrUsername field for registration
                try {
                    await sendWelcomeEmail(form.name, form.emailOrUsername, form.password);
                    console.log("Welcome email sent.");
                } catch (emailErr) {
                    console.warn("Could not send email:", emailErr);
                    // Don't block registration success if email fails, but maybe alert user?
                    // For now, we proceed as success.
                }

                alert("Đăng ký thành công! Kiểm tra email để xem thông tin.");
                onClose();
            } else {
                // LOGIN
                if (!form.emailOrUsername || !form.password) {
                    throw new Error("Vui lòng nhập tài khoản và mật khẩu.");
                }
                await loginWithPassword(form.emailOrUsername, form.password);
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            let msg = "Đã có lỗi xảy ra.";
            if (err.code === 'auth/email-already-in-use') msg = "Email đã được sử dụng.";
            if (err.code === 'auth/wrong-password') msg = "Sai mật khẩu.";
            if (err.code === 'auth/user-not-found') msg = "Tài khoản không tồn tại.";
            if (err.code === 'auth/invalid-email') msg = "Email không hợp lệ.";
            if (err.code === 'auth/weak-password') msg = "Mật khẩu quá yếu.";
            if (err.message) msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError("Đăng nhập Google thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center animate-fade-in overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-text-sub hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Logo */}
                <div className="w-14 h-14 rounded-2xl bg-bg-dark shadow-neu-pressed flex items-center justify-center mb-6 text-primary border border-white/5">
                    <Box size={28} />
                </div>

                <h2 className="text-2xl font-bold text-text-main mb-2">
                    {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
                </h2>
                <p className="text-text-sub mb-6 text-center text-sm">
                    {isRegister ? 'Nhập thông tin để bắt đầu quản lý dự án.' : 'Đăng nhập để vào không gian làm việc.'}
                </p>

                {error && (
                    <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
                    {isRegister && (
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Họ và tên"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-white/10 rounded-xl text-text-main placeholder-text-sub/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            name="emailOrUsername"
                            placeholder={isRegister ? "Email" : "Email hoặc Tên đăng nhập"}
                            value={form.emailOrUsername}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-white/10 rounded-xl text-text-main placeholder-text-sub/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-white/10 rounded-xl text-text-main placeholder-text-sub/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {isRegister && (
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-white/10 rounded-xl text-text-main placeholder-text-sub/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary text-bg-dark rounded-xl font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,224,255,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div> : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                {/* Divider */}
                <div className="w-full flex items-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-text-sub uppercase">Hoặc</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group mb-4"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Đăng nhập bằng Google
                </button>

                {/* Toggle Register/Login */}
                <div className="text-sm text-text-sub">
                    {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(null); }}
                        className="ml-2 text-primary font-bold hover:underline focus:outline-none"
                    >
                        {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                    </button>
                </div>
            </div>
            {/* Version Indicator */}
            <div className="absolute bottom-2 right-4 text-[10px] text-white/20 font-mono">
                v1.1 (Prod Fix)
            </div>
        </div>
    );
};

export default LoginModal;
