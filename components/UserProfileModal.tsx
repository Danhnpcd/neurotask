import React, { useState, useEffect } from 'react';
import { X, LogOut, Save, User as UserIcon, Briefcase, Image as ImageIcon } from 'lucide-react';
import { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
  onLogout: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  onLogout 
}) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setRole(user.role);
      setAvatarUrl(user.avatarUrl);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      ...user,
      name, 
      role, 
      avatarUrl 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-bg-card rounded-3xl p-8 shadow-neu-flat border border-white/10 relative m-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-sub hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-text-main mb-6">Hồ sơ cá nhân</h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full p-1 bg-bg-dark shadow-neu-pressed border border-white/5 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                   <div 
                     className="w-full h-full rounded-full bg-cover bg-center"
                     style={{ backgroundImage: `url('${avatarUrl}')` }}
                   ></div>
                ) : (
                   <UserIcon size={40} className="text-text-sub" />
                )}
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <UserIcon size={14} /> Tên hiển thị
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          {/* Role Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <Briefcase size={14} /> Chức danh / Vai trò
            </label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          {/* Avatar URL Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                <ImageIcon size={14} /> Đường dẫn Avatar (URL)
            </label>
            <input 
              type="text" 
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/20 text-sm"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
             {/* Logout Button */}
            <button 
              type="button"
              onClick={onLogout}
              className="flex-1 py-3 rounded-xl font-bold text-red-400 bg-bg-card hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>

            {/* Save Button */}
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl font-bold text-bg-dark bg-primary shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;