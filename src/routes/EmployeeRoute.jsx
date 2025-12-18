import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/Loading/Loading";

const HrRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (role !== "employee") {
    return <p>forbidden</p>;
  }
  return children;
};

export default HrRoute;
