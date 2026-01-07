import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getAllUsers, updateUserRole } from '../services/adminService';
import { Shield, ShieldAlert, User as UserIcon, Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'member'>('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, currentRole: 'admin' | 'member') => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';

        // Optimistic UI Update
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));

        try {
            await updateUserRole(userId, newRole);
        } catch (error) {
            console.error("Failed to update role", error);
            // Revert on error
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: currentRole } : u
            ));
            alert("Không thể cập nhật quyền. Vui lòng thử lại.");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        members: users.filter(u => u.role === 'member').length
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 text-text-main animate-fade-in h-full overflow-hidden">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <ShieldAlert className="text-primary" size={32} />
                        Quản trị hệ thống
                    </h1>
                    <p className="text-text-sub mt-1">Quản lý thành viên và phân quyền truy cập</p>
                </div>

                <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-xl bg-bg-card border border-white/5 shadow-sm min-w-[120px]">
                        <p className="text-xs text-text-sub uppercase font-bold">Tổng user</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-bg-card border border-white/5 shadow-sm min-w-[120px]">
                        <p className="text-xs text-text-sub uppercase font-bold text-red-400">Admin</p>
                        <p className="text-2xl font-bold text-red-500">{stats.admins}</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-bg-card border border-white/5 shadow-sm min-w-[120px]">
                        <p className="text-xs text-text-sub uppercase font-bold text-green-400">Member</p>
                        <p className="text-2xl font-bold text-green-500">{stats.members}</p>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-card/50 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-dark border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-main placeholder:text-text-sub/50"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-text-sub" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="bg-bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="admin">Admin</option>
                        <option value="member">Thành viên</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-bg-card shadow-neu-flat">
                <div className="overflow-y-auto h-full custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">Thành viên</th>
                                <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">Email</th>
                                <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">Vai trò</th>
                                <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full border border-white/10 object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                                                        }}
                                                    />
                                                    {user.role === 'admin' && (
                                                        <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-0.5 rounded-full border-2 border-bg-card">
                                                            <Shield size={10} fill="currentColor" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-main">{user.name}</p>
                                                    <p className="text-xs text-text-sub">ID: {user.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-text-sub font-mono">
                                            {user.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                                ${user.role === 'admin'
                                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    : 'bg-green-500/10 text-green-500 border-green-500/20'}
                                            `}>
                                                {user.role === 'admin' ? <ShieldAlert size={12} /> : <UserIcon size={12} />}
                                                {user.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRoleChange(user.id, user.role)}
                                                className={`
                                                    text-xs font-bold px-3 py-2 rounded-lg transition-all border
                                                    ${user.role === 'member'
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                        : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                                                    }
                                                `}
                                                title={user.role === 'admin' ? "Giáng chức xuống Member" : "Thăng chức lên Admin"}
                                            >
                                                {user.role === 'member' ? "Thăng chức Admin" : "Giáng chức Member"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-text-sub italic">
                                        Không tìm thấy thành viên nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
