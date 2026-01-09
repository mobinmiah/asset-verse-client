import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";

const AssetStatusChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: statusData = [], isLoading } = useQuery({
    queryKey: ["asset-status"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/analytics/asset-status");
        return res.data;
      } catch (error) {
        console.error("Error fetching asset status:", error);
        // Mock data for demonstration
        return [
          { status: "Available", count: 85, percentage: 55 },
          { status: "Assigned", count: 45, percentage: 29 },
          { status: "Maintenance", count: 15, percentage: 10 },
          { status: "Retired", count: 10, percentage: 6 }
        ];
      }
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow h-64 sm:h-72 lg:h-80 w-full">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4 text-center text-primary">
        Asset Status Distribution
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={statusData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" />
          <XAxis 
            dataKey="status" 
            tick={{ fontSize: 10, fill: "var(--color-neutral)" }}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "var(--color-neutral)" }}
            width={30}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "var(--color-base-100)",
              border: "1px solid var(--color-primary)",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            formatter={(value, name) => [value, name === 'count' ? 'Assets' : 'Percentage']}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="var(--color-primary)" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetStatusChart;