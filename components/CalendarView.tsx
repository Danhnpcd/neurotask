import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task, Project } from '../types';
import TaskItem from './TaskItem';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  onEditTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Khởi tạo ngày chọn là hôm nay để tránh lỗi không hiển thị lúc đầu
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getDotColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-primary';
      default: return 'bg-gray-400 opacity-50';
    }
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const days = [];
    const today = new Date();

    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-24 md:h-28 bg-transparent"></div>);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      const isSelected = isSameDay(date, selectedDate);

      const dayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        return isSameDay(new Date(t.dueDate), date);
      });

      // --- CSS ĐÃ ĐƯỢC TINH CHỈNH ---
      days.push(
        <div 
          key={i} 
          onClick={() => setSelectedDate(date)}
          className={`h-24 md:h-28 border rounded-2xl p-2 relative cursor-pointer transition-all group flex flex-col items-center
            ${isSelected 
              ? 'bg-white/5 border-primary/50 shadow-[inset_0_0_20px_rgba(0,224,255,0.1)]' // Viền sáng khi chọn
              : isToday 
                ? 'bg-bg-dark border-primary/30' // Viền nhẹ cho hôm nay
                : 'bg-bg-dark border-white/5 hover:bg-white/5' // Mặc định
            }
          `}
        >
          {/* Số ngày (Luôn hiển thị rõ) */}
          <div className={`flex justify-center items-center w-8 h-8 rounded-full text-sm font-bold transition-all mb-1
            ${isToday 
              ? 'bg-primary text-bg-dark shadow-[0_0_10px_rgba(0,224,255,0.5)]' 
              : isSelected ? 'text-primary' : 'text-text-sub group-hover:text-text-main'
            }
          `}>
            {i}
          </div>

          {/* --- CÁC CHẤM MÀU (Đã bố trí lại vị trí) --- */}
          <div className="flex gap-1 flex-wrap justify-center max-w-[80%]">
            {/* Chỉ hiện tối đa 3 chấm để không vỡ layout */}
            {dayTasks.slice(0, 3).map((task, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${getDotColor(task.priority)}`}
                title={task.title}
              />
            ))}
            {/* Nếu > 3 task thì hiện dấu ... */}
            {dayTasks.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-text-sub opacity-50" title={`Còn ${dayTasks.length - 3} việc khác`}/>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const selectedDayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-bg-card p-6 rounded-3xl border border-white/5 shadow-neu-flat">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-3">
          <CalendarIcon className="text-primary" />
          Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-bg-dark border border-white/10 hover:text-primary transition-colors"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-bg-dark border border-white/10 hover:text-primary transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full min-h-0">
        {/* Calendar Grid */}
        <div className="flex-1 bg-bg-card p-6 rounded-3xl border border-white/5 shadow-neu-flat overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-7 mb-4 text-center">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
              <div key={day} className="text-text-sub font-bold text-xs uppercase tracking-wider py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
        </div>

        {/* Task List */}
        <div className="xl:w-[400px] bg-bg-card p-6 rounded-3xl border border-white/5 shadow-neu-flat flex flex-col">
          <h3 className="text-lg font-bold text-text-main mb-4 flex justify-between items-center">
            <span>{selectedDate.getDate()}/{selectedDate.getMonth() + 1}</span>
            <span className="text-sm font-normal text-text-sub bg-white/5 px-3 py-1 rounded-lg">{selectedDayTasks.length} việc</span>
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map(task => <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-sub opacity-40">
                <CalendarIcon size={48} className="mb-3" /><p>Không có công việc nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;