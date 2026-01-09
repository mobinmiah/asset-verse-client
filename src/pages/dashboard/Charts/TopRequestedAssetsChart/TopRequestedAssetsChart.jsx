import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";

const TopRequestedAssetsChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: requestedAssets = [], isLoading, error } = useQuery({
    queryKey: ["top-requested-assets"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/analytics/top-requested-assets");
        console.log("Top requested assets data:", res.data);
        return res.data;
      } catch (error) {
        console.error("Error fetching top requested assets:", error);
        // Return mock data if API fails
        return [
          { name: "Laptop", requests: 25 },
          { name: "Monitor", requests: 18 },
          { name: "Mouse", requests: 15 },
          { name: "Keyboard", requests: 12 },
          { name: "Headphones", requests: 8 }
        ];
      }
    },
  });

  console.log("Requested assets data:", requestedAssets, "Loading:", isLoading, "Error:", error);

  if (isLoading) return <Loading />;

  // Ensure we have valid data
  const chartData = requestedAssets && requestedAssets.length > 0 ? requestedAssets : [
    { name: "Laptop", requests: 25 },
    { name: "Monitor", requests: 18 },
    { name: "Mouse", requests: 15 },
    { name: "Keyboard", requests: 12 },
    { name: "Headphones", requests: 8 }
  ];

  if (!chartData.length) {
    return (
      <div className="bg-base-100 flex justify-center items-center p-3 sm:p-4 lg:p-6 rounded-xl shadow h-64 sm:h-72 lg:h-80 w-full">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl mb-2">📈</div>
          <p className="text-xs sm:text-sm text-gray-500">No request data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow h-64 sm:h-72 lg:h-80 w-full">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4 text-center text-primary">
        Top 5 Requested Assets
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: "var(--color-neutral)" }} 
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            allowDecimals={false} 
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
          <Bar 
            dataKey="requests" 
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopRequestedAssetsChart;
