import { auth, db, app } from '../firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { User } from '../types';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');

// Map Firebase User to our App User (cơ bản)
const mapUser = (firebaseUser: FirebaseUser, role: 'admin' | 'member', additionalData: any = {}): User => {
    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'No Name',
        email: firebaseUser.email || 'no-email@test.com',
        avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/200',
        role: role,
        ...additionalData
    };
};

export const loginWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, provider);

        // --- NEW: Save Access Token for Google Calendar ---
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        if (token) {
            localStorage.setItem('google_access_token', token);
        }
        // --------------------------------------------------

        const firebaseUser = result.user;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData: User;

        if (userSnap.exists()) {
            // User cũ: Lấy data về (đặc biệt là role)
            const data = userSnap.data();
            // userData = mapUser(firebaseUser, data.role || 'member', data);
            userData = {
                id: firebaseUser.uid,
                name: data.name || firebaseUser.displayName || 'No Name',
                email: data.email || firebaseUser.email || 'no-email@test.com',
                avatarUrl: data.avatarUrl || firebaseUser.photoURL || 'https://picsum.photos/200',
                role: data.role || 'member',
                createdAt: data.createdAt,
                // Spread other existing data
                ...data
            } as User;
        } else {
            // User mới: Tạo bản ghi mới
            // LOGIC MỚI: Kiểm tra email admin
            const isAdminEmail = firebaseUser.email === 'danhnpcd@gmail.com';

            const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'No Name',
                email: firebaseUser.email || 'no-email@test.com',
                avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/200',
                role: isAdminEmail ? 'admin' : 'member', // Conditional role
                createdAt: serverTimestamp(),
                // Các trường optional khác
                skills: [],
                bio: '',
                department: '',
                location: '',
                phone: ''
            } as any;

            await setDoc(userRef, newUser);
            userData = newUser;
        }

        return userData;

    } catch (error: any) {
        console.error("Login failed:", error);

        // Bắt lỗi cấu hình cụ thể
        if (error.code === 'auth/configuration-not-found') {
            const projectId = app.options.projectId;
            console.error(`
🚨 [CRITICAL ERROR] CHƯA BẬT GOOGLE PROVIDER!
---------------------------------------------------
PROJECT ID HIỆN TẠI: ${projectId}
---------------------------------------------------
1. Vào Firebase Console (https://console.firebase.google.com/)
2. Kiểm tra xem bạn có đang ở đúng dự án "${projectId}" không?
3. Vào "Authentication" -> "Sign-in method"
4. Thêm "Google" -> Bật "Enable" -> Save.
---------------------------------------------------
            `);
            alert(`Lỗi cấu hình Server (Project: ${projectId}): Chưa bật Google Sign-In trên Firebase Console. Vui lòng check Console log.`);
        }

        throw error;
    }
};

export const logout = async () => {
    await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            return { id: uid, ...data } as User;
        }
        return null;
    } catch (error) {
        console.error("Get profile failed", error);
        return null;
    }
};

export const updateUserProfile = async (user: User) => {
    try {
        const userRef = doc(db, "users", user.id);
        await setDoc(userRef, user, { merge: true });
    } catch (error) {
        console.error("Update profile failed", error);
        throw error;
    }
}

// --- PASSWORD AUTH SUPPORT ---

const processEmail = (input: string): string => {
    if (input.includes('@')) return input;
    return `${input}@neurotask.local`;
};

export const registerWithPassword = async (name: string, emailOrUsername: string, password: string): Promise<User> => {
    try {
        const email = processEmail(emailOrUsername);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Update Display Name
        await updateProfile(firebaseUser, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        });

        // Create User in Firestore
        const newUser: User = {
            id: firebaseUser.uid,
            name: name,
            email: email,
            avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            role: 'member',
            createdAt: serverTimestamp(),
            skills: [],
            bio: '',
            department: '',
            location: '',
            phone: ''
        } as any;

        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        return newUser;

    } catch (error: any) {
        console.error("Register failed:", error);
        throw error;
    }
};

export const loginWithPassword = async (emailOrUsername: string, password: string): Promise<User> => {
    try {
        const email = processEmail(emailOrUsername);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Fetch user data
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: firebaseUser.uid, ...userSnap.data() } as User;
        } else {
            // Fallback if firestore doc missing (rare)
            return {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'No Name',
                email: email,
                avatarUrl: firebaseUser.photoURL || '',
                role: 'member'
            } as User;
        }
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};


// --- NEW for Demo Mode ---
export const getAccessTokenForSync = async (): Promise<string> => {
    try {
        // Create a specific provider instance for this action to enforce account selection
        const syncProvider = new GoogleAuthProvider();
        syncProvider.addScope('https://www.googleapis.com/auth/calendar.events');
        syncProvider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, syncProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (!token) {
            throw new Error("Không lấy được Access Token từ Google.");
        }

        return token;
    } catch (error) {
        console.error("Get Access Token failed:", error);
        throw error;
    }
};

