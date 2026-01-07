Chào sếp, đây là file **`WORKFLOW.md`** tổng hợp toàn bộ quy trình vận hành của hệ thống hiện tại (As-Is) và các đề xuất nâng cấp (To-Be) để sếp có cái nhìn toàn cảnh về dự án.

Sếp có thể lưu nội dung này vào thư mục gốc của dự án để đội ngũ kỹ thuật tiện theo dõi.

---

# 📂 WORKFLOW.md - NeuroTask System Documentation

## I. QUY TRÌNH HỆ THỐNG HIỆN TẠI (AS-IS)

Hệ thống hoạt động dựa trên mô hình **Real-time Data Sync** (Đồng bộ dữ liệu thời gian thực) với Firebase, kết hợp **AI Generative** (Gemini) để tự động hóa quy trình lập kế hoạch.

### 1. Luồng Quản Lý Dự Án (Project Management Flow)

* **Bước 1: Khởi tạo**
* Người dùng mở Modal "Dự án mới".
* Hệ thống tự động điền ngày bắt đầu là **Hôm nay** (Local Time).
* Người dùng nhập tên dự án.
* *(Tính năng AI)*: Người dùng bấm **"AI Gợi ý"**  Hệ thống gọi `suggestProjectDescription`  Tự động điền mô tả chuyên nghiệp.


* **Bước 2: Lập kế hoạch (2 lựa chọn)**
* **Option A (Thủ công):** Bấm "Tạo thường"  Tạo dự án rỗng.
* **Option B (AI Power):** Bấm "Lập kế hoạch chi tiết"  Hệ thống gọi `generateTasksForProject`  Tạo dự án + Tự động sinh danh sách Task kèm Deadline & Độ ưu tiên.


* **Bước 3: Theo dõi Tổng quan**
* Truy cập **Overview Dashboard**.
* Xem biểu đồ tròn tiến độ tổng thể.
* Xem danh sách thẻ dự án (Project Cards) với trạng thái: Gấp / Quá hạn / Đang chạy.



### 2. Luồng Quản Lý Công Việc (Task Execution Flow)

Đây là quy trình cốt lõi đã được tối ưu hóa UX:

* **Trạng thái công việc (Lifecycle):**
`Chờ xử lý (Pending)`  `Đang làm (In Progress)`  `Hoàn thành (Completed)`
* **Thao tác nhanh (Quick Action):**
* Tại danh sách công việc: Người dùng chọn Menu Dropdown trạng thái.
* Dữ liệu cập nhật ngay lập tức lên Firestore và phản ánh lại giao diện (đổi màu sắc icon/text).


* **Xem chi tiết (View Detail):**
* Click vào tên công việc  Mở **TaskDetailModal**.
* Hiển thị: Mô tả đầy đủ (AI viết), Người phụ trách, Deadline.
* Tại đây có thể đổi nhanh Trạng thái hoặc bấm "Chỉnh sửa".


* **Chỉnh sửa (Edit):**
* Mở **EditTaskModal**.
* Cập nhật: Tên, Mô tả, Người phụ trách, Độ ưu tiên, Trạng thái, Hạn chót.



### 3. Luồng Dữ Liệu Kỹ Thuật (Technical Data Flow)

1. **Client (React):** Giao diện người dùng  Gọi hàm trong `services/`.
2. **Service Layer:**
* `projectService.ts`: CRUD Project.
* `taskService.ts`: CRUD Task.
* `aiService.ts`: Giao tiếp với Google Gemini API.


3. **Database (Firebase Firestore):** Lưu trữ dữ liệu dạng NoSQL.
* Collection `projects`: Chứa thông tin dự án.
* Collection `tasks`: Chứa công việc (có `projectId` để liên kết).


4. **Real-time Listener:** `App.tsx` lắng nghe thay đổi từ Firestore  Tự động re-render giao diện khi có bất kỳ thay đổi nào (từ người dùng khác hoặc từ AI).

---

## II. ĐỀ XUẤT HOÀN THIỆN & NÂNG CẤP (TO-BE)

Để hệ thống trở thành một **SaaS Product** hoàn chỉnh, tôi đề xuất lộ trình phát triển tiếp theo như sau:

### 1. Nâng cấp Core Features (Tính năng cốt lõi)

* **Kanban Board View:**
* *Hiện tại:* Chỉ có dạng Danh sách (List View).
* *Đề xuất:* Thêm chế độ xem bảng Kanban (Kéo thả task từ cột "Chờ" sang "Đang làm" sang "Xong"). Đây là tiêu chuẩn của quản lý dự án hiện đại (như Trello/Jira).


* **Hệ thống User & Auth thực tế:**
* *Hiện tại:* Đang dùng Hardcode User ("Minh Hoàng").
* *Đề xuất:* Tích hợp **Firebase Authentication** (Google Login).
* Thêm tính năng "Mời thành viên vào dự án" qua email.
* Assign task cho đúng thành viên trong dự án (thay vì nhập tay tên người phụ trách).



### 2. Tối ưu hóa AI (AI Agent)

* **AI Chat with Data:**
* Thêm cửa sổ Chatbot bên cạnh. Người dùng có thể hỏi: *"Dự án nào đang bị chậm tiến độ?"* hoặc *"Tóm tắt các việc cần làm hôm nay của tôi"*. AI sẽ đọc dữ liệu từ Firestore để trả lời.


* **Sub-task Generation:**
* Khi tạo 1 task lớn, cho phép bấm nút "Break down". AI sẽ tự động chia nhỏ task đó thành 5-6 checklist nhỏ hơn để dễ thực hiện.



### 3. Nâng cấp UX/UI & Notifications

* **Hệ thống Thông báo (Notifications):**
* Thông báo khi: Task sắp hết hạn (còn 1 ngày), Task được AI tạo xong, hoặc có người khác chỉnh sửa task của mình.


* **Dark/Light Mode Toggle:**
* Hiện tại đang fix cứng Dark Mode. Nên cho phép người dùng chuyển đổi giao diện Sáng/Tối.


* **Mobile App View:**
* Tối ưu hóa Sidebar thành Bottom Navigation Bar khi xem trên điện thoại để thao tác bằng một tay dễ hơn.



### 4. Phân tích & Báo cáo (Analytics)

* **Biểu đồ Burn-down:** Hiển thị tốc độ hoàn thành công việc theo thời gian thực.
* **Export Report:** Xuất báo cáo dự án ra file PDF hoặc Excel để gửi cho khách hàng/sếp.

---

### 📝 Ghi chú cho Dev Team (Khi thực hiện code)

* **File cấu trúc:** Luôn tuân thủ cấu trúc thư mục `components/` (UI), `services/` (Logic), `types/` (TS Interface).
* **AI Keys:** API Key hiện tại đang để public trong code demo, khi lên Production cần chuyển vào biến môi trường (`.env`).
* **Quy tắc:** Mọi Modal chỉnh sửa cần có `key={id}` để đảm bảo Reset State (như đã fix ở bước trước).

---

*Tài liệu được cập nhật lần cuối: 06/01/2026*