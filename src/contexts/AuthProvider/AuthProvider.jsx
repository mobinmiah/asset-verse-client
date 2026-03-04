import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { AuthContext } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

// Demo accounts that bypass email verification
const DEMO_EMAILS = [
  "admin@assetverse.com",
  "mdmobinmiah1998@gmail.com",
  "employee@assetverse.com"
];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const registerUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await firebaseSendEmailVerification(result.user);
      
      toast.info("Verification email sent! Please check your inbox.");
      
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified (skip for demo accounts)
      if (!DEMO_EMAILS.includes(email.toLowerCase()) && !result.user.emailVerified) {
        await signOut(auth);
        setLoading(false);
        throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
      }
      
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google accounts are pre-verified
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const LogOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await firebaseSendEmailVerification(auth.currentUser);
      toast.success("Verification email sent! Please check your inbox.");
    }
  };

  const isEmailVerified = () => {
    if (!user) return false;
    // Demo accounts are always considered verified
    if (DEMO_EMAILS.includes(user.email?.toLowerCase())) return true;
    // Google accounts are pre-verified
    if (user.providerData?.some(provider => provider.providerId === 'google.com')) return true;
    return user.emailVerified;
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setAuthInitialized(true);
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    authInitialized,
    registerUser,
    loginUser,
    googleLogin,
    LogOut,
    updateUserProfile,
    resendVerificationEmail,
    isEmailVerified,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
