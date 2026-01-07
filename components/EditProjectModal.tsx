import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Project } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: (id: string, name: string, description: string) => Promise<void> | void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onConfirm }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      setName(project.name);
      setDescription(project.description || ''); // Load mô tả hiện tại
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 1. Đóng cửa sổ NGAY LẬP TỨC (Fire and Forget)
    onClose();

    // 2. Lưu ngầm bên dưới
    onConfirm(project.id, name, description).catch(err => {
      console.error("Lỗi lưu ngầm:", err);
    });
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

        <h2 className="text-2xl font-bold text-text-main mb-6">Chỉnh sửa dự án</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub">Tên dự án</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-sub">Mô tả chi tiết</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="px-4 py-3 rounded-xl bg-bg-dark shadow-neu-pressed border border-white/5 text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder-text-sub/30 resize-none custom-scrollbar"
              placeholder="Nhập mô tả dự án..."
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-text-sub bg-bg-card shadow-neu-btn border border-white/5 hover:text-text-main active:shadow-neu-pressed transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-bg-dark bg-primary shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;