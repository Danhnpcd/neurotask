import React from 'react';
import { Calendar, CheckCircle2, Circle, Timer } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  // NEW PROPS FOR SELECTION
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>; // Added optional callback
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, isSelected, onToggleSelect, onUpdate }) => {

  // Hàm xử lý khi chọn status từ dropdown
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation(); // Ngăn không cho mở modal chi tiết
    const newStatus = e.target.value as Task['status'];
    try {
      if (onUpdate) {
        await onUpdate(task.id, { status: newStatus });
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  // Helper màu sắc
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'normal': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-text-sub bg-white/5 border-white/10';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'completed': return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'in-progress': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      default: return 'text-text-sub border-white/10 bg-white/5';
    }
  };

  return (
    <div
      onClick={onEdit}
      className={`group p-4 rounded-2xl bg-bg-dark border transition-all cursor-pointer shadow-sm relative flex items-center gap-4 ${isSelected ? 'border-primary bg-primary/5' : 'border-white/5 hover:border-primary/30 hover:bg-white/5'}`}
    >
      {/* 0. CHECKBOX SELECTION */}
      {onToggleSelect && (
        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={() => onToggleSelect(task.id)}
            className="w-5 h-5 rounded border-2 border-white/20 bg-transparent appearance-none checked:bg-primary checked:border-primary cursor-pointer transition-all relative
             before:content-[''] before:absolute before:hidden checked:before:block before:w-1.5 before:h-2.5 before:top-[1px] before:left-[5px] before:rotate-45 before:border-r-2 before:border-b-2 before:border-bg-dark"
          />
        </div>
      )}
      {/* 1. Icon trạng thái */}
      <div className={`flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-green-400' :
        task.status === 'in-progress' ? 'text-yellow-400' : 'text-text-sub'
        }`}>
        {task.status === 'completed' ? <CheckCircle2 size={24} /> :
          task.status === 'in-progress' ? <Timer size={24} className="animate-pulse" /> :
            <Circle size={24} />}
      </div>

      {/* 2. Nội dung */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate transition-all ${task.status === 'completed' ? 'text-text-sub line-through decoration-white/20' : 'text-text-main'}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-text-sub">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : ''}`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' ? 'Cao' : task.priority === 'normal' ? 'TB' : 'Thấp'}
          </span>
        </div>
      </div>

      {/* 3. DROPDOWN CHỌN TRẠNG THÁI (FIX MÀU TỐI) */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase border bg-bg-card focus:outline-none cursor-pointer transition-colors ${getStatusColor(task.status)}`}
        >
          {/* Thêm class màu nền tối cho option */}
          <option value="pending" className="bg-bg-dark text-text-sub">Chờ xử lý</option>
          <option value="in-progress" className="bg-bg-dark text-yellow-400">Đang làm</option>
          <option value="completed" className="bg-bg-dark text-green-400">Hoàn thành</option>
        </select>

        {/* Mũi tên giả */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>

    </div>
  );
};

export default TaskItem;