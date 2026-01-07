import React from 'react';
import { Loader2, ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEditTask?: (task: Task) => void;
  // NEW PROPS
  selectedTaskIds?: string[];
  onToggleSelect?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onEditTask, selectedTaskIds, onToggleSelect, onUpdateTask }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-sub">
        <Loader2 size={32} className="animate-spin mb-3 text-primary" />
        <p className="text-sm font-medium">Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
        <ClipboardList size={48} className="text-text-sub/30 mb-4" />
        <p className="text-text-sub font-medium">Dự án này chưa có công việc nào.</p>
        <p className="text-text-sub/60 text-sm mt-1">Hãy thêm mới để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEditTask?.(task)}
          isSelected={selectedTaskIds?.includes(task.id)}
          onToggleSelect={onToggleSelect}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
};

export default TaskList;