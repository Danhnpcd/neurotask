import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Resources definition
const resources = {
    en: {
        translation: {
            sidebar: {
                dashboard: "Dashboard",
                calendar: "Calendar",
                profile: "Profile",
                admin: "Admin",
                login: "Login",
                logout: "Logout",
                projects: "Your Projects",
                no_projects: "No projects yet",
                settings: "Settings"
            },
            common: {
                welcome: "Welcome",
                guest: "Guest",
                settings: "Settings",
                theme: "Theme",
                language: "Language",
                search: "Search",
                notifications: "Notifications",
                error: "Error",
                success: "Success"
            },
            actions: {
                create_project: "Create Project",
                edit: "Edit",
                delete: "Delete",
                save: "Save",
                cancel: "Cancel",
                confirm: "Confirm",
                back: "Back"
            },
            dashboard: {
                overview: "Overview",
                total_projects: "Total Projects",
                active_tasks: "Active Tasks",
                completed_tasks: "Completed Tasks",
                welcome_title: "Welcome to NeuroTask!",
                welcome_desc: "Your workspace is empty. Start your journey by creating your first project.",
                create_now: "Create Now"
            }
        }
    },
    vi: {
        translation: {
            sidebar: {
                dashboard: "Tổng quan",
                calendar: "Lịch trình",
                profile: "Hồ sơ",
                admin: "Quản trị viên",
                login: "Đăng nhập",
                logout: "Đăng xuất",
                projects: "Dự án của bạn",
                no_projects: "Chưa có dự án nào",
                settings: "Cài đặt"
            },
            common: {
                welcome: "Chào mừng",
                guest: "Khách",
                settings: "Cài đặt",
                theme: "Giao diện",
                language: "Ngôn ngữ",
                search: "Tìm kiếm",
                notifications: "Thông báo",
                error: "Lỗi",
                success: "Thành công"
            },
            actions: {
                create_project: "Tạo dự án",
                edit: "Chỉnh sửa",
                delete: "Xóa",
                save: "Lưu",
                cancel: "Hủy",
                confirm: "Xác nhận",
                back: "Quay lại"
            },
            dashboard: {
                overview: "Tổng quan",
                total_projects: "Tổng số dự án",
                active_tasks: "Công việc đang làm",
                completed_tasks: "Công việc hoàn thành",
                welcome_title: "Chào mừng đến với NeuroTask!",
                welcome_desc: "Không gian làm việc của bạn đang trống. Hãy bắt đầu hành trình quản lý công việc hiệu quả bằng cách tạo dự án đầu tiên.",
                create_now: "Tạo dự án ngay"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'vi', // Default to Vietnamese if detection fails or preference not set
        interpolation: {
            escapeValue: false // React already safes from xss
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        }
    });

export default i18n;
