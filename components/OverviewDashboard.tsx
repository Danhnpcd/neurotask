import React from 'react';
import { Project, Task, User } from '../types';
import { Activity, CheckCircle2, Clock, Layers, AlertTriangle, ArrowRight } from 'lucide-react';

interface OverviewDashboardProps {
    projects: Project[];
    tasks: Task[]; // Nhận vào toàn bộ tasks của hệ thống
    user: User | null;
    onSelectProject: (id: string) => void;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ projects, tasks, user, onSelectProject }) => {

    // 1. Tính toán số liệu tổng quan hệ thống
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 2. Helper: Tính tiến độ cho từng dự án cụ thể
    const getProjectStats = (projectId: string) => {
        const pTasks = tasks.filter(t => t.projectId === projectId);
        const pTotal = pTasks.length;
        const pDone = pTasks.filter(t => t.status === 'completed').length;
        const percent = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);

        // Tính ngày còn lại
        const pProject = projects.find(p => p.id === projectId);
        let daysLeft = 0;
        if (pProject?.endDate) {
            const end = new Date(pProject.endDate).getTime();
            const now = new Date().getTime();
            daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        }

        return { total: pTotal, done: pDone, percent, daysLeft };
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-10">

            {/* SECTION 1: HERO STATS (Chào mừng & Biểu đồ) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột 1: Tổng quan & Biểu đồ tròn */}
                <div className="lg:col-span-2 bg-gradient-to-br from-bg-card to-bg-dark border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-neu-flat flex flex-col sm:flex-row items-center gap-8 group">
                    {/* Background Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-all duration-500"></div>

                    <div className="flex-1 z-10 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main">Xin chào, {user?.name ? user.name.split(' ').pop() : 'Bạn mới'}! 👋</h2>
                            <p className="text-text-sub text-sm mt-1">Hệ thống đang theo dõi <strong className="text-primary">{projects.length} dự án</strong> hoạt động.</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex flex-col min-w-[80px]">
                                <span className="text-text-sub text-[10px] uppercase font-bold tracking-wider">Hoàn thành</span>
                                <span className="text-xl font-bold text-green-400">{completedTasks}</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex flex-col min-w-[80px]">
                                <span className="text-text-sub text-[10px] uppercase font-bold tracking-wider">Đang chạy</span>
                                <span className="text-xl font-bold text-yellow-400">{inProgressTasks}</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex flex-col min-w-[80px]">
                                <span className="text-text-sub text-[10px] uppercase font-bold tracking-wider">Chờ xử lý</span>
                                <span className="text-xl font-bold text-text-main">{pendingTasks}</span>
                            </div>
                        </div>
                    </div>

                    {/* Circular Progress Bar (SVG) */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 z-10">
                        <svg className="w-full h-full -rotate-90">
                            {/* Background Circle */}
                            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-bg-dark opacity-50" />
                            {/* Progress Circle */}
                            <circle
                                cx="50%" cy="50%" r="45%"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * overallProgress) / 100}
                                strokeLinecap="round"
                                className="text-primary transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-text-main">{overallProgress}%</span>
                            <span className="text-[10px] text-text-sub font-bold uppercase tracking-wider">Tiến độ chung</span>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Thẻ hiệu suất nhanh */}
                <div className="bg-bg-card border border-white/10 rounded-3xl p-6 shadow-neu-flat flex flex-col justify-center gap-5">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <Activity size={20} className="text-purple-400" /> Hiệu suất tuần
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <span className="text-text-sub text-sm">Dự án mới</span>
                            <span className="font-bold text-text-main">+{projects.filter(p => {
                                const d = new Date(p.createdAt?.toDate ? p.createdAt.toDate() : p.createdAt);
                                const now = new Date();
                                return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
                            }).length}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <span className="text-text-sub text-sm">Task hoàn thành</span>
                            <span className="font-bold text-green-400">+{completedTasks}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 leading-relaxed">
                            💡 <strong>Mẹo AI:</strong> Tập trung hoàn thành các dự án có deadline dưới 3 ngày để cải thiện chỉ số hiệu suất.
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: DANH SÁCH DỰ ÁN CHI TIẾT */}
            <div>
                <div className="flex justify-between items-end mb-5">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Layers size={20} className="text-primary" /> Trạng thái dự án
                    </h3>
                    <span className="text-xs text-text-sub bg-white/5 px-3 py-1 rounded-full">{projects.length} Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map(project => {
                        const stats = getProjectStats(project.id);
                        const isUrgent = stats.daysLeft < 3 && stats.daysLeft >= 0 && stats.percent < 100;

                        return (
                            <div
                                key={project.id}
                                onClick={() => onSelectProject(project.id)}
                                className={`group bg-bg-card hover:bg-bg-dark border rounded-3xl p-5 shadow-neu-flat transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]
                            ${isUrgent ? 'border-red-500/30 hover:border-red-500/50' : 'border-white/5 hover:border-primary/30'}
                        `}
                            >
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors
                                ${isUrgent ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-bg-dark border-white/5 text-primary group-hover:scale-110'}
                            `}>
                                        <Layers size={18} />
                                    </div>
                                    {isUrgent && (
                                        <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 flex items-center gap-1 animate-pulse">
                                            <AlertTriangle size={10} /> Gấp
                                        </span>
                                    )}
                                </div>

                                {/* Nội dung chính */}
                                <div className="mb-4">
                                    <h4 className="text-lg font-bold text-text-main mb-1 truncate group-hover:text-primary transition-colors">{project.name}</h4>
                                    <p className="text-xs text-text-sub line-clamp-2 h-8 leading-relaxed">
                                        {project.description || 'Chưa có mô tả chi tiết...'}
                                    </p>
                                </div>

                                {/* Thanh tiến độ */}
                                <div className="mt-auto space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                                            <span className="text-text-sub">Tiến độ</span>
                                            <span className={stats.percent === 100 ? 'text-green-400' : 'text-primary'}>
                                                {stats.percent}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-bg-dark rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${stats.percent === 100 ? 'bg-green-400' : isUrgent ? 'bg-red-500' : 'bg-primary'}`}
                                                style={{ width: `${stats.percent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between text-xs text-text-sub pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 size={12} className={stats.done === stats.total && stats.total > 0 ? 'text-green-400' : ''} />
                                            <span>{stats.done}/{stats.total} việc</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${isUrgent ? 'text-red-400 font-bold' : ''}`}>
                                            <Clock size={12} />
                                            <span>
                                                {stats.daysLeft < 0 ? 'Quá hạn' : stats.daysLeft === 0 ? 'Hôm nay' : `Còn ${stats.daysLeft} ngày`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                    {/* Chỉ hiện khi hover để trang trí */}
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State nếu không có dự án */}
                    {projects.length === 0 && (
                        <div className="col-span-full py-10 text-center text-text-sub border border-dashed border-white/10 rounded-3xl bg-white/5">
                            Chưa có dự án nào đang chạy.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewDashboard;