export type Priority = 'high' | 'normal' | 'low';
export type Status = 'pending' | 'in_progress' | 'completed';

export interface Project {
  id: string;
  name: string;
  createdAt: any;
  userId?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;

  // --- MỚI: Thêm mô tả dự án ---
  description?: string;
  status?: 'active' | 'archived';
  taskCount?: number;
  progress?: number;
  members?: string[];
  ownerId?: string; // NEW: Data Isolation
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignee: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: any;
  ownerId?: string; // NEW: Data Isolation
}

export interface User {
  id: string;          // UID lấy từ Firebase Authentication
  name: string;        // displayName
  email: string;
  avatarUrl: string;   // photoURL
  role: 'admin' | 'member'; // Mặc định là 'member' khi tạo mới

  // Các field cũ giữ lại nếu cần thiết cho profile page (optional)
  coverUrl?: string;
  phone?: string;
  department?: string;
  location?: string;
  bio?: string;
  skills?: string[];
}