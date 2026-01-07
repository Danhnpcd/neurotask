import { Project, Task, User } from '../../types';

export const mockUser: User = {
    id: 'demo-user',
    email: 'demo@neurotask.ai',
    name: 'Khách trải nghiệm',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: 'member',
    createdAt: Date.now(),
    lastLogin: Date.now()
};

export const mockProjects: Project[] = [];

export const mockTasks: Task[] = [];
