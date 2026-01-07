import React from 'react';
import { Task } from '../types';

interface RightPanelProps {
  tasks: Task[];
}

const RightPanel: React.FC<RightPanelProps> = ({ tasks }) => {
  // --- Timeline Logic ---
  const upcomingTasks = tasks
    .filter(t => t.dueDate && t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  // --- Performance Logic ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const highPriorityPending = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  let evaluation = "Cần cố gắng";
  let evalColor = "text-orange-400";
  if (completionRate >= 80) {
    evaluation = "Tuyệt vời";
    evalColor = "text-primary";
  } else if (completionRate >= 50) {
    evaluation = "Tốt";
    evalColor = "text-green-400";
  }

  // --- HÀM ĐÃ SỬA: FORMAT NGÀY GỌN GÀNG ---
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Kết quả: 05/01 (Ngày/Tháng)
      return new Intl.DateTimeFormat('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Timeline Card */}
      <div className="p-6 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex flex-col h-[400px]">
        <h3 className="text-lg font-bold text-text-main mb-6">Lịch trình dự án</h3>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task, index) => (
              <TimelineItem 
                key={task.id}
                date={formatDate(task.dueDate)} 
                title={task.title} 
                sub={`Phụ trách: ${task.assignee}`} 
                active={index === 0} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-sub opacity-50">
              <p className="text-sm font-medium">Chưa có lịch trình sắp tới</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats Card */}
      <div className="p-6 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex-1">
        <h3 className="text-lg font-bold text-text-main mb-6">Chỉ số hiệu suất</h3>
        <div className="grid grid-cols-2 gap-4">
          <PerformanceItem 
            value={`${completionRate}%`} 
            label="Tỷ lệ hoàn thành" 
            color={evalColor} 
          />
          <PerformanceItem 
            value={evaluation} 
            label="Đánh giá tiến độ" 
            color={evalColor} 
          />
          <PerformanceItem 
            value={highPriorityPending.toString()} 
            label="Ưu tiên cao (Chưa xong)" 
            color="text-red-400" 
          />
          <PerformanceItem 
            value={totalTasks.toString()} 
            label="Tổng số công việc" 
            color="text-text-main" 
          />
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{ date: string; title: string; sub: string; active?: boolean }> = ({ date, title, sub, active }) => {
  return (
    <div className={`border-l-2 pl-4 py-1 relative ${active ? 'border-primary' : 'border-gray-600'}`}>
       {active && <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00E0FF]"></div>}
      <p className="text-sm font-bold text-text-main">
        <span className="text-primary">{date}</span>: {title}
      </p>
      <p className="text-xs text-text-sub mt-1 truncate">{sub}</p>
    </div>
  );
};

const PerformanceItem: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => {
  return (
    <div className="p-4 rounded-xl shadow-neu-pressed border border-white/5 flex flex-col justify-center items-center bg-bg-dark">
      <p className={`text-xl lg:text-2xl font-extrabold ${color} mb-1 text-center break-words w-full`}>{value}</p>
      <p className="text-xs text-text-sub text-center leading-tight">{label}</p>
    </div>
  );
};

export default RightPanel;