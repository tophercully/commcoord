import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app } from "../../../firebaseConfig";

const auth = getAuth(app);

export const authAPI = {
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
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
};
