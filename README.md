# 🧠 NeuroTask Dashboard

**Hệ thống Quản lý Tác vụ Thông minh (AI-Powered Task Management System)**

NeuroTask là một ứng dụng web hiện đại giúp cá nhân và đội nhóm quản lý dự án hiệu quả thông qua giao diện trực quan và sự hỗ trợ mạnh mẽ của Trí tuệ nhân tạo (AI). Hệ thống kết hợp khả năng đồng bộ dữ liệu thời gian thực (Real-time) của Firebase với sức mạnh sáng tạo nội dung của Google Gemini.

![Dashboard Preview](https://via.placeholder.com/800x450.png?text=NeuroTask+Dashboard+Preview)

## 🚀 Tính năng Nổi bật

*   **⚡ Real-time Updates**: Mọi thay đổi về trạng thái công việc, dự án đều được cập nhật tức thì tới tất cả người dùng (sử dụng Firebase Firestore).
*   **🤖 AI Integration (Google Gemini)**:
    *   **Gợi ý thông minh**: Tự động viết mô tả dự án chuyên nghiệp chỉ với một click.
    *   **Lập kế hoạch tự động**: Tự động sinh danh sách công việc (Tasks) chi tiết kèm thời hạn và độ ưu tiên dựa trên tên dự án.
*   **📊 Trực quan hóa dữ liệu**: Dashboard tổng quan với biểu đồ tiến độ và thống kê trạng thái.
*   **📅 Lịch làm việc (Calendar View)**: Theo dõi hạn chót công việc trên giao diện lịch trực quan.
*   **🎨 Giao diện hiện đại**: Thiết kế Dark Mode, tối ưu UX, hỗ trợ Responsive.

## 🛠️ Công nghệ Sử dụng

*   **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), TypeScript
*   **Styling**: Tailwind CSS (Custom classes), Lucide React (Icons)
*   **Backend / Database**: [Firebase Firestore](https://firebase.google.com/)
*   **AI Service**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## ⚙️ Yêu cầu Tiên quyết

Trước khi cài đặt, hãy đảm bảo bạn đã có:

*   [Node.js](https://nodejs.org/) (Khuyên dùng v18+)
*   Tài khoản **Google Firebase** (Để tạo Project và Firestore Database)
*   API Key từ **Google AI Studio** (Cho tính năng Gemini)

## 📦 Hướng dẫn Cài đặt

1.  **Clone dự án**
    ```bash
    git clone https://github.com/your-username/neurotask.git
    cd neurotask
    ```

2.  **Cài đặt thư viện**
    ```bash
    npm install
    # Hoặc nếu dùng yarn
    yarn install
    ```

3.  **Cấu hình Môi trường (.env)**
    Tạo file `.env.local` tại thư mục gốc và điền các thông tin sau:

    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    # Google Gemini AI Config
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Khởi chạy ứng dụng**
    ```bash
    npm run dev
    ```
    Truy cập `http://localhost:3000` (hoặc cổng hiển thị trên terminal) để trải nghiệm.

## 📂 Cấu trúc Dự án

```
neurotask/
├── 📁 components/        # Các thành phần UI (Modal, Sidebar, ProjectCard...)
├── 📁 services/          # Xử lý logic nghiệp vụ và API
│   ├── aiService.ts      # Tích hợp Google Gemini
│   ├── projectService.ts # CRUD Project (Firebase)
│   └── taskService.ts    # CRUD Task (Firebase)
├── 📁 types/             # Định nghĩa TypeScript Interfaces
├── App.tsx               # Component chính & Routing logic
├── firebase.ts           # Cấu hình khởi tạo Firebase
└── ...
```

## 🤝 Quy trình Vận hành (Workflow)

Tham khảo tài liệu chi tiết tại file: [`components/WORKFLOW.md`](./components/WORKFLOW.md).

1.  **Tạo Dự án**: Nhập tên -> Dùng AI gợi ý mô tả -> Chọn "Lập kế hoạch chi tiết" để AI tạo tasks.
2.  **Quản lý**: Kéo thả hoặc đổi trạng thái task -> Hệ thống tự động lưu.
3.  **Theo dõi**: Xem tiến độ trên Dashboard hoặc Lịch.

## 📝 License

This project is licensed under the MIT License.
