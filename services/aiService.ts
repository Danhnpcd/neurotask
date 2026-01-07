// =================================================================
// Key chuẩn của sếp (Đuôi ...u0aA)
// =================================================================
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateTasksForProject = async (projectName: string, duration: number = 7) => {
  const MODEL_NAME = "gemini-2.5-flash";

  const safeDuration = duration || 7;
  const minTasks = Math.max(5, safeDuration);
  const maxTasks = Math.ceil(safeDuration * 1.5);

  console.log(`🚀 Đang gọi Chuyên gia AI (${MODEL_NAME}) - Style: Title Việt, Tech Anh...`);

  try {
    const prompt = `
      # VAI TRÒ
      Bạn là một Senior Project Manager & Tech Lead.
      
      # QUY TẮC NGÔN NGỮ (TUÂN THỦ TUYỆT ĐỐI)
      1. **Tiêu đề (Title):** - BẮT BUỘC dùng **Tiếng Việt** làm nòng cốt.
         - Cấu trúc chuẩn: **[Động từ Tiếng Việt] + [Thuật ngữ chuyên ngành Tiếng Anh]**.
         - Ví dụ ĐÚNG: "Thiết kế UI/UX", "Cấu hình Docker", "Viết API Login", "Kiểm thử Performance".
         - Ví dụ SAI: "Design UI/UX", "Docker Configuration" (Quá nhiều tiếng Anh).
      
      2. **Mô tả (Description):** - Diễn giải chi tiết bằng Tiếng Việt.
         - Giữ nguyên các thuật ngữ kỹ thuật (Backend, Frontend, Deploy, CI/CD, Database...).

      # NHIỆM VỤ
      Lập kế hoạch cho dự án: "${projectName}".
      Thời gian: ${safeDuration} ngày.

      # CẤU TRÚC JSON BẮT BUỘC
      [
        { 
          "title": "Tên task (Động từ Việt + Tech Anh)", 
          "description": "Chuỗi văn bản (String) có chứa ký tự xuống dòng \\n. KHÔNG trả về mảng.",
          "priority": "high" | "normal" | "low", 
          "daysFromNow": Số_nguyên
        }
      ]

      # VÍ DỤ MẪU (OUTPUT MONG MUỐN)
      [
        { 
          "title": "Khởi tạo Repo & Cấu hình CI/CD", 
          "description": "- Tạo Git repository và setup cấu trúc Monorepo\\n- Viết file workflow cho Github Actions\\n- Cài đặt môi trường Node.js",
          "priority": "high", 
          "daysFromNow": 1 
        },
        { 
          "title": "Thiết kế Database Schema", 
          "description": "- Phân tích quan hệ các bảng (ERD)\\n- Viết script Migration cho PostgreSQL\\n- Review cấu trúc dữ liệu",
          "priority": "high", 
          "daysFromNow": 2 
        }
      ]
    `;

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI không trả về nội dung");

    console.log("🤖 AI trả lời:", text);

    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket === -1) throw new Error("AI trả về sai định dạng JSON");

    const cleanJson = text.substring(firstBracket, lastBracket + 1);
    const rawData = JSON.parse(cleanJson);

    // --- NORMALIZE DATA ---
    // Đảm bảo luôn có description chuẩn để không bị lỗi hiển thị
    return rawData.map((task: any) => {
      // Check every possible key standard and non-standard
      const rawDesc = task.description || task.Description || task.desc || task.details || task.content || task.summary || task.steps || task.notes || task.subtasks || "";

      let description = Array.isArray(rawDesc) ? rawDesc.join('\n') : String(rawDesc);

      // DEBUG: Nếu vẫn không tìm thấy mô tả, in ra RAW object để debug trực tiếp trên UI
      if (!description || description === "undefined" || description.trim() === "") {
        description = "⚠️ AI ERROR: Missing description. Raw Data: " + JSON.stringify(task);
      }

      return {
        title: task.title,
        description: description,
        priority: task.priority || 'normal',
        daysFromNow: task.daysFromNow || 1
      };
    });

  } catch (error: any) {
    console.error("❌ LỖI AI:", error);
    return [{
      title: `⚠️ Lỗi hệ thống: ${error.message}`,
      description: "Vui lòng thử lại sau.",
      priority: "high",
      daysFromNow: 0
    }];
  }
};

// --- MỚI THÊM: HÀM GỢI Ý MÔ TẢ DỰ ÁN ---
export const suggestProjectDescription = async (projectName: string) => {
  const MODEL_NAME = "gemini-2.5-flash";
  console.log(`🚀 Đang nhờ AI viết mô tả cho: ${projectName}...`);

  try {
    const prompt = `
      Là một chuyên gia quản lý dự án, hãy viết một đoạn mô tả ngắn gọn (khoảng 2-3 câu) về mục tiêu và phạm vi cho dự án: "${projectName}".
      - Văn phong: Chuyên nghiệp, súc tích, Tiếng Việt.
      - Đi thẳng vào vấn đề, không chào hỏi.
      - Ví dụ: "Xây dựng hệ thống quản lý kho..." -> "Thiết kế và triển khai giải pháp quản lý tồn kho tự động, tích hợp mã vạch để tối ưu hóa quy trình xuất nhập hàng hóa và giảm thiểu thất thoát."
    `;

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text ? text.trim() : "";

  } catch (error) {
    console.error("Lỗi AI gợi ý mô tả:", error);
    return "";
  }
};