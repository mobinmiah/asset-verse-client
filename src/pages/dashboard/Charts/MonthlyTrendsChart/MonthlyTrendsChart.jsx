import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";

const MonthlyTrendsChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: trendsData = [], isLoading } = useQuery({
    queryKey: ["monthly-trends"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics/monthly-trends");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow h-64 sm:h-72 lg:h-80 w-full">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4 text-center text-primary">
        Monthly Trends Overview
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trendsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" />
          <XAxis 
            dataKey="month" 
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
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="var(--color-primary)" 
            strokeWidth={2}
            name="Requests"
            dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="approvals" 
            stroke="var(--color-success)" 
            strokeWidth={2}
            name="Approvals"
            dot={{ fill: "var(--color-success)", strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="assets" 
            stroke="var(--color-info)" 
            strokeWidth={2}
            name="Total Assets"
            dot={{ fill: "var(--color-info)", strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsChart;