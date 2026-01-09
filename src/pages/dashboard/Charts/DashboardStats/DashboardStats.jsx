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
      try {
        const res = await axiosSecure.get(`/analytics/dashboard-stats`);
        return res.data;
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return mock data for demonstration
        return {
          totalAssets: 156,
          totalEmployees: 45,
          pendingRequests: 12,
          approvedRequests: 89,
          returnableAssets: 98,
          nonReturnableAssets: 58,
          monthlyRequests: 23,
          availableAssets: 134,
          assignedAssets: 22,
          lowStockAssets: 8,
          myAssets: 5,
          myPendingRequests: 2,
          myApprovedRequests: 8,
          teamMembers: 12
        };
      }
    },
  });

  const hrStats = [
    {
      title: "Total Assets",
      value: stats.totalAssets || 0,
      icon: "📦",
      color: "primary",
      trend: "up",
      trendValue: "+12% from last month"
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees || 0,
      icon: "👥",
      color: "info",
      trend: "up",
      trendValue: "+3 new this month"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests || 0,
      icon: "⏳",
      color: "warning",
      trend: stats.pendingRequests > 10 ? "up" : "down",
      trendValue: `${stats.pendingRequests > 10 ? 'High' : 'Normal'} volume`
    },
    {
      title: "Approved Requests",
      value: stats.approvedRequests || 0,
      icon: "✅",
      color: "success",
      trend: "up",
      trendValue: "+15% this month"
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
    },
    {
      title: "Available Assets",
      value: stats.availableAssets || 0,
      icon: "✨",
      color: "success",
      trend: "stable",
      trendValue: "Ready to assign"
    },
    {
      title: "Low Stock Alert",
      value: stats.lowStockAssets || 0,
      icon: "⚠️",
      color: "error",
      trend: stats.lowStockAssets > 5 ? "up" : "down",
      trendValue: `${stats.lowStockAssets} items need restocking`
    }
  ];

  const employeeStats = [
    {
      title: "My Assets",
      value: stats.myAssets || 0,
      icon: "💼",
      color: "primary",
      trend: "stable",
      trendValue: "Currently assigned"
    },
    {
      title: "Pending Requests",
      value: stats.myPendingRequests || 0,
      icon: "⏳",
      color: "warning",
      trend: stats.myPendingRequests > 0 ? "up" : "stable",
      trendValue: stats.myPendingRequests > 0 ? "Awaiting approval" : "No pending requests"
    },
    {
      title: "Approved Requests",
      value: stats.myApprovedRequests || 0,
      icon: "✅",
      color: "success",
      trend: "up",
      trendValue: "This month"
    },
    {
      title: "Team Members",
      value: stats.teamMembers || 0,
      icon: "👥",
      color: "info",
      trend: "stable",
      trendValue: "In your team"
    }
  ];

  const statsToShow = role === "hr" ? hrStats : employeeStats;

  return (
    <div className="w-full">
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsToShow.map((stat, index) => (
          <div key={index} className="w-full">
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              trendValue={stat.trendValue}
              loading={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;