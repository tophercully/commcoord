"use client";
import { useAuth } from "@/contexts/authContext";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import CreateUserProfileModal from "./CreateUserProfileModal";
import { useEffect, useState } from "react";

const AuthDisplay = () => {
  const {
    user,
    toggleSignInModal,
    toggleSignUpModal,
    showSignIn,
    showSignUp,
    signOut,
  } = useAuth();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  console.log(user?.displayName);

  useEffect(() => {
    if (user && !user?.displayName) {
      setShowCreateProfile(true);
    }
  }, [user]);

  return (
    <div className="flex w-full gap-2">
      {user ?
        <>
          <h1>Welcome {user?.displayName}!</h1>
          <button onClick={signOut}>Log out</button>
          <CreateUserProfileModal
            open={showCreateProfile}
            onClose={() => {
              setShowCreateProfile(false);
            }}
          />
        </>
      : <>
          <SignInModal
            open={showSignIn}
            onClose={toggleSignInModal}
            onPressSignUp={() => {
              toggleSignInModal();
              toggleSignUpModal();
            }}
          />
          <SignUpModal
            open={showSignUp}
            onClose={toggleSignUpModal}
            onPressSignIn={() => {
              toggleSignUpModal();
              toggleSignInModal();
            }}
          />

          <button
            onClick={toggleSignUpModal}
            className="rounded-lg bg-base-950 px-2 py-1 text-base-50 hover:bg-base-700"
          >
            Sign up
          </button>
          <button
            onClick={toggleSignInModal}
            className="rounded-lg px-2 py-1 hover:underline"
          >
            Log in
          </button>
        </>
      }
    </div>
  );
};

export default AuthDisplay;
