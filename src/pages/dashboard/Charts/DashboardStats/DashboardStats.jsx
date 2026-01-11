import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import StatCard from "../../../../components/StatCard/StatCard";
import useRole from "../../../../hooks/useRole";

const DashboardStats = () => {
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();

  // Fetch dashboard statistics
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["dashboard-stats", role],
    queryFn: async () => {
      const res = await axiosSecure.get(`/analytics/dashboard-stats`);
      return res.data;
    },
  });

  const hrStats = [
    {
      title: "Total Assets",
      value: stats.totalAssets || 0,
      icon: "📦",
      color: "primary"
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees || 0,
      icon: "👥",
      color: "info"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests || 0,
      icon: "⏳",
      color: "warning"
    },
    {
      title: "Approved Requests",
      value: stats.approvedRequests || 0,
      icon: "✅",
      color: "success"
    },
    {
      title: "Returnable Assets",
      value: stats.returnableAssets || 0,
      icon: "🔄",
      color: "primary"
    },
    {
      title: "Non-Returnable",
      value: stats.nonReturnableAssets || 0,
      icon: "📋",
      color: "info"
    }
  ];

  const employeeStats = [
    {
      title: "My Assets",
      value: stats.myAssets || 0,
      icon: "💼",
      color: "primary"
    },
    {
      title: "Pending Requests",
      value: stats.myPendingRequests || 0,
      icon: "⏳",
      color: "warning"
    },
    {
      title: "Approved Requests",
      value: stats.myApprovedRequests || 0,
      icon: "✅",
      color: "success"
    }
  ];

  const statsToShow = role === "hr" ? hrStats : employeeStats;

  return (
    <div className="w-full">
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statsToShow.map((stat, index) => (
          <div key={index} className="w-full">
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;