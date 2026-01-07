# HƯỚNG DẪN BẬT GOOGLE AUTH TRÊN FIREBASE

Để khắc phục lỗi `auth/configuration-not-found`, bạn cần thực hiện các bước sau trên Firebase Console:

## 1. Truy cập Console
- Vào đường dẫn: [Firebase Console](https://console.firebase.google.com/)
- Chọn dự án của bạn (ví dụ: **NeuroTask**).

## 2. Bật Google Sign-In
1.  Ở menu bên trái, chọn **Build** -> **Authentication**.
2.  Chọn tab **Sign-in method**.
3.  Nếu không thấy **Google** trong danh sách "Sign-in providers":
    - Nhấn nút **Add new provider**.
    - Chọn **Google**.
4.  Trong cửa sổ hiện ra:
    - Bật công tắc **Enable** (góc trên bên phải).
    - Nhập tên dự án (Google hiển thị cho user) nếu được hỏi.
    - **QUAN TRỌNG:** Nhập email hỗ trợ (Project support email) - thường là email của bạn.
5.  Nhấn nút **Save**.

## 3. Kiểm tra lại (Verify)
- Quay lại ứng dụng React của bạn (http://localhost:5173).
- Mở F12 (Dev Tools) -> Tab Console.
- Nhấn nút Đăng nhập lại.
- Nếu thành công, bạn sẽ thấy popup đăng nhập Google hiện ra.
- Nếu vẫn lỗi, hãy chụp ảnh màn hình Console và gửi lại cho tôi.
