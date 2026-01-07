import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Project } from "../types";

const PROJECTS_COLLECTION = "projects";
const TASKS_COLLECTION = "tasks";

// 1. LẤY DANH SÁCH DỰ ÁN (Real-time, Filter by Owner)
export const subscribeToProjects = (userId: string, callback: (projects: Project[]) => void) => {
  if (!userId) {
    callback([]);
    return () => { };
  }

  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where("ownerId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
    callback(projects);
  });
};

// 2. TẠO DỰ ÁN MỚI (Cập nhật để lưu Mô tả)
// Thêm tham số description vào cuối
export const addProject = async (name: string, startDate?: string, endDate?: string, description?: string) => {
  try {
    // --- CƠ CHẾ AN TOÀN (SAFE GUARDS) ---
    // Nếu thiếu ngày bắt đầu -> Lấy hôm nay
    const safeStart = startDate || new Date().toISOString().split('T')[0];

    // Nếu thiếu ngày kết thúc -> Lấy 7 ngày sau
    let safeEnd = endDate;
    if (!safeEnd) {
      const d = new Date(safeStart);
      d.setDate(d.getDate() + 7);
      safeEnd = d.toISOString().split('T')[0];
    }

    // Tính duration
    const start = new Date(safeStart);
    const end = new Date(safeEnd);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const duration = !isNaN(diffTime) ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 1;

    // Lưu vào Firebase
    const currentUser = auth.currentUser;
    const ownerId = currentUser ? currentUser.uid : 'guest';

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      name,
      description: description || '',
      startDate: safeStart,
      endDate: safeEnd,
      duration,
      createdAt: serverTimestamp(),
      userId: ownerId, // Legacy field
      ownerId: ownerId  // NEW Standard field
    });

    return docRef.id;

  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

// 3. CẬP NHẬT TÊN VÀ MÔ TẢ DỰ ÁN
export const updateProject = async (id: string, name: string, description?: string) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    const updateData: any = { name };
    if (description !== undefined) {
      updateData.description = description;
    }
    await updateDoc(projectRef, updateData);
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

// 4. XÓA DỰ ÁN (Xóa cả tasks bên trong)
export const deleteProject = async (projectId: string) => {
  try {
    // Lấy tất cả task của dự án
    const tasksQuery = query(collection(db, TASKS_COLLECTION), where("projectId", "==", projectId));
    const tasksSnapshot = await getDocs(tasksQuery);

    const batch = writeBatch(db);

    // Xếp lệnh xóa tasks
    tasksSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Xếp lệnh xóa project
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    batch.delete(projectRef);

    await batch.commit();

  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};