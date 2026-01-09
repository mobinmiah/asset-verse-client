import React from "react";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  loading = false 
}) => {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    success: "text-success border-success/20 bg-success/5",
    warning: "text-warning border-warning/20 bg-warning/5",
    error: "text-error border-error/20 bg-error/5",
    info: "text-info border-info/20 bg-info/5"
  };

  if (loading) {
    return (
      <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 sm:h-4 bg-base-300 rounded w-3/4"></div>
            <div className="h-6 sm:h-8 bg-base-300 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-base-300 rounded-full ml-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:scale-105 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-base-content/70 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-base-content mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-warning'
            }`}>
              <span className="mr-1 text-xs">
                {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
              </span>
              <span className="truncate">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} ml-2 flex-shrink-0`}>
          <span className="text-lg sm:text-xl lg:text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;