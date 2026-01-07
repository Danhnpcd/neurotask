import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is missing via import.meta.env. Please check your .env file.");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY || '');

export const generateTaskDescription = async (projectName: string, taskTitle: string): Promise<string> => {
    try {
        if (!API_KEY) {
            throw new Error("Missing Gemini API Key");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Tôi đang làm dự án '${projectName}'. Hãy viết một mô tả chi tiết ngắn gọn và chuyên nghiệp (khoảng 3-4 gạch đầu dòng) cho công việc có tên: '${taskTitle}'. Chỉ trả về nội dung, không chào hỏi.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error("Error generating task description:", error);
        throw error;
    }
};
