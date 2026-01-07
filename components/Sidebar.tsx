import React from 'react';
import { LayoutGrid, Folder, User, Plus, LogOut, Settings, ShieldAlert, LogIn } from 'lucide-react'; // LayoutGrid là icon Tổng quan
import { Project, User as UserType } from '../types';

interface SidebarProps {
    projects: Project[];
    selectedProjectId: string | null;
    onSelectProject: (id: string | null) => void; // Cho phép null để về trang chủ
    onAddProjectClick: () => void;
    activeTab: 'dashboard' | 'calendar' | 'profile' | 'admin';
    onTabChange: (tab: 'dashboard' | 'calendar' | 'profile' | 'admin') => void;
    user: UserType | null; // Allow null
    onProfileClick: () => void;
    onLoginClick?: () => void;
    onLogout?: () => void; // New callback
}

const Sidebar: React.FC<SidebarProps> = ({
    projects,
    selectedProjectId,
    onSelectProject,
    onAddProjectClick,
    activeTab,
    onTabChange,
    user,
    onProfileClick,
    onLoginClick,
    onLogout
}) => {
    // Logic kiểm tra nút Tổng quan có đang Active không
    const isOverviewActive = activeTab === 'dashboard' && selectedProjectId === null;

    return (
        <aside className="hidden md:flex flex-col w-72 bg-card border-r border-white/5 h-screen fixed left-0 top-0 z-20 shadow-xl transition-colors duration-300">

            {/* 1. LOGO */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shadow-glow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-main tracking-tight">NeuroTask</h1>
                        <p className="text-xs text-text-sub font-medium">Quản lý dự án</p>
                    </div>
                </div>

                {/* 2. MENU CHÍNH (TỔNG QUAN) */}
                <div className="space-y-2">
                    <button
                        onClick={() => {
                            onTabChange('dashboard');
                            onSelectProject(null); // QUAN TRỌNG: Reset project để về Overview
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group
                    ${isOverviewActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,224,255,0.1)]'
                                : 'text-text-sub hover:bg-white/5 hover:text-main'
                            }
                `}
                    >
                        <LayoutGrid size={20} className={isOverviewActive ? 'text-primary' : 'text-text-sub group-hover:text-main'} />
                        Tổng quan
                    </button>

                    <button
                        onClick={() => {
                            onTabChange('calendar');
                            onSelectProject(null); // Reset project để xem lịch tổng
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group
                    ${activeTab === 'calendar'
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,224,255,0.1)]'
                                : 'text-text-sub hover:bg-white/5 hover:text-main'
                            }
                `}
                    >
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        Lịch
                    </button>

                    {/* Chỉ hiện nếu đã login và là admin */}
                    {user && user.role === 'admin' && (
                        <button
                            onClick={() => {
                                onTabChange('admin');
                                onSelectProject(null);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group
                                ${activeTab === 'admin'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                                    : 'text-text-sub hover:bg-white/5 hover:text-main'
                                }
                            `}
                        >
                            <ShieldAlert size={20} className={activeTab === 'admin' ? 'text-red-500' : 'text-text-sub group-hover:text-main'} />
                            Quản trị
                        </button>
                    )}
                </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-text-sub/20 to-transparent mx-6 my-2"></div>

            {/* 3. DANH SÁCH DỰ ÁN */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-text-sub uppercase tracking-wider">DỰ ÁN</h3>
                    <button
                        onClick={onAddProjectClick}
                        className="p-1.5 rounded-lg bg-dark border border-white/5 text-text-sub hover:text-primary hover:border-primary/50 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="space-y-1">
                    {projects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => {
                                onTabChange('dashboard');
                                onSelectProject(project.id); // Chọn dự án cụ thể
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group relative overflow-hidden
                        ${selectedProjectId === project.id
                                    ? 'bg-white/5 text-main border-l-2 border-primary shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]'
                                    : 'text-text-sub hover:bg-white/5 hover:text-main'
                                }
                    `}
                        >
                            <Folder size={18} className={selectedProjectId === project.id ? 'text-primary' : 'text-text-sub'} />
                            <span className="truncate flex-1 text-left">{project.name}</span>
                        </button>
                    ))}

                    {projects.length === 0 && (
                        <div className="text-center py-6 text-text-sub text-xs italic opacity-50">
                            Chưa có dự án nào
                        </div>
                    )}
                </div>
            </div>

            {/* 4. SETTINGS & PROFILE */}
            <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-sm">

                {user ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onProfileClick}
                            className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all group border border-transparent
                                ${activeTab === 'profile' ? 'bg-white/5 border-white/10' : 'hover:bg-white/5'}
                            `}
                        >
                            <div className="relative">
                                <img
                                    src={user.avatarUrl}
                                    alt="User"
                                    className="w-10 h-10 rounded-full border-2 border-dark shadow-sm"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark rounded-full"></div>
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <h4 className="text-sm font-bold text-main truncate">{user.name}</h4>
                                <p className="text-xs text-text-sub truncate">{user.role}</p>
                            </div>
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            title="Đăng xuất"
                            className="p-3 rounded-xl text-text-sub hover:bg-white/5 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,224,255,0.4)]"
                    >
                        <LogIn size={20} />
                        Đăng nhập
                    </button>
                )}
            </div>

        </aside>
    );
};

export default Sidebar;