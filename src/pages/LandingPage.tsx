import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Brain, Shield, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingPageProps {
    onLoginClick: () => void;
    onDemoStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onDemoStart }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#00E0FF] selection:text-black overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-[#00E0FF] to-blue-600 p-2 rounded-lg">
                            <Layout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">NeuroTask</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm font-medium">Tính năng</a>
                        <a href="#about" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm font-medium">Về chúng tôi</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLoginClick}
                            className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                        >
                            Đăng nhập
                        </button>
                        <button
                            onClick={onDemoStart}
                            className="px-6 py-2.5 rounded-full bg-[#00E0FF] text-black text-sm font-bold shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] hover:scale-105 transition-all duration-300"
                        >
                            Dùng thử ngay
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E0FF]/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Quản lý dự án bằng <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E0FF] to-blue-500 animate-gradient">
                                sức mạnh AI
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Tự động hóa quy trình, tối ưu hiệu suất, giao diện Dark Mode bảo vệ mắt.
                            Trải nghiệm phong cách làm việc của tương lai cùng NeuroTask.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onLoginClick}
                                className="px-8 py-4 rounded-full bg-[#00E0FF] text-black font-bold text-lg shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_40px_rgba(0,224,255,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
                            >
                                Bắt đầu ngay
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onDemoStart}
                                className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                            >
                                Xem Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Visual Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-16 mx-auto max-w-5xl"
                    >
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {/* Abstract UI Representation */}
                            <div className="aspect-video rounded-xl bg-[#0a0a0a] overflow-hidden relative border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/5 to-transparent opacity-50" />

                                {/* Mock UI Elements */}
                                <div className="absolute top-8 left-8 right-8 bottom-8 grid grid-cols-12 gap-6">
                                    <div className="col-span-3 bg-white/5 rounded-lg border border-white/5" />
                                    <div className="col-span-9 flex flex-col gap-6">
                                        <div className="h-32 bg-white/5 rounded-lg border border-white/5" />
                                        <div className="flex-1 grid grid-cols-2 gap-6">
                                            <div className="bg-white/5 rounded-lg border border-white/5" />
                                            <div className="bg-white/5 rounded-lg border border-white/5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00E0FF]/20">
                                    <Layout size={120} strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-[#0a0a0a] relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Tính năng vượt trội</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Công nghệ AI giúp bạn tập trung vào những điều quan trọng nhất.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#00E0FF]/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/0 via-[#00E0FF]/0 to-[#00E0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-14 h-14 rounded-xl bg-[#00E0FF]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00E0FF] transition-colors">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#121212] to-[#001020]" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E0FF] to-transparent opacity-30" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Sẵn sàng bứt phá <br />
                        <span className="text-[#00E0FF] drop-shadow-[0_0_20px_rgba(0,224,255,0.4)]">hiệu suất?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Tham gia cùng hàng ngàn người dùng đang thay đổi cách họ làm việc mỗi ngày.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-12 py-5 rounded-full bg-[#00E0FF] text-black font-bold text-xl shadow-[0_0_30px_rgba(0,224,255,0.4)] hover:shadow-[0_0_50px_rgba(0,224,255,0.7)] hover:scale-105 transition-all duration-300"
                    >
                        Đăng ký miễn phí
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-[#0a0a0a]">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Layout className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500 font-semibold">NeuroTask © 2024</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-[#00E0FF] transition-colors">Điều khoản</a>
                        <a href="#" className="text-gray-500 hover:text-[#00E0FF] transition-colors">Bảo mật</a>
                        <a href="#" className="text-gray-500 hover:text-[#00E0FF] transition-colors">Liên hệ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: <Zap className="w-7 h-7 text-[#00E0FF]" />,
        title: "Lên kế hoạch tự động",
        description: "AI phân tích thói quen làm việc và tự động sắp xếp lịch trình tối ưu nhất cho bạn, giúp tiết kiệm hàng giờ mỗi tuần."
    },
    {
        icon: <Brain className="w-7 h-7 text-[#00E0FF]" />,
        title: "Báo cáo thông minh",
        description: "Nhận insight sâu sắc về hiệu suất làm việc. Biểu đồ trực quan giúp bạn hiểu rõ điểm mạnh và điểm cần cải thiện."
    },
    {
        icon: <Shield className="w-7 h-7 text-[#00E0FF]" />,
        title: "Bảo mật tuyệt đối",
        description: "Dữ liệu của bạn được mã hóa đầu cuối. Chúng tôi cam kết bảo vệ thông tin riêng tư của bạn theo tiêu chuẩn cao nhất."
    }
];

export default LandingPage;
