import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Task } from "../types";

const TASKS_COLLECTION = "tasks";

import { auth } from "../firebase"; // Import Auth

export const subscribeToTasks = (projectId: string, callback: (tasks: Task[]) => void) => {
  if (!projectId) return () => { };

  // Note: We assume projectId check is enough, but strictly we could check ownerId too if we passed userId here
  const q = query(
    collection(db, TASKS_COLLECTION),
    where("projectId", "==", projectId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
    callback(tasks);
  });
};

// NEW: Subscribe to ALL tasks (Global View) - NOW FILTERED BY USER
export const subscribeToAllTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  if (!userId) {
    callback([]);
    return () => { };
  }

  const q = query(
    collection(db, TASKS_COLLECTION),
    where("ownerId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
    callback(tasks);
  });
};

export const addTask = async (task: Omit<Task, "id">) => {
  try {
    const currentUser = auth.currentUser;
    const ownerId = currentUser ? currentUser.uid : 'guest';

    await addDoc(collection(db, TASKS_COLLECTION), {
      ...task,
      ownerId: ownerId, // Save Owner
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  try {
    // Partial<Task> đã bao gồm description
    const taskRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskRef, data);
  } catch (error) {
    console.error("Error updating task: ", error);
    throw error;
  }
};

export const toggleTaskStatus = async (taskId: string, currentStatus: Task['status']) => {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, { status: newStatus });
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}