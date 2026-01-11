import React from "react";
import useRole from "../../../hooks/useRole";
import HRDashboard from "./HRDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";
import Loading from "../../../components/Loading/Loading";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  }
  if (role === "hr") {
    return <HRDashboard></HRDashboard>;
  }
  if (role === "employee") {
    return <EmployeeDashboard></EmployeeDashboard>;
  }

  // Fallback for unknown roles
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-base-content/70 mb-2">
          Access Denied
        </h3>
        <p className="text-base-content/50">
          Your role ({role || 'unknown'}) doesn't have dashboard access.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
