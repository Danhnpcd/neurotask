import React, { useState } from 'react';
import { loginWithGoogle } from '../services/authService';
import { Box, X } from 'lucide-react';

interface LoginPageProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ isOpen = true, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            // Successful login will trigger onAuthStateChanged in App.tsx
            if (onClose) onClose();
        } catch (err: any) {
            console.error(err);
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="w-full max-w-md bg-bg-card border border-white/5 rounded-3xl p-8 shadow-neu-flat flex flex-col items-center animate-scale-in relative overflow-hidden z-10 mx-4">

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-text-sub hover:text-text-main hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <div className="w-20 h-20 rounded-2xl bg-bg-dark shadow-neu-pressed flex items-center justify-center mb-6 text-primary">
                    <Box size={40} />
                </div>

                <h1 className="text-3xl font-extrabold text-text-main mb-2">NeuroTask</h1>
                <p className="text-text-sub mb-8 text-center text-sm">
                    Đăng nhập để tạo dự án và quản lý công việc của bạn.
                </p>

                {error && (
                    <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-4 px-6 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {/* Google Icon SVG */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                            Tiếp tục với Google
                        </>
                    )}
                </button>

                <p className="mt-8 text-xs text-text-sub opacity-50">
                    Chế độ khách: Bạn có thể xem nhưng không thể chỉnh sửa.
                </p>

            </div>
        </div>
    );
};

export default LoginPage;
