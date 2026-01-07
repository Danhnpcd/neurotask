import emailjs from '@emailjs/browser';

// Cấu hình EmailJS
const SERVICE_ID = 'service_4vpx2ke'; // Bạn cần điền Service ID của bạn
const TEMPLATE_ID = 'template_nbh8d3h';
const PUBLIC_KEY = 'B-jaw8uTomOZc5ZzM'; // Bạn cần điền Public Key của bạn

export const sendWelcomeEmail = async (username: string, email: string, password: string) => {
    try {
        const templateParams = {
            to_name: username,
            to_email: email,
            user_password: password,
            reply_to: email, // Hoặc email support của bạn
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('SUCCESS!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('FAILED...', error);
        throw error; // Ném lỗi để UI xử lý nếu cần
    }
};
