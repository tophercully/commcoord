import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app, rtdb } from "../../../firebaseConfig";
import { ref, set, get } from "firebase/database";
import { UserProfile } from "@/types/users";

const auth = getAuth(app);

export const authAPI = {
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await authAPI.updateUserProfile(userCredential.user.uid, {
        displayName: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        email: userCredential.user.email as string,
      });
      return userCredential.user;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      return { message: "User signed in successfully", user };
    } catch (error: any) {
      console.error("Signin error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
  logOut: async () => {
    try {
      await signOut(auth);
      return { message: "User signed out successfully" };
    } catch (error: any) {
      console.error("Signout error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
  updateUserProfile: async (userId: string, userInfo: Partial<UserProfile>) => {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      await set(userRef, userInfo);
      return { message: "User info updated successfully" };
    } catch (error: any) {
      console.error("Update user error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      const userRef = ref(rtdb, `users/${userId}`);
      const snapshot = await get(userRef);
      return snapshot.val();
    } catch (error: any) {
      console.error("Get user error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
};
