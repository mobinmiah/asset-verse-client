import React from 'react';

// Main Loading Spinner
export const Loading = ({ size = "lg", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md", 
    lg: "loading-lg",
    xl: "loading-lg scale-150"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <span className={`loading loading-spinner text-primary ${sizeClasses[size]}`}></span>
      {text && (
        <p className="mt-4 text-base-content/70 text-sm sm:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Page Loading (Full Screen)
export const PageLoading = ({ text = "Loading page..." }) => (
  <div className="fixed inset-0 bg-base-200 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">⚡</div>
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-base-content/70 text-lg font-medium">
        {text}
      </p>
    </div>
  </div>
);

// Card Skeleton
export const CardSkeleton = ({ count = 1 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="card bg-base-100 shadow-sm animate-pulse">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-base-300 h-12 w-12"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
              <div className="h-3 bg-base-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-base-300 rounded"></div>
            <div className="h-3 bg-base-300 rounded w-5/6"></div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="h-8 bg-base-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <>
    <div className="md:hidden">
      <CardSkeleton count={rows} />
    </div>
    <div className="hidden md:block overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i}>
                <div className="h-4 bg-base-300 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(cols)].map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// Stats Card Skeleton
export const StatsSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="card bg-base-100 shadow-sm animate-pulse">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-base-300 rounded w-3/4"></div>
              <div className="h-6 bg-base-300 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-base-300 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ height = "300px" }) => (
  <div className="card bg-base-100 shadow-sm animate-pulse">
    <div className="card-body">
      <div className="h-6 bg-base-300 rounded w-1/3 mb-4"></div>
      <div 
        className="bg-base-300 rounded"
        style={{ height }}
      ></div>
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="card bg-base-100 shadow-sm animate-pulse">
    <div className="card-body space-y-4">
      <div className="h-8 bg-base-300 rounded w-1/2"></div>
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-base-300 rounded w-1/4"></div>
          <div className="h-10 bg-base-300 rounded"></div>
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-6">
        <div className="h-10 bg-base-300 rounded w-20"></div>
        <div className="h-10 bg-base-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Button Loading State
export const ButtonLoading = ({ children, loading = false, ...props }) => (
  <button {...props} disabled={loading || props.disabled}>
    {loading ? (
      <span className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
        Loading...
      </span>
    ) : (
      children
    )}
  </button>
);

// Inline Loading
export const InlineLoading = ({ text = "Loading..." }) => (
  <div className="flex items-center gap-2 text-base-content/70">
    <span className="loading loading-spinner loading-sm"></span>
    <span className="text-sm">{text}</span>
  </div>
);

export default Loading;