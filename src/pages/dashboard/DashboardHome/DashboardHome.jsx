import React from "react";
import useRole from "../../../hooks/useRole";
import HRDashboard from "./HRDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import Loading from "../../../components/Loading/Loading";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  if (role === "hr") {
    return <HRDashboard></HRDashboard>;
  }
  if (role === "employee") {
    return <EmployeeDashboard></EmployeeDashboard>;
  }
};

export default DashboardHome;
