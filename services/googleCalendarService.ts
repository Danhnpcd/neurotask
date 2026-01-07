import { Task } from '../types';

export const syncTaskToGoogleCalendar = async (task: Task, manualToken?: string): Promise<string> => {
    // Ưu tiên dùng token truyền vào (chế độ Demo), nếu không thì tìm trong localStorage
    const token = manualToken || localStorage.getItem('google_access_token');

    if (!token) {
        throw new Error("Không tìm thấy Access Token. Vui lòng đăng nhập lại!");
    }

    if (!task.dueDate) {
        throw new Error("Vui lòng đặt hạn chót (Due Date) cho công việc trước khi đồng bộ.");
    }

    // Format Start Time (ISO 8601)
    const startDate = new Date(task.dueDate);
    const startIso = startDate.toISOString();

    // Format End Time (Start + 1 hour default)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour
    const endIso = endDate.toISOString();

    const event = {
        summary: task.title,
        description: task.description || '',
        start: {
            dateTime: startIso,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
            dateTime: endIso,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    };

    try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google Calendar API Error:', errorData);
            throw new Error(`Lỗi API: ${errorData.error?.message || 'Không xác định'}`);
        }

        const data = await response.json();
        return data.htmlLink; // Trả về link sự kiện

    } catch (error) {
        console.error("Sync failed:", error);
        throw error;
    }
};

export const syncBatchTasks = async (tasks: Task[], manualToken?: string): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    // Sử dụng Promise.allSettled để chạy song song nhưng không dừng khi có lỗi
    const results = await Promise.allSettled(
        tasks.map(async (task) => {
            // Chỉ đồng bộ nếu có Due Date
            if (!task.dueDate) {
                throw new Error(`Task "${task.title}" skipped: No Due Date`);
            }
            return syncTaskToGoogleCalendar(task, manualToken);
        })
    );

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            success++;
        } else {
            failed++;
            console.error("Batch sync individual failure:", result.reason);
        }
    });

    return { success, failed };
};
