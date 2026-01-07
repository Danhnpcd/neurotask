import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus, Box, ArrowLeft, ShieldAlert } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import ProjectCard from './components/ProjectCard'; // Refactored to accept onUpdateTask, onUpdateProject
import RightPanel from './components/RightPanel';
import NewTaskModal from './components/NewTaskModal';
import NewProjectModal from './components/NewProjectModal';
import EditTaskModal from './components/EditTaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import OverviewDashboard from './components/OverviewDashboard';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import CalendarView from './components/CalendarView';
import MobileNavbar from './components/MobileNavbar';
import { Project, Task, User } from './types';
import { subscribeToProjects, addProject, deleteProject, updateProject } from './services/projectService'; // Added updateProject
import { subscribeToTasks, subscribeToAllTasks, addTask, updateTask, deleteTask } from './services/taskService';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, logoutUser, updateUserProfile } from './services/authService';
import LoginModal from './components/LoginModal';
import LandingPage from './src/pages/LandingPage';
import { BrowserRouter } from 'react-router-dom';
import { mockUser } from './src/data/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // --- STATE FOR DEMO MODE "DATABASE" ---
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // --- AUTH LISTENER ---
  useEffect(() => {
    if (isDemoMode) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setCurrentUser(userProfile);
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // State Management
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'profile' | 'admin'>('dashboard');

  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  // 1. PROJECT SUBSCRIPTION
  useEffect(() => {
    if (isDemoMode) {
      return;
    }

    if (currentUser) {
      const unsubscribe = subscribeToProjects(currentUser.id, (fetchedProjects) => {
        setProjects(fetchedProjects);
        setSelectedProjectId(prevId => {
          const stillExists = fetchedProjects.find(p => p.id === prevId);
          return stillExists ? prevId : null;
        });
      });
      return () => unsubscribe();
    }
  }, [isDemoMode, currentUser]);

  // 2. TASKS SUBSCRIPTION
  useEffect(() => {
    if (isDemoMode) {
      if (selectedProjectId && activeTab === 'dashboard') {
        const projectTasks = localTasks.filter(t => t.projectId === selectedProjectId);
        setTasks(projectTasks);
      } else {
        setTasks([]);
      }
      return;
    }

    if (selectedProjectId && activeTab === 'dashboard') {
      setIsTasksLoading(true);
      const unsubscribe = subscribeToTasks(selectedProjectId, (fetchedTasks) => {
        setTasks(fetchedTasks);
        setIsTasksLoading(false);
      });
      return () => unsubscribe();
    } else {
      setTasks([]);
      setIsTasksLoading(false);
    }
  }, [selectedProjectId, activeTab, isDemoMode, localTasks]);

  // 3. ALL TASKS SUBSCRIPTION
  useEffect(() => {
    if (isDemoMode) {
      setAllTasks(localTasks);
      return;
    }

    if ((activeTab === 'calendar' || (activeTab === 'dashboard' && !selectedProjectId)) && currentUser) {
      const unsubscribe = subscribeToAllTasks(currentUser.id, (fetchedTasks) => {
        setAllTasks(fetchedTasks);
      });
      return () => unsubscribe();
    }
  }, [activeTab, selectedProjectId, isDemoMode, localTasks, currentUser]);

  // --- HANDLERS ---

  const handleStartDemo = () => {
    setIsDemoMode(true);
    setCurrentUser(mockUser);
    setProjects([]);
    setLocalTasks([]);
    setActiveTab('dashboard');
  };

  const handleRequireLogin = () => {
    if (isDemoMode) {
      return true;
    }
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return false;
    }
    return true;
  };

  // --- CRUD HANDLERS (Hybrid) ---

  const handleCreateProject = async (name: string, startDate: string, endDate: string, description: string) => {
    if (isDemoMode) {
      const newProject: Project = {
        id: `demo-project-${Date.now()}`,
        name,
        startDate,
        endDate,
        description,
        status: 'active',
        taskCount: 0,
        progress: 0,
        members: [mockUser.id], // Fixed: uid -> id
        createdAt: { seconds: Date.now() / 1000 } as any // Fixed: Added createdAt (Using Firestore-like Timestamp if needed by types, or just any)
        // If 'createdAt' in Project type is 'any', this is fine.
      };
      setProjects(prev => [...prev, newProject]);
      return newProject.id;
    }

    try {
      return await addProject(name, startDate, endDate, description);
    } catch (error) {
      console.error("Lỗi khi tạo dự án:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (isDemoMode) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setLocalTasks(prev => prev.filter(t => t.projectId !== projectId));
      setSelectedProjectId(null);
      return;
    }

    try {
      setSelectedProjectId(null);
      await deleteProject(projectId);
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleUpdateProject = async (id: string, name: string, description: string) => {
    if (isDemoMode) {
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, name, description } : p
      ));
      return;
    }
    await updateProject(id, name, description);
  };

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    if (isDemoMode) {
      const newTask: Task = {
        ...taskData,
        id: `demo-task-${Date.now()}-${Math.random()}`,
      };
      setLocalTasks(prev => [...prev, newTask]);
      // Update project task count locally
      setProjects(prev => prev.map(p =>
        p.id === taskData.projectId
          ? { ...p, taskCount: (p.taskCount || 0) + 1 }
          : p
      ));
      return;
    }
    await addTask(taskData);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (isDemoMode) {
      setLocalTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, ...updates } : t
      ));
      return;
    }
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => { // Currently not explicitly used by UI components via App, but ready.
    if (isDemoMode) {
      const taskToDelete = localTasks.find(t => t.id === taskId);
      setLocalTasks(prev => prev.filter(t => t.id !== taskId));
      if (taskToDelete) {
        setProjects(prev => prev.map(p =>
          p.id === taskToDelete.projectId
            ? { ...p, taskCount: Math.max((p.taskCount || 0) - 1, 0) }
            : p
        ));
      }
      return;
    }
    await deleteTask(taskId);
  };


  const handleTaskClick = (task: Task) => {
    setViewingTask(task);
  };

  const handleSwitchToEdit = () => {
    if (!handleRequireLogin()) return;
    setEditingTask(viewingTask);
    setViewingTask(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);

    if (isDemoMode) {
      return;
    }

    try {
      await updateUserProfile(updatedUser);
    } catch (error) {
      console.error("Failed to save user profile", error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm(isDemoMode ? "Thoát chế độ Demo?" : "Bạn có chắc muốn đăng xuất?")) {
      if (isDemoMode) {
        setIsDemoMode(false);
        setCurrentUser(null);
        setProjects([]);
        setLocalTasks([]);
        setActiveTab('dashboard');
      } else {
        try {
          await logoutUser();
          // QUAN TRỌNG: Ép tải lại trang để về Landing Page sạch sẽ
          window.location.reload();
        } catch (error) {
          console.error("Lỗi đăng xuất:", error);
          alert("Đăng xuất thất bại. Vui lòng thử lại.");
        }
      }
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser && !isDemoMode) {
    return (
      <BrowserRouter>
        <LandingPage
          onLoginClick={() => setIsLoginModalOpen(true)}
          onDemoStart={handleStartDemo}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </BrowserRouter>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-dark text-text-main font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddProjectClick={() => {
          if (handleRequireLogin()) setIsProjectModalOpen(true);
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'admin' && !currentUser) {
            setIsLoginModalOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
        user={currentUser}
        onProfileClick={() => setActiveTab('profile')}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 ml-0 md:ml-72 p-4 md:p-8 h-screen overflow-hidden flex flex-col relative z-10">

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-24">

          {projects.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-24 h-24 rounded-3xl bg-bg-card border border-white/5 flex items-center justify-center mb-6 text-primary">
                <Box size={48} />
              </div>
              <h2 className="text-3xl font-extrabold text-text-main mb-3">Chào mừng đến với NeuroTask!</h2>
              <p className="text-text-sub mb-8 max-w-md">
                {isDemoMode ? "Trải nghiệm tạo dự án đầu tiên của bạn ngay bây giờ." : "Không gian làm việc của bạn đang trống."}
              </p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-8 py-4 rounded-2xl font-bold text-white bg-primary shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <FolderPlus size={24} />
                Tạo dự án ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto animate-fade-in">

              {/* Center Panel */}
              <div className={`${activeTab === 'profile' ? 'xl:col-span-12' : 'xl:col-span-8'} flex flex-col gap-8`}>
                <Header />

                {activeTab === 'dashboard' && (
                  <>
                    {!selectedProjectId ? (
                      <OverviewDashboard
                        projects={projects}
                        tasks={allTasks}
                        user={currentUser}
                        onSelectProject={setSelectedProjectId}
                      />
                    ) : (
                      <div className="animate-fade-in">
                        <button
                          onClick={() => setSelectedProjectId(null)}
                          className="mb-4 text-sm font-bold text-text-sub hover:text-primary flex items-center gap-2 transition-colors px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
                        >
                          <ArrowLeft size={16} /> Quay lại Tổng quan
                        </button>

                        <StatsRow totalProjects={projects.length} tasks={tasks} />
                        <ProjectCard
                          project={selectedProject}
                          tasks={tasks}
                          loading={isTasksLoading}
                          onEditTask={handleTaskClick}
                          onDelete={(id) => {
                            if (handleRequireLogin()) {
                              handleDeleteProject(id);
                            }
                          }}
                          userRole={currentUser?.role}
                          onUpdateTask={handleUpdateTask}
                          onUpdateProject={handleUpdateProject}
                          isDemoMode={isDemoMode}
                        />
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'calendar' && (
                  <CalendarView
                    tasks={allTasks}
                    projects={projects}
                    onEditTask={handleTaskClick}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfilePage
                    user={currentUser}
                    onUpdate={handleUpdateUser}
                    onLogout={handleLogout}
                  />
                )}

                {activeTab === 'admin' && (
                  currentUser?.role === 'admin' ? (
                    <AdminPage />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ShieldAlert size={48} className="text-red-500 mb-4" />
                      <h2 className="text-2xl font-bold text-text-main">Truy cập bị từ chối</h2>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90"
                      >
                        Quay lại Tổng quan
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* Right Panel */}
              {activeTab !== 'profile' && activeTab !== 'admin' && (
                <div className="xl:col-span-4 flex flex-col pt-0 xl:pt-[80px]">
                  <RightPanel
                    tasks={(!selectedProjectId || activeTab === 'calendar') ? allTasks : tasks}
                    onEditTask={handleTaskClick}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {activeTab === 'dashboard' && selectedProjectId && projects.length > 0 && (
          <button
            onClick={() => {
              if (handleRequireLogin()) {
                setIsTaskModalOpen(true);
              }
            }}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-white hidden md:flex items-center justify-center shadow-[0_0_20px_rgba(0,224,255,0.4)] border-2 border-primary hover:scale-105 hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] transition-all z-50 group"
          >
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

      </main>

      <MobileNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddProjectClick={() => {
          if (handleRequireLogin()) setIsProjectModalOpen(true);
        }}
        onResetSelection={() => setSelectedProjectId(null)}
      />

      {/* --- CÁC MODAL --- */}
      {viewingTask && (
        <TaskDetailModal
          task={viewingTask}
          projectName={projects.find(p => p.id === viewingTask.projectId)?.name}
          onClose={() => setViewingTask(null)}
          onEdit={handleSwitchToEdit}
          onUpdate={handleUpdateTask}
          isDemoMode={isDemoMode}
        />
      )}

      {isTaskModalOpen && selectedProjectId && (
        <NewTaskModal
          onClose={() => setIsTaskModalOpen(false)}
          projectId={selectedProjectId}
          projectName={projects.find(p => p.id === selectedProjectId)?.name}
          onAdd={handleAddTask} // PASS HANDLER
        />
      )}

      {editingTask && (
        <EditTaskModal
          key={editingTask.id}
          isOpen={!!editingTask}
          task={editingTask}
          projectName={projects.find(p => p.id === editingTask.projectId)?.name}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask} // PASS HANDLER
        />
      )}

      <NewProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onConfirm={handleCreateProject} // Already existing
        onAdd={handleAddTask} // PASS HANDLER for AI
      />

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default App;