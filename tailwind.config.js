/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Bảng màu gốc của NeuroTask (Dark Mode)
                'bg-dark': '#121212',       // Nền chính
                'bg-card': '#1E1E1E',       // Nền thẻ/Modal
                'text-main': '#FFFFFF',     // Chữ chính
                'text-sub': '#9CA3AF',      // Chữ phụ (Gray-400)
                'primary': '#00E0FF',       // Màu nhấn (Neon Cyan)
                'danger': '#EF4444',        // Màu đỏ báo lỗi
                'success': '#10B981',       // Màu xanh thành công
                'warning': '#F59E0B',       // Màu vàng cảnh báo
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
