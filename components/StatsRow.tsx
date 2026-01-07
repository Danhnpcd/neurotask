import React from 'react';
import { Folder, TrendingUp, Hourglass, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface StatsRowProps {
  totalProjects: number;
  tasks: Task[];
}

const StatsRow: React.FC<StatsRowProps> = ({ totalProjects, tasks }) => {
  // Calculate stats dynamically
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard 
        title="Tổng dự án" 
        value={totalProjects.toString()} 
        icon={<Folder size={20} />} 
        color="text-primary" 
        bgColor="bg-primary/10"
      />
      <StatCard 
        title="Đang làm" 
        value={inProgressCount.toString()} 
        icon={<TrendingUp size={20} />} 
        color="text-yellow-500" 
        bgColor="bg-yellow-500/10"
      />
      <StatCard 
        title="Đang chờ" 
        value={pendingCount.toString()} 
        icon={<Hourglass size={20} />} 
        color="text-orange-400" 
        bgColor="bg-orange-400/10"
      />
      <StatCard 
        title="Hoàn thành" 
        value={completedCount.toString()} 
        icon={<CheckCircle2 size={20} />} 
        color="text-green-500" 
        bgColor="bg-green-500/10"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="p-6 flex flex-col justify-between h-32 rounded-2xl shadow-neu-flat border border-white/5 bg-bg-card transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <p className="text-text-sub text-sm font-bold">{title}</p>
        <div className={`p-2 rounded-lg ${color} ${bgColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-text-main">{value}</p>
    </div>
  );
};

export default StatsRow;