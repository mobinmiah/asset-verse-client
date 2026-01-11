import React from "react";

const SkeletonLoader = ({ 
  width = "100%", 
  height = "20px", 
  className = "", 
  count = 1,
  type = "text" 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton rounded-md ${className}`}
      style={{ 
        width, 
        height: type === "avatar" ? width : height,
        borderRadius: type === "avatar" ? "50%" : "6px"
      }}
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return (
    <div className="space-y-3">
      {skeletons}
    </div>
  );
};

// Pre-built skeleton components for common use cases
export const CardSkeleton = () => (
  <div className="card bg-base-100 shadow-sm p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <SkeletonLoader type="avatar" width="48px" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader width="60%" height="16px" />
        <SkeletonLoader width="40%" height="14px" />
      </div>
    </div>
    <SkeletonLoader count={3} height="12px" />
    <div className="flex space-x-2">
      <SkeletonLoader width="80px" height="32px" />
      <SkeletonLoader width="80px" height="32px" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <>
    <div className="md:hidden space-y-4">
      {Array.from({ length: rows }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <div className="hidden md:block overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i}>
                <SkeletonLoader width="80%" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex}>
                  <SkeletonLoader width="90%" height="14px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm p-4">
          <SkeletonLoader width="100%" height="60px" />
          <div className="mt-4 space-y-2">
            <SkeletonLoader width="70%" height="16px" />
            <SkeletonLoader width="50%" height="14px" />
          </div>
        </div>
      ))}
    </div>
    <CardSkeleton />
    <TableSkeleton />
  </div>
);

export default SkeletonLoader;