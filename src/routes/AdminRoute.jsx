import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { Loading } from "../components/LoadingStates/LoadingStates";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) {
    return <Loading text="Verifying admin access..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-error mb-2">Access Denied</h2>
          <p className="text-base-content/70">Please login to continue</p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-error mb-2">Admin Access Required</h2>
          <p className="text-base-content/70">
            You don't have permission to access this area
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;