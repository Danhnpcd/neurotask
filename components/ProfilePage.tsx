import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Edit2,
    Save,
    X,
    LogOut,
    Award,
    Camera,
    Image as ImageIcon,
    RefreshCw,
    Plus
} from 'lucide-react';
import { User } from '../types';

interface ProfilePageProps {
    user: User;
    onUpdate: (user: User) => void;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);
    const [newSkill, setNewSkill] = useState('');

    // Sync with props when user changes (e.g. after save or initial load)
    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRandomImage = (type: 'avatar' | 'cover') => {
        const randomId = Math.floor(Math.random() * 1000);
        const url = type === 'avatar'
            ? `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
            : `https://picsum.photos/seed/${randomId}/1200/400`;

        setFormData(prev => ({
            ...prev,
            [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url
        }));
    };

    const handleAddSkill = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newSkill.trim()) return;

        if (!formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
        }
        setNewSkill('');
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
        alert("Cập nhật hồ sơ thành công!");
        // In a real app, use a Toast component
    };

    const handleCancel = () => {
        setFormData(user);
        setNewSkill('');
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in max-w-6xl mx-auto pb-12">

            {/* 1. Header Section with Cover & Avatar */}
            <div className="rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card relative overflow-visible mt-4">

                {/* Cover Image */}
                <div className="h-48 md:h-64 w-full relative rounded-t-3xl overflow-hidden group">
                    {formData.coverUrl ? (
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${formData.coverUrl}')` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent"></div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-50"></div>
                    )}

                    {isEditing && (
                        <div className="absolute top-4 right-4 flex gap-2 animate-fade-in">
                            <button
                                onClick={() => handleRandomImage('cover')}
                                className="p-2 rounded-xl bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all border border-white/10"
                                title="Ảnh ngẫu nhiên"
                            >
                                <RefreshCw size={18} />
                            </button>
                            <div className="relative group/input">
                                <input
                                    name="coverUrl"
                                    value={formData.coverUrl || ''}
                                    onChange={handleChange}
                                    className="pl-3 pr-10 py-2 rounded-xl bg-black/50 text-white text-sm border border-white/10 outline-none w-64 backdrop-blur-sm focus:bg-black/70 transition-all"
                                    placeholder="URL ảnh bìa..."
                                />
                                <ImageIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile General Info & Avatar */}
                <div className="px-8 pb-8 pt-16 md:pt-4 relative flex flex-col md:flex-row items-center md:items-end gap-6">

                    {/* Avatar - Overlapping */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-10 group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-bg-card shadow-neu-pressed border border-white/5 flex items-center justify-center overflow-hidden relative">
                            {formData.avatarUrl ? (
                                <img
                                    src={formData.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover bg-bg-dark"
                                />
                            ) : (
                                <UserIcon size={64} className="text-text-sub" />
                            )}

                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] rounded-full">
                                    <button
                                        onClick={() => handleRandomImage('avatar')}
                                        className="p-3 bg-primary text-bg-dark rounded-full hover:scale-110 transition-transform shadow-lg"
                                        title="Đổi Avatar ngẫu nhiên"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[120px]">
                                {/* Hidden or small input for avatar URL if needed, but Random button is mainly used here for demo */}
                            </div>
                        )}
                    </div>

                    {/* Spacer for desktop to account for avatar width */}
                    <div className="hidden md:block w-40 shrink-0"></div>

                    {/* Name & Role */}
                    <div className="flex-1 text-center md:text-left flex flex-col gap-1 mt-4 md:mt-0 min-w-0 w-full">
                        {isEditing ? (
                            <div className="flex flex-col gap-3 w-full max-w-lg mx-auto md:mx-0 animate-fade-in">
                                <div className="flex gap-2">
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="flex-1 text-2xl md:text-3xl font-extrabold bg-bg-dark border border-white/10 rounded-xl px-4 py-2 text-text-main focus:border-primary/50 outline-none shadow-neu-pressed-sm"
                                        placeholder="Họ và tên"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        name="role"
                                        value={formData.role}
                                        disabled
                                        className="text-base md:text-lg font-medium bg-bg-dark/50 border border-white/5 rounded-xl px-4 py-2 text-text-sub cursor-not-allowed w-full md:w-2/3"
                                        title="Không thể tự thay đổi chức danh"
                                    />
                                    {/* Lock Icon */}
                                    <div className="absolute right-1/3 top-1/2 -translate-y-1/2 text-text-sub hidden md:block">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight">{formData.name}</h1>
                                <p className="text-primary font-bold text-lg md:text-xl flex items-center justify-center md:justify-start gap-2">
                                    <Briefcase size={20} />
                                    {formData.role}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Actions Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 rounded-xl font-bold text-text-sub bg-bg-card shadow-neu-btn border border-white/5 hover:text-text-main active:shadow-neu-pressed transition-all flex items-center justify-center gap-2"
                                >
                                    <X size={18} /> Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 rounded-xl font-bold text-bg-dark bg-primary shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Lưu thay đổi
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 rounded-xl font-bold text-text-main bg-bg-card shadow-neu-btn border border-white/5 hover:text-primary active:shadow-neu-pressed transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Edit2 size={18} className="group-hover:rotate-12 transition-transform" />
                                    Chỉnh sửa hồ sơ
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-3 rounded-xl font-bold text-red-400 bg-bg-card shadow-neu-btn border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 active:shadow-neu-pressed transition-all flex items-center justify-center"
                                    title="Đăng xuất"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Column 1: Contact Info (1/3 width on large screens) */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="p-6 md:p-8 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex flex-col gap-6">
                        <h3 className="text-xl font-extrabold text-text-main border-b border-white/5 pb-4 flex items-center gap-3">
                            <UserIcon size={24} className="text-primary" />
                            Thông tin cá nhân
                        </h3>

                        <div className="flex flex-col gap-6">
                            <InfoField
                                icon={<Mail size={18} />}
                                label="Email"
                                value={formData.email}
                                name="email"
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoField
                                icon={<Phone size={18} />}
                                label="Điện thoại"
                                value={formData.phone}
                                name="phone"
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoField
                                icon={<Briefcase size={18} />}
                                label="Phòng ban"
                                value={formData.department}
                                name="department"
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                            <InfoField
                                icon={<MapPin size={18} />}
                                label="Địa chỉ"
                                value={formData.location}
                                name="location"
                                isEditing={isEditing}
                                onChange={handleChange}
                            />

                            {isEditing && (
                                <div className="pt-4 border-t border-white/5">
                                    <label className="text-xs font-bold text-text-sub uppercase mb-2 block">Avatar URL (Tùy chỉnh)</label>
                                    <input
                                        name="avatarUrl"
                                        value={formData.avatarUrl}
                                        onChange={handleChange}
                                        className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-2 text-text-main text-sm focus:border-primary/50 outline-none shadow-neu-pressed placeholder:text-text-sub/30"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Bio & Skills (2/3 width on large screens) */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Bio Section */}
                    <div className="p-6 md:p-8 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex flex-col gap-6">
                        <h3 className="text-xl font-extrabold text-text-main border-b border-white/5 pb-4 flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full bg-primary shadow-[0_0_10px_rgba(0,224,255,0.6)]"></div>
                            Giới thiệu bản thân
                        </h3>

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={6}
                                className="w-full bg-bg-dark border border-white/10 rounded-2xl p-4 text-text-main focus:border-primary/50 outline-none shadow-neu-pressed resize-none leading-relaxed custom-scrollbar"
                                placeholder="Hãy viết đôi dòng về bản thân, kinh nghiệm và đam mê của bạn..."
                            />
                        ) : (
                            <div className="bg-bg-dark/50 rounded-2xl p-6 border border-white/5">
                                <p className="text-text-sub leading-relaxed whitespace-pre-wrap text-base">
                                    {formData.bio || "Chưa có thông tin giới thiệu."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className="p-6 md:p-8 rounded-3xl shadow-neu-flat border border-white/5 bg-bg-card flex flex-col gap-6">
                        <h3 className="text-xl font-extrabold text-text-main border-b border-white/5 pb-4 flex items-center gap-3">
                            <Award size={24} className="text-primary" /> Kỹ năng & Chuyên môn
                        </h3>

                        {isEditing && (
                            <div className="flex gap-2 animate-fade-in">
                                <input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-text-main focus:border-primary/50 outline-none shadow-neu-pressed"
                                    placeholder="Nhập kỹ năng và nhấn Enter..."
                                />
                                <button
                                    onClick={() => handleAddSkill()}
                                    disabled={!newSkill.trim()}
                                    className="px-4 py-2 rounded-xl bg-bg-dark border border-white/10 hover:border-primary/50 text-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-neu-btn active:shadow-neu-pressed transition-all"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {formData.skills.length > 0 ? (
                                formData.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className={`
                                  group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300
                                  ${isEditing
                                                ? 'bg-bg-dark border-white/10 pr-2 hover:border-red-500/50'
                                                : 'bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/40 text-primary shadow-[0_0_10px_rgba(0,224,255,0.1)]'
                                            }
                                `}
                                    >
                                        <span className={`font-medium ${isEditing ? 'text-text-main' : ''}`}>{skill}</span>
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="p-1 rounded-lg hover:bg-red-500/20 text-text-sub hover:text-red-400 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-8 border-2 border-dashed border-white/5 rounded-2xl text-text-sub italic">
                                    Chưa có kỹ năng nào được thêm.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper Component for Info Rows
const InfoField = ({ icon, label, value, name, isEditing, onChange }: any) => {
    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-2">
                {React.cloneElement(icon, { size: 16, className: "text-primary" })}
                <p className="text-xs font-bold text-text-sub uppercase tracking-wider">{label}</p>
            </div>

            {isEditing ? (
                <input
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-text-main text-sm focus:border-primary/50 outline-none shadow-neu-pressed transition-all"
                />
            ) : (
                <div className="pl-6 border-l-2 border-white/5 py-1">
                    <p className="text-text-main font-medium text-base truncate selection:bg-primary/30">
                        {value || "---"}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProfilePage;