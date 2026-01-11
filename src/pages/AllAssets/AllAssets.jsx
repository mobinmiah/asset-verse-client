import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";

const AllAssets = () => {
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Assets per page

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {}, [statusFilter, typeFilter]);

  // Fetch assets with server-side filtering and pagination
  const {
    data: assetsData = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "all-assets",
      role,
      debouncedSearchTerm,
      statusFilter,
      typeFilter,
      page,
      limit,
    ],
    enabled: !roleLoading && !!role,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add search term if provided
      if (debouncedSearchTerm.trim()) {
        params.append("searchText", debouncedSearchTerm.trim());
      }

      // Add status filter (convert to backend format)
      if (statusFilter !== "all") {
        if (statusFilter === "available") {
          params.append("status", "available");
        } else if (statusFilter === "unavailable") {
          params.append("status", "unavailable");
        }
      }

      // Add type filter
      if (typeFilter !== "all") {
        params.append("type", typeFilter);
      }

      const res = await axiosSecure.get(`/assets?${params.toString()}`);
      return res.data;
    },
  });

  // Handle different response formats based on role
  const assets =
    role === "admin"
      ? assetsData.assets || []
      : assetsData.assets || Array.isArray(assetsData)
      ? assetsData
      : [];

  const totalAssetsCount =
    role === "admin"
      ? assetsData.total || assets.length
      : assetsData.total || assets.length;

  const totalPages =
    role === "admin" ? assetsData.totalPages || 1 : assetsData.totalPages || 1;

  // Asset Card Component
  const AssetCard = ({ asset }) => (
    <div className="card h-full bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image */}
      <figure className="px-4 pt-4">
        <div className="w-full h-48 overflow-hidden rounded-xl">
          <img
            src={asset.productImage}
            alt={asset.productName}
            className="w-full h-full"
          />
        </div>
      </figure>

      {/* Body */}
      <div className="card-body p-4 flex flex-col flex-1">
        <h2 className="card-title text-lg font-bold line-clamp-2 min-h-12">
          {asset.productName}
        </h2>

        <div>
          <span
            className={`badge badge-sm ${
              asset.productType === "Returnable"
                ? "badge-success"
                : "badge-info"
            }`}
          >
            {asset.productType}
          </span>
        </div>

        {/* Content grows */}
        <div className="text-sm text-base-content/70 space-y-1 flex-1 mt-2">
          <div className="space-y-3">
            {" "}
            <div>
              <strong>Company:</strong> {asset.companyName}
            </div>
            <div className="flex justify-between items-center gap-2">
              <strong>HR:</strong>
              <span className="truncate">{asset.hrEmail}</span>
            </div>
            <div>
              <strong>Added:</strong>{" "}
              {new Date(asset.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>Brand:</strong> {asset.brand}
            </div>
          </div>
        </div>

        {/* Button always at bottom */}
        <div className="pt-4 flex justify-end">
          <Link to={`/asset/${asset._id}`} className="btn btn-primary">
            Full Details
          </Link>
        </div>
      </div>
    </div>
  );

  if (roleLoading || isLoading) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">
              {roleLoading ? "Checking permissions..." : "Loading assets..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-error mb-2">
            Error Loading Assets
          </h3>
          <p className="text-base-content/50 mb-4">
            {error.message || "Failed to load assets. Please try again."}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>All Assets - AssetVerse | Browse Available Assets</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {role === "admin" ? "All Assets" : "My Organization Assets"}
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            {role === "admin"
              ? `All assets across all organizations (${totalAssetsCount} total)`
              : `Assets in your organization (${totalAssetsCount} total)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={() => window.location.reload()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Search Assets</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  role === "admin"
                    ? "Search by name, company, or HR..."
                    : "Search by name or type..."
                }
                className="input pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="loading loading-spinner loading-xs"></span>
                </div>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filter by Status</span>
            </label>
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Out of Stock</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filter by Type</span>
            </label>
            <select
              className="select outline-primary"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-base-content/70">
              Active filters:
            </span>
            {searchTerm && (
              <div className="badge badge-primary gap-1">
                Search: "{searchTerm}"
                <button
                  className="btn btn-ghost btn-xs p-0 w-4 h-4"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              </div>
            )}
            {statusFilter !== "all" && (
              <div className="badge badge-secondary gap-1">
                Status: {statusFilter}
                <button
                  className="btn btn-ghost btn-xs p-0 w-4 h-4"
                  onClick={() => setStatusFilter("all")}
                >
                  ✕
                </button>
              </div>
            )}
            {typeFilter !== "all" && (
              <div className="badge badge-accent gap-1">
                Type: {typeFilter}
                <button
                  className="btn btn-ghost btn-xs p-0 w-4 h-4"
                  onClick={() => setTypeFilter("all")}
                >
                  ✕
                </button>
              </div>
            )}
            <button
              className="btn btn-outline btn-primary btn-xs"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Search Results Info */}
        {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
          <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
            <p className="text-sm text-info">
              {assets.length === 0
                ? "No assets match your current filters"
                : `Found ${assets.length} asset${
                    assets.length !== 1 ? "s" : ""
                  } matching your filters`}
              {totalPages > 1 && ` (page ${page} of ${totalPages})`}
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300 p-4">
          <div className="stat-title text-sm">Total Assets</div>
          <div className="stat-value text-2xl text-primary">
            {totalAssetsCount}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300 p-4">
          <div className="stat-title text-sm">Returnable</div>
          <div className="stat-value text-2xl text-success">
            {assets.filter((a) => a.productType === "Returnable").length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300 p-4">
          <div className="stat-title text-sm">Non-returnable</div>
          <div className="stat-value text-2xl text-info">
            {assets.filter((a) => a.productType === "Non-returnable").length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl shadow-sm border border-base-300 p-4">
          <div className="stat-title text-sm">Showing</div>
          <div className="stat-value text-2xl text-info">{assets.length}</div>
        </div>
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-base-content/70 mb-2">
            No Assets Found
          </h3>
          <p className="text-base-content/50">
            {totalAssetsCount === 0
              ? role === "admin"
                ? "No assets have been added to the system yet"
                : "No assets have been added to your organization yet"
              : "Try adjusting your search criteria or filters"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (page <= 3) {
                    pageNum = index + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = page - 2 + index;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-sm ${
                        page === pageNum ? "btn-primary" : "btn-outline"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-outline btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}

          {/* Page Info */}
          <div className="text-center text-sm text-base-content/70 mt-4">
            Showing page {page} of {totalPages} ({totalAssetsCount} total
            assets)
          </div>
        </>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-primary">Asset Details</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedAsset(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Image */}
              <div className="space-y-4">
                <img
                  src={selectedAsset.productImage}
                  alt={selectedAsset.productName}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`badge ${
                      selectedAsset.productType === "Returnable"
                        ? "badge-success"
                        : "badge-info"
                    }`}
                  >
                    {selectedAsset.productType}
                  </span>
                  <span
                    className={`badge ${
                      selectedAsset.productQuantity > 0
                        ? "badge-info"
                        : "badge-error"
                    }`}
                  >
                    {selectedAsset.productQuantity > 0
                      ? `${selectedAsset.productQuantity} Available`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Asset Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">
                    Asset Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedAsset.productName}
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedAsset.productType}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {selectedAsset.productQuantity}
                    </div>
                    {selectedAsset.brand && (
                      <div>
                        <strong>Brand:</strong> {selectedAsset.brand}
                      </div>
                    )}
                    {selectedAsset.model && (
                      <div>
                        <strong>Model:</strong> {selectedAsset.model}
                      </div>
                    )}
                    {selectedAsset.category && (
                      <div>
                        <strong>Category:</strong> {selectedAsset.category}
                      </div>
                    )}
                    <div>
                      <strong>Added:</strong>{" "}
                      {new Date(selectedAsset.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {role === "admin" && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Organization Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Company:</strong> {selectedAsset.companyName}
                      </div>
                      <div>
                        <strong>HR Email:</strong> {selectedAsset.hrEmail}
                      </div>
                    </div>
                  </div>
                )}

                {role === "hr" && selectedAsset.description && (
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-base-content/70">
                      {selectedAsset.description}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    to={`/asset/${selectedAsset._id}`}
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => setSelectedAsset(null)}
                  >
                    View Full Details Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedAsset(null)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AllAssets;
