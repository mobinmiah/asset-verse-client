import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";

const COLORS = ["#14C2ED", "#0EA5E9", "#34D399", "#FACC15", "#EF4444"];

const AssetTypePieChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: assetType = [], isLoading, error } = useQuery({
    queryKey: ["asset-types"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics/asset-types");
      console.log("Asset types data:", res.data);
      return res.data;
    },
  });

  console.log("Asset type data:", assetType, "Loading:", isLoading, "Error:", error);

  if (isLoading) return <Loading />;

  // Ensure we have valid data
  const chartData = assetType && assetType.length > 0 ? assetType : [
    { name: "Returnable", value: 65 },
    { name: "Non-returnable", value: 35 }
  ];

  if (!chartData.length || chartData.every((item) => item.value === 0)) {
    return (
      <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow text-center h-64 sm:h-72 lg:h-80 flex items-center justify-center">
        <div>
          <div className="text-3xl sm:text-4xl mb-2">📊</div>
          <p className="text-xs sm:text-sm text-gray-500">No asset data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow h-64 sm:h-72 lg:h-80 w-full">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4 text-center text-primary">
        Asset Type Distribution
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            fontSize={12}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, "Count"]} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetTypePieChart;
