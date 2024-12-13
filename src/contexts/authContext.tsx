"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getAuth, User, UserInfo, updateProfile } from "firebase/auth";
import { api } from "@/util/API/firebaseAPI";
import { app } from "../../firebaseConfig";
const auth = getAuth(app);

interface AuthContextProps {
  user: User | null;
  userInfo: UserInfo | null;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  showSignIn: boolean;
  showSignUp: boolean;
  toggleSignInModal: () => void;
  toggleSignUpModal: () => void;
  authInitializing: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [authInitializing, setAuthInitializing] = useState(true); // Initialize to true
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserInfo(parsedUser.providerData[0]);
      }
    }
    setAuthInitializing(false); // Set to false after checking localStorage
  }, []);

  const signUpUser = async (email: string, password: string) => {
    try {
      const newUser = await api.auth.signUp(email, password);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setShowSignUp(false);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      const loggedInUser = await api.auth.signIn(email, password);
      if (loggedInUser.user) {
        setUser(loggedInUser.user);
        setUserInfo(loggedInUser.user.providerData[0]);
        localStorage.setItem("user", JSON.stringify(loggedInUser.user));
      } else {
        console.error("Error signing in:", loggedInUser);
      }
      setShowSignIn(false);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await api.auth.logOut();
      setUser(null);
      setUserInfo(null);
      localStorage.removeItem("user");
      setShowSignIn(false);
      setShowSignUp(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const toggleSignInModal = () => {
    setShowSignIn(!showSignIn);
    setShowSignUp(false);
  };

  const toggleSignUpModal = () => {
    setShowSignUp(!showSignUp);
    setShowSignIn(false);
  };

  const refetchUserProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        const updatedUser = auth.currentUser;
        if (updatedUser) {
          setUser(updatedUser);
          setUserInfo(updatedUser.providerData[0]);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error refetching user profile:", error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName, photoURL });
        await refetchUserProfile();
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userInfo,
        updateUserProfile,
        signUp: signUpUser,
        signIn: signInUser,
        signOut: signOutUser,
        showSignIn,
        showSignUp,
        toggleSignInModal,
        toggleSignUpModal,
        authInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
