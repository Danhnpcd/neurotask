import React, { useState } from 'react';
import { Edit2, Filter, ArrowUpDown, Trash2, AlignLeft, Calendar, Loader2 } from 'lucide-react';
import TaskList from './TaskList';
import { Task, Project } from '../types';
import EditProjectModal from './EditProjectModal';
import { syncBatchTasks } from '../services/googleCalendarService';
import { getAccessTokenForSync } from '../services/authService';

interface ProjectCardProps {
  project: Project | null;
  tasks: Task[];
  loading: boolean;
  onEditTask?: (task: Task) => void;
  onDelete?: (projectId: string) => void;
  userRole?: 'admin' | 'member';
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onUpdateProject?: (id: string, name: string, description: string) => Promise<void>;
  isDemoMode?: boolean; // New Prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  loading,
  onEditTask,
  onDelete,
  userRole,
  onUpdateTask,
  onUpdateProject,
  isDemoMode = false
}) => {
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  // -- BULK SYNC STATE --
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // -- HANDLERS --
  const handleToggleSelect = (taskId: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(tasks.map(t => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };



  const executeBatchSync = async (tasksToSync: Task[]) => {
    if (tasksToSync.length === 0) return;

    // Filter tasks without due date
    const validTasks = tasksToSync.filter(t => t.dueDate);
    if (validTasks.length === 0) {
      alert("Không có công việc nào có hạn chót (Due Date) để đồng bộ.");
      return;
    }

    if (!window.confirm(`Bạn có muốn đồng bộ ${validTasks.length} công việc lên Google Calendar?`)) return;

    setIsSyncing(true);
    try {
      let token = localStorage.getItem('google_access_token');

      // LOGIC FIX: Demo Mode always requires fresh login with account selection
      if (isDemoMode) {
        localStorage.removeItem('google_access_token');
        token = null;

        const confirm = window.confirm("Cần đăng nhập Google để đồng bộ (Demo Mode). Bấm OK để tiếp tục.");
        if (!confirm) {
          setIsSyncing(false);
          return;
        }

        token = await getAccessTokenForSync();
      } else {
        // Normal mode
        if (!token) {
          token = await getAccessTokenForSync();
        }
      }

      const { success, failed } = await syncBatchTasks(validTasks, token); // Pass token
      alert(`Đồng bộ hoàn tất!\n- Thành công: ${success}\n- Thất bại: ${failed}`);
      setSelectedTaskIds([]); // Clear selection on success
    } catch (error) {
      console.error("Batch sync failed:", error);
      alert("Có lỗi xảy ra trong quá trình đồng bộ (Có thể do chưa cấp quyền hoặc đóng popup).");
    } finally {
      setIsSyncing(false);
    }
  };


  // Nếu chưa chọn dự án
  if (!project) {
    return (
      <div className="p-8 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex flex-col items-center justify-center min-h-[400px] text-text-sub animate-fade-in">
        <p className="text-lg font-medium">Vui lòng chọn một dự án để xem chi tiết.</p>
      </div>
    );
  }

  // Tính toán tiến độ
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Xử lý nút Xóa
  const handleDeleteClick = () => {
    if (onDelete && window.confirm(`Sếp có chắc chắn muốn xóa dự án "${project.name}" và toàn bộ công việc bên trong không? Hành động này không thể hoàn tác.`)) {
      onDelete(project.id);
    }
  };

  // <--- MỚI: Xử lý lưu khi sửa tên và mô tả dự án
  const handleUpdateProject = async (id: string, name: string, description: string) => {
    // Gọi callback (App.tsx sẽ quyết định lưu DB hay lưu state Demo)
    if (onUpdateProject) {
      await onUpdateProject(id, name, description);
    }
  };

  return (
    <div className="p-8 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card relative animate-fade-in">
      {/* Card Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main mb-1">{project.name}</h2>
          <p className="text-text-sub text-sm">
            Cập nhật lần cuối: {project.createdAt?.seconds ? new Date(project.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Nút Sync All Project */}
          <button
            onClick={() => executeBatchSync(tasks)}
            disabled={isSyncing || tasks.length === 0}
            className="px-4 py-2 text-sm font-bold text-text-sub flex items-center gap-2 rounded-xl shadow-neu-btn border border-white/5 hover:text-primary hover:bg-white/5 transition-all active:shadow-neu-pressed disabled:opacity-50 disabled:cursor-not-allowed"
            title="Đồng bộ toàn bộ dự án"
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
            <span className="hidden sm:inline">Sync All</span>
          </button>

          {/* Nút Sửa */}
          <button
            onClick={() => setIsEditProjectOpen(true)}
            className="px-4 py-2 text-sm font-bold text-primary flex items-center gap-2 rounded-xl shadow-neu-btn border border-primary/20 hover:text-white hover:bg-primary/10 transition-all active:shadow-neu-pressed"
          >
            <Edit2 size={16} />
            Chỉnh sửa
          </button>

          {/* Nút Xóa - Chỉ hiện nếu là ADMIN */}
          {userRole === 'admin' && (
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 text-sm font-bold text-red-500 flex items-center gap-2 rounded-xl shadow-neu-btn border border-red-500/20 hover:text-red-400 hover:bg-red-500/10 transition-all active:shadow-neu-pressed"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          )}
        </div>
      </div>



      {/* Project Description Section - NEW */}
      <div className="mb-8 p-6 bg-bg-dark/50 rounded-2xl border border-white/5">
        <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlignLeft size={16} className="text-primary" /> Mô tả chi tiết & Nội dung công việc
        </h3>
        <div className="text-text-main leading-relaxed whitespace-pre-wrap font-light">
          {project.description ? (
            project.description
          ) : (
            <span className="text-text-sub italic opacity-60">Chưa có mô tả chi tiết cho dự án này.</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold text-text-main">Tiến độ dự án</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full shadow-neu-pressed bg-bg-dark relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_#00E0FF] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-text-main">Danh sách công việc</h3>
          {/* Select All Checkbox */}
          {tasks.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-text-sub cursor-pointer hover:text-primary transition-colors select-none">
              <input
                type="checkbox"
                checked={tasks.length > 0 && selectedTaskIds.length === tasks.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-transparent checked:bg-primary checked:border-primary appearance-none border transition-all relative before:content-[''] before:absolute before:hidden checked:before:block before:w-1 before:h-2 before:top-[1px] before:left-[4px] before:rotate-45 before:border-r-2 before:border-b-2 before:border-bg-dark"
              />
              Chọn tất cả
            </label>
          )}
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-text-sub hover:text-primary shadow-neu-btn border border-white/5 active:shadow-neu-pressed transition-all">
            <Filter size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-text-sub hover:text-primary shadow-neu-btn border border-white/5 active:shadow-neu-pressed transition-all">
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      {/* Task List Component */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onEditTask={onEditTask}
        selectedTaskIds={selectedTaskIds}
        onToggleSelect={handleToggleSelect}
        onUpdateTask={onUpdateTask} // Filter down
      />

      {/* ACTION BAR (Fixed Bottom) - Only show when items selected */}
      {selectedTaskIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-bg-card border border-primary/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-3 flex items-center gap-4 text-text-main backdrop-blur-md">
            <span className="font-bold text-primary">{selectedTaskIds.length} đã chọn</span>
            <div className="h-6 w-px bg-white/10"></div>
            <button
              onClick={() => executeBatchSync(tasks.filter(t => selectedTaskIds.includes(t.id)))}
              disabled={isSyncing}
              className="flex items-center gap-2 font-bold hover:text-primary transition-colors disabled:opacity-50"
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
              Đồng bộ Google Calendar
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <button
              onClick={() => setSelectedTaskIds([])}
              className="text-text-sub hover:text-white transition-colors text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        project={project}
        onConfirm={handleUpdateProject} // <--- QUAN TRỌNG: Đã thêm hàm xử lý lưu
      />
    </div >
  );
};

export default ProjectCard;