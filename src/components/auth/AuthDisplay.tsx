"use client";
import { useAuth } from "@/contexts/authContext";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import CreateUserProfileModal from "./CreateUserProfileModal";
import { useEffect, useState } from "react";

const AuthDisplay = () => {
  const {
    user,
    userInfo,
    toggleSignInModal,
    toggleSignUpModal,
    showSignIn,
    showSignUp,
    signOut,
  } = useAuth();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  console.log(userInfo?.displayName);

  useEffect(() => {
    if (user && !userInfo?.displayName) {
      setShowCreateProfile(true);
    }
  }, [user, userInfo]);

  return (
    <div className="w-full">
      {user ?
        <>
          <h1>Welcome {userInfo?.displayName}!</h1>
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

          <button onClick={toggleSignInModal}>Log in</button>
          <button onClick={toggleSignUpModal}>Sign up</button>
        </>
      }
    </div>
  );
};

export default AuthDisplay;
