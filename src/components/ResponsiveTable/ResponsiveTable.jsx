import React, { useState } from "react";

// Loading skeleton component defined outside render
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-base-100 p-4 rounded-lg animate-pulse">
        <div className="flex space-x-4">
          <div className="h-4 bg-base-300 rounded w-1/4"></div>
          <div className="h-4 bg-base-300 rounded w-1/3"></div>
          <div className="h-4 bg-base-300 rounded w-1/4"></div>
          <div className="h-4 bg-base-300 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const ResponsiveTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = false,
  sortable = false,
  pagination = false,
  itemsPerPage = 10,
  emptyMessage = "No data available",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchable
    ? data.filter((item) =>
        columns.some((column) => {
          const value = column.accessor ? item[column.accessor] : "";
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData =
    sortable && sortConfig.key
      ? [...filteredData].sort((a, b) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        })
      : filteredData;

  // Paginate data
  const totalPages = pagination
    ? Math.ceil(sortedData.length / itemsPerPage)
    : 1;
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = pagination ? startIndex + itemsPerPage : sortedData.length;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="mb-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full sm:max-w-xs pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Desktop Table - ONLY show on large screens (lg and above) */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto border border-base-300 rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`${
                      sortable && column.sortable
                        ? "cursor-pointer hover:bg-base-200"
                        : ""
                    } px-4 py-3`}
                    onClick={() =>
                      column.sortable && handleSort(column.accessor)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {sortable &&
                        column.sortable &&
                        sortConfig.key === column.accessor && (
                          <span className="text-primary">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <div className="text-base-content/60">
                      <div className="text-4xl mb-2">📄</div>
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-base-200/50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        {column.render
                          ? column.render(item, rowIndex)
                          : item[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Cards - Show on ALL small/medium devices */}
      <div className="lg:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-base-content/60">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-sm">{emptyMessage}</div>
            </div>
          </div>
        ) : (
          paginatedData.map((item, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow duration-200"
            >
              <div className="card-body p-3 sm:p-4 space-y-3">
                {/* Show ALL fields in cards */}
                {columns.map((column, colIndex) => {
                  // Skip rendering the actions column in the loop, we'll add it at the end
                  if (
                    column.accessor === "actions" ||
                    column.header.toLowerCase().includes("action")
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`${
                        colIndex === 0
                          ? "border-b border-base-300 pb-3 mb-1"
                          : ""
                      }`}
                    >
                      {colIndex === 0 ? (
                        // First field as prominent title
                        <div className="font-bold text-base sm:text-lg text-primary">
                          {column.render
                            ? column.render(item, index)
                            : item[column.accessor]}
                        </div>
                      ) : (
                        // Other fields as key-value pairs
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 text-sm">
                          <span className="font-semibold text-base-content/80 min-w-0 shrink-0">
                            {column.header}:
                          </span>
                          <span className="sm:text-right min-w-0 sm:flex-1">
                            {column.render
                              ? column.render(item, index)
                              : item[column.accessor]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Show actions at the bottom if available */}
                {columns.find(
                  (col) =>
                    col.accessor === "actions" ||
                    col.header.toLowerCase().includes("action")
                ) && (
                  <div className="pt-3 border-t border-base-300 mt-2">
                    {(() => {
                      const actionColumn = columns.find(
                        (col) =>
                          col.accessor === "actions" ||
                          col.header.toLowerCase().includes("action")
                      );
                      return actionColumn?.render
                        ? actionColumn.render(item, index)
                        : null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Responsive Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          {/* Results Info */}
          <div className="text-xs sm:text-sm text-base-content/60 order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)}{" "}
            of {sortedData.length} results
          </div>

          {/* Pagination Controls */}
          <div className="join order-1 sm:order-2">
            <button
              className="join-item btn btn-sm min-h-10"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden text-lg">‹</span>
            </button>

            {/* Show fewer pages on mobile */}
            {(() => {
              const maxVisible = window.innerWidth < 640 ? 3 : 5;
              const startPage = Math.max(
                1,
                Math.min(
                  totalPages - maxVisible + 1,
                  currentPage - Math.floor(maxVisible / 2)
                )
              );

              return [...Array(Math.min(maxVisible, totalPages))].map(
                (_, index) => {
                  const pageNumber = startPage + index;
                  if (pageNumber > totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      className={`join-item btn btn-sm min-h-10 min-w-10 ${
                        currentPage === pageNumber ? "btn-primary" : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              );
            })()}

            <button
              className="join-item btn btn-sm min-h-10"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;
