import React, { useState, useEffect } from 'react';
import { X, AlignLeft, User, Calendar, Activity, Sparkles, Loader2 } from 'lucide-react';
import { Task, Priority, Status } from '../types';
import { generateTaskDescription } from '../src/services/aiService';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  projectName?: string;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>; // Added callback
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, projectName, onUpdate }) => {
  // Khởi tạo state với giá trị fallback ngay lập tức
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [assignee, setAssignee] = useState(task.assignee || '');
  const [priority, setPriority] = useState<Priority>(task.priority || 'normal');
  const [status, setStatus] = useState<Status>(task.status || 'pending');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Vẫn giữ useEffect để sync nếu props thay đổi (dù đã có key ở App.tsx)
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setAssignee(task.assignee || '');
      setPriority(task.priority || 'normal');
      setStatus(task.status || 'pending');
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    // Move onClose after success or simply ensure it closes. 
    // Usually better to wait for operation, but previous code closed early. 
    // I'll follow previous pattern of fire-and-forget-ish/optimistic closing or wait? 
    // Previous code: onClose() then await updateTask. 
    // Current task: onClose() then await onUpdate.
    onClose();

    try {
      await onUpdate(task.id, {
        title,
        description,
        assignee,
        priority,
        status,
        dueDate,
        updatedAt: Date.now() // Good practice to update timestamp
      });
    } catch (error) {
      console.error("Lỗi update:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-bg-card rounded-3xl p-8 shadow-neu-flat border border-white/10 relative m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-sub hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-text-main mb-6">Chỉnh sửa công việc</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Tên công việc */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub">Nội dung công việc</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          {/* 2. MÔ TẢ */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
              <AlignLeft size={16} /> Mô tả chi tiết
              <button
                type="button"
                onClick={async () => {
                  if (!title.trim()) return;
                  setIsGenerating(true);
                  try {
                    const result = await generateTaskDescription(projectName || "Dự án", title);
                    if (description.trim()) {
                      if (confirm("Replace existing description?")) {
                        setDescription(result);
                      } else {
                        setDescription(prev => prev + "\n" + result);
                      }
                    } else {
                      setDescription(result);
                    }
                  } catch (e) {
                    alert("AI Error: " + e);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={!title.trim() || isGenerating}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:grayscale cursor-pointer"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin text-purple-500" /> : <Sparkles size={14} className="text-purple-500" />}
                {isGenerating ? 'AI đang viết...' : 'AI Gợi ý'}
              </button>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors resize-none custom-scrollbar disabled:opacity-50"
                placeholder="Nhập chi tiết công việc..."
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-xs text-text-sub animate-pulse">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Người phụ trách */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
              <User size={16} /> Người phụ trách
            </label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Chưa phân công"
            />
          </div>

          {/* 4. Hàng ngang: Status & Priority */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <Activity size={16} /> Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none cursor-pointer"
              >
                <option value="pending" className="bg-bg-dark text-text-main">Chờ xử lý</option>
                <option value="in-progress" className="bg-bg-dark text-yellow-400">Đang làm</option>
                <option value="completed" className="bg-bg-dark text-green-400">Hoàn thành</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub">Độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none cursor-pointer"
              >
                <option value="low" className="bg-bg-dark text-text-main">Thấp</option>
                <option value="normal" className="bg-bg-dark text-text-main">Trung bình</option>
                <option value="high" className="bg-bg-dark text-red-400">Cao</option>
              </select>
            </div>
          </div>

          {/* 5. Hạn chót */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
              <Calendar size={16} /> Hạn chót
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="mt-4 py-4 rounded-xl font-bold text-bg-dark bg-primary shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;