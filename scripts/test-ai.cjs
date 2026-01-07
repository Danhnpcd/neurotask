
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!API_KEY) {
    console.error("No API KEY found");
    process.exit(1);
}

const generateTasksForProject = async (projectName, duration = 7) => {
  const MODEL_NAME = "gemini-2.5-flash";
  const safeDuration = duration || 7;

  console.log(`🚀 Testing with project: "${projectName}" (${safeDuration} days)`);

  try {
    const prompt = `
      # VAI TRÒ
      Bạn là một Senior Project Manager & Tech Lead.
      
      # QUY TẮC NGÔN NGỮ (TUÂN THỦ TUYỆT ĐỐI)
      1. **Tiêu đề (Title):** - BẮT BUỘC dùng **Tiếng Việt** làm nòng cốt.
         - Cấu trúc chuẩn: **[Động từ Tiếng Việt] + [Thuật ngữ chuyên ngành Tiếng Anh]**.
      
      2. **Mô tả (Description):** - Diễn giải chi tiết bằng Tiếng Việt.
         - Giữ nguyên các thuật ngữ kỹ thuật.

      # NHIỆM VỤ
      Lập kế hoạch cho dự án: "${projectName}".
      Thời gian: ${safeDuration} ngày.

      # CẤU TRÚC JSON BẮT BUỘC
      [
        { 
          "title": "Tên task (Động từ Việt + Tech Anh)", 
          "description": "- Bước 1...\\n- Bước 2...",
          "priority": "high" | "normal" | "low", 
          "daysFromNow": Số_nguyên
        }
      ]
    `;

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) console.log("NO TEXT RETURNED");
    
    console.log("---------------------------------------------------");
    console.log("RAW TEXT FROM AI:");
    console.log(text);
    console.log("---------------------------------------------------");

    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
        const cleanJson = text.substring(firstBracket, lastBracket + 1);
        const parsed = JSON.parse(cleanJson);
        console.log("PARSED JSON KEYS of first item:", Object.keys(parsed[0]));
        console.log("First item description:", parsed[0].description);
    } else {
        console.log("Could not parse JSON");
    }

  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

generateTasksForProject("Xây dựng trang Web TMĐT bán giày", 5);
