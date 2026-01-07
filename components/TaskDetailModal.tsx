import React, { useState } from 'react';
import { X, Calendar, User, AlignLeft, Clock, Edit3, CheckCircle2, AlertCircle, Timer, ChevronDown, Folder, UploadCloud } from 'lucide-react';
import { Task } from '../types';
import { syncTaskToGoogleCalendar } from '../services/googleCalendarService';
import { getAccessTokenForSync } from '../services/authService'; // Import new service

interface TaskDetailModalProps {
    task: Task | null;
    projectName?: string;
    onClose: () => void;
    onEdit: () => void;
    onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
    isDemoMode?: boolean; // New Prop
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, projectName, onClose, onEdit, onUpdate, isDemoMode = false }) => {
    const [isSyncing, setIsSyncing] = useState(false);

    if (!task) return null;

    // Logic Sync Google Calendar
    const handleSyncCalendar = async () => {
        setIsSyncing(true);
        try {
            let token = localStorage.getItem('google_access_token');

            // LOGIC FIX: Check Demo Mode to force login
            if (isDemoMode) {
                // Force clear token
                localStorage.removeItem('google_access_token');
                token = null; // Reset local variable

                const confirm = window.confirm("Hệ thống cần quyền truy cập Lịch của bạn (Demo Mode). Bấm OK để đăng nhập Google.");
                if (!confirm) {
                    setIsSyncing(false);
                    return;
                }

                // Force login with account selection
                token = await getAccessTokenForSync();
            } else {
                // Normal mode: check if token exists, if not, login
                if (!token) {
                    token = await getAccessTokenForSync();
                }
            }

            if (!token) throw new Error("Không lấy được quyền truy cập.");

            // 4. Sync with the token
            const link = await syncTaskToGoogleCalendar(task, token); // Pass token explicitly

            // 5. Success UI
            const openLink = window.confirm("Đã thêm vào lịch Google thành công! Bạn có muốn mở Lịch ngay không?");
            if (openLink && link) {
                window.open(link, '_blank');
            }

        } catch (error: any) {
            console.error(error);
            alert("Lỗi đồng bộ: " + error.message);
        } finally {
            setIsSyncing(false);
        }
    };

    // Hàm update trực tiếp tại modal view
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            await onUpdate(task.id, { status: e.target.value as any });
        } catch (error) {
            console.error(error);
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'normal': return 'text-primary bg-primary/10 border-primary/20';
            default: return 'text-text-sub bg-white/5 border-white/10';
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'in-progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-text-sub bg-white/5 border-white/10';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-bg-card rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-start p-6 border-b border-white/5">
                    <div className="flex-1 pr-4">
                        {/* Project Name Badge */}
                        <div className="flex items-center gap-2 mb-2 text-sm text-text-sub opacity-80 hover:opacity-100 transition-opacity">
                            <Folder size={14} />
                            <span className="font-medium">{projectName || "Dự án không xác định"}</span>
                        </div>

                        <div className="flex gap-3 mb-3 items-center">
                            {/* Badge Priority */}
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getPriorityColor(task.priority)} uppercase tracking-wider flex items-center gap-1`}>
                                <AlertCircle size={12} /> {task.priority === 'high' ? 'Ưu tiên cao' : task.priority === 'normal' ? 'Trung bình' : 'Thấp'}
                            </span>

                            {/* Badge Status (SELECTABLE) */}
                            <div className="relative group">
                                <select
                                    value={task.status}
                                    onChange={handleStatusChange}
                                    className={`appearance-none pl-8 pr-8 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider cursor-pointer outline-none transition-all hover:brightness-110 ${getStatusColor(task.status)}`}
                                >
                                    {/* FIX MÀU: Thêm class bg-bg-card text-text-main cho option */}
                                    <option value="pending" className="bg-bg-dark text-text-main">Chờ xử lý</option>
                                    <option value="in-progress" className="bg-bg-dark text-yellow-400">Đang làm</option>
                                    <option value="completed" className="bg-bg-dark text-green-400">Đã xong</option>
                                </select>
                                {/* Icon Status Absolute */}
                                <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${task.status === 'completed' ? 'text-green-400' : task.status === 'in-progress' ? 'text-yellow-400' : 'text-text-sub'}`}>
                                    {task.status === 'completed' ? <CheckCircle2 size={12} /> : task.status === 'in-progress' ? <Timer size={12} /> : <Clock size={12} />}
                                </div>
                                {/* Icon Chevron */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                    <ChevronDown size={10} />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-text-main leading-tight">
                            {task.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-sub hover:text-text-main">
                        <X size={24} />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider flex items-center gap-2">
                            <AlignLeft size={16} className="text-primary" /> Chi tiết công việc
                        </h3>
                        <div className="bg-bg-dark/50 rounded-2xl p-5 border border-white/5 text-text-main leading-relaxed whitespace-pre-wrap font-light text-base md:text-lg">
                            {task.description ? task.description : <span className="text-text-sub italic opacity-50">Chưa có mô tả chi tiết...</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider flex items-center gap-2">
                                <User size={16} /> Người phụ trách
                            </h3>
                            <div className="flex items-center gap-3 p-3 bg-bg-dark rounded-xl border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center text-xs font-bold text-white">
                                    {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
                                </div>
                                <span className="text-text-main font-medium">
                                    {task.assignee || 'Chưa phân công'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={16} /> Hạn chót
                            </h3>
                            <div className="flex items-center gap-3 p-3 bg-bg-dark rounded-xl border border-white/5">
                                <span className="text-text-main font-medium font-mono">
                                    {task.dueDate ? new Date(task.dueDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Không có thời hạn'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-bg-card rounded-b-3xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-text-sub bg-bg-dark hover:text-text-main hover:bg-white/5 transition-all"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleSyncCalendar}
                        disabled={isSyncing}
                        className="px-4 py-3 rounded-xl font-bold text-text-main bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSyncing ? <span className="animate-spin">⌛</span> : <UploadCloud size={18} />}
                        {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Lịch'}
                    </button>
                    <button
                        onClick={onEdit}
                        className="px-6 py-3 rounded-xl font-bold text-bg-dark bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(0,224,255,0.3)] hover:shadow-[0_0_25px_rgba(0,224,255,0.5)] transition-all flex items-center gap-2"
                    >
                        <Edit3 size={18} /> Chỉnh sửa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;