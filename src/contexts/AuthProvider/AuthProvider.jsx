import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { AuthContext } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const registerUser = async (email, password) => {
    setLoading(true);

    const result = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(result.user);

    if (!result.user.emailVerified) {
      return toast.error("Please verify your email.");
    }
    return result;
  };

  const loginUser = async (email, password) => {
    setLoading(true);

    const result = await signInWithEmailAndPassword(auth, email, password);

    return result;
  };

  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  const LogOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    registerUser,
    loginUser,
    googleLogin,
    LogOut,
    updateUserProfile,
    sendEmailVerification,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
