import React, { useState, useEffect, useRef } from 'react';
import { X, AlignLeft, Sparkles, Loader2 } from 'lucide-react'; // Thêm icon
import { Priority, Task } from '../types';
import { generateTaskDescription } from '../src/services/aiService';

interface NewTaskModalProps {
  onClose: () => void;
  projectId: string;
  projectName?: string;
  onAdd: (task: Omit<Task, 'id'>) => Promise<void>; // Use callback
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, projectId, projectName, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // State mới cho mô tả
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [dueDate, setDueDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus vào ô nhập tên khi mở modal
  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsProcessing(true);
    try {
      await onAdd({
        projectId,
        title,
        description, // Lưu mô tả vào database
        assignee: assignee || 'Chưa phân công',
        priority,
        status: 'pending',
        dueDate: dueDate || new Date().toISOString(),
        createdAt: Date.now(),
        updatedAt: Date.now(), // Ensure type compatibility
        aiSuggestions: '',     // Ensure type compatibility
      } as any); // Type cast if necessary, or better construct proper Omit<Task, 'id'>
      onClose();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tạo công việc. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-bg-card rounded-3xl p-8 shadow-neu-flat border border-white/10 relative m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-text-sub hover:text-primary transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-text-main mb-6">Thêm công việc mới</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Tên công việc */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub">Nội dung công việc</label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên công việc..."
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30"
              required
              disabled={isProcessing}
            />
          </div>

          {/* 2. MÔ TẢ CHI TIẾT (MỚI THÊM) */}
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
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors resize-none custom-scrollbar placeholder-text-sub/30 disabled:opacity-50"
                placeholder="Nhập ghi chú, yêu cầu kỹ thuật hoặc tài liệu đính kèm..."
                disabled={isProcessing || isGenerating}
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
            <label className="text-sm font-bold text-text-sub">Người phụ trách</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="VD: Lan Anh"
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30"
              disabled={isProcessing}
            />
          </div>

          {/* 4. Hàng ngang: Priority & Deadline */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub">Độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none appearance-none cursor-pointer"
                disabled={isProcessing}
              >
                <option value="low">Thấp</option>
                <option value="normal">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub">Hạn chót (Ngày & Giờ)</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none [color-scheme:dark]"
                disabled={isProcessing}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || isProcessing}
            className="mt-4 py-4 rounded-xl font-bold text-bg-dark bg-primary shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Đang tạo...' : 'Thêm công việc'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;