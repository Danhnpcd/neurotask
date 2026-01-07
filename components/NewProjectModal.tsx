import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Calendar, ArrowRight, AlignLeft, Wand2 } from 'lucide-react';
import { generateTasksForProject, suggestProjectDescription } from '../services/aiService';
import { Task } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, startDate: string, endDate: string, description: string) => Promise<string | void>;
  onAdd: (task: Omit<Task, 'id'>) => Promise<void>; // Added callback for AI tasks
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onConfirm, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiLoadingText, setAiLoadingText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // --- HÀM ĐÃ SỬA: LẤY NGÀY THEO GIỜ ĐỊA PHƯƠNG (LOCAL TIME) ---
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên phải +1
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);

    if (isOpen) {
      const today = getTodayString();
      // Nếu chưa có ngày bắt đầu thì set là hôm nay
      if (!startDate) setStartDate(today);

      // Nếu chưa có ngày kết thúc thì mặc định +7 ngày
      if (!endDate) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        // Format ngày kết thúc theo local time luôn
        const y = nextWeek.getFullYear();
        const m = String(nextWeek.getMonth() + 1).padStart(2, '0');
        const d = String(nextWeek.getDate()).padStart(2, '0');
        setEndDate(`${y}-${m}-${d}`);
      }
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setIsProcessing(false);
      setAiLoadingText('');
      setIsSuggesting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuggestDescription = async () => {
    if (!name.trim()) return;
    setIsSuggesting(true);
    try {
      const suggestedText = await suggestProjectDescription(name);
      if (suggestedText) setDescription(suggestedText);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleNormalCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    setIsProcessing(true);
    await onConfirm(name, startDate, endDate, description);
    setIsProcessing(false);
    onClose();
  };

  const handleAICreate = async () => {
    if (!name.trim() || !startDate || !endDate) return;

    const duration = calculateDuration(startDate, endDate);
    if (duration < 1) {
      alert("Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    setIsProcessing(true);
    setAiLoadingText(`Đang lập kế hoạch chi tiết (${duration} ngày)...`);

    try {
      const projectId = await onConfirm(name, startDate, endDate, description);
      if (!projectId) throw new Error("Không lấy được ID dự án");

      const aiTasks = await generateTasksForProject(name, duration);

      setAiLoadingText(`Đang thiết lập ${aiTasks.length} công việc...`);

      const promises = aiTasks.map((task: any) => {
        const projectStart = new Date(startDate);
        const daysToAdd = (task.daysFromNow || 1) - 1;

        const taskDueDate = new Date(projectStart);
        taskDueDate.setDate(taskDueDate.getDate() + daysToAdd);
        taskDueDate.setUTCHours(17, 0, 0, 0);

        return onAdd({
          projectId: projectId as string,
          title: task.title,
          description: task.description, // Đã được chuẩn hóa từ aiService
          assignee: 'Chưa phân công',
          priority: task.priority || 'normal',
          status: 'pending',
          dueDate: taskDueDate.toISOString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          aiSuggestions: ''
        });
      });

      await Promise.all(promises);

    } catch (error) {
      console.error("Lỗi quy trình AI:", error);
      alert("Có lỗi khi AI tạo việc: " + error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-bg-card rounded-3xl p-8 shadow-neu-flat border border-white/10 relative m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} disabled={isProcessing} className="absolute top-4 right-4 text-text-sub hover:text-primary transition-colors disabled:opacity-50">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-text-main mb-6">Dự án mới</h2>

        <form onSubmit={handleNormalCreate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub">Mục tiêu dự án</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30"
              placeholder="VD: Xây dựng chiến dịch Marketing..."
              required
              disabled={isProcessing}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <AlignLeft size={14} /> Mô tả tổng quan
              </label>
              <button
                type="button"
                onClick={handleSuggestDescription}
                disabled={!name.trim() || isSuggesting || isProcessing}
                className="text-xs flex items-center gap-1 text-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSuggesting ? (
                  <span className="animate-pulse">Đang viết...</span>
                ) : (
                  <>
                    <Wand2 size={12} className="group-hover:rotate-12 transition-transform" /> AI Gợi ý
                  </>
                )}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30 resize-none custom-scrollbar"
              placeholder="Mô tả phạm vi, mục tiêu chính..."
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <Calendar size={14} /> Bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors text-sm"
                required
                disabled={isProcessing}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                Kết thúc <ArrowRight size={14} />
              </label>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors text-sm"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="text-center text-xs text-text-sub bg-white/5 py-2 rounded-lg">
              Tổng thời gian: <span className="text-primary font-bold">{calculateDuration(startDate, endDate)} ngày</span>
            </div>
          )}

          {isProcessing ? (
            <div className="py-4 text-center text-primary font-medium animate-pulse">
              {aiLoadingText || 'Đang xử lý...'}
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="button"
                onClick={handleAICreate}
                disabled={!name.trim() || !startDate || !endDate}
                className="w-full py-3 rounded-xl font-bold text-bg-dark bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <Sparkles size={18} fill="currentColor" />
                Lập kế hoạch chi tiết
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-text-sub bg-bg-card shadow-neu-btn border border-white/5 hover:text-text-main active:shadow-neu-pressed transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-text-main bg-bg-dark border border-white/10 hover:border-primary/50 hover:text-primary transition-all"
                >
                  Tạo thường
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;