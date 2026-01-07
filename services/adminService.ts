import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { User } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                id: doc.id,
                ...data,
                // Ensure role is valid, default to member if missing
                role: data.role === 'admin' ? 'admin' : 'member'
            } as User);
        });
        return users;
    } catch (error) {
        console.error("Error getting users:", error);
        throw error;
    }
};

export const updateUserRole = async (userId: string, newRole: 'admin' | 'member') => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};
