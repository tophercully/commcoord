import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app, db } from "../../../firebaseConfig";
import { UserProfile } from "@/types/users";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, userInfo, { merge: true });
      return { message: "User info updated successfully" };
    } catch (error: any) {
      console.error("Update user error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.error("Get user error:", error);
      throw new Error(error.message || "Internal Server Error");
    }
  },
};
