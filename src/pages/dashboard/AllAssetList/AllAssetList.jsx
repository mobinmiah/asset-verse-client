import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllAssetList = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch all assets across all organizations
  const { data: assetsData = {}, isLoading } = useQuery({
    queryKey: ["admin-all-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets");
      return res.data;
    },
  });

  // Filter assets
  const filteredAssets = useMemo(() => {
    if (!assetsData.assets) return [];

    return assetsData.assets.filter((asset) => {
      const matchesSearch =
        asset.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.hrEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && asset.productQuantity > 0) ||
        (statusFilter === "unavailable" && asset.productQuantity === 0);

      const matchesType =
        typeFilter === "all" || asset.productType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assetsData.assets, searchTerm, statusFilter, typeFilter]);

  // Asset Card Component
  const AssetCard = ({ asset }) => (
    <div className="card h-full bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image */}
      <figure className="px-4 pt-4">
        <div className="w-full h-60 overflow-hidden rounded-xl">
          <img
            src={asset.productImage}
            alt={asset.productName}
            className="w-full h-full object-cover"
          />
        </div>
      </figure>

      {/* Body */}
      <div className="card-body p-4 flex flex-col flex-1">
        {/* Title */}
        <h2 className="card-title text-lg font-bold line-clamp-2 min-h-12">
          {asset.productName}
        </h2>

        {/* Badge */}
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

        {/* Details (growable area) */}
        <div className="text-sm text-base-content/70 flex-1 mt-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-2">
              <strong>Company:</strong>
              <span className="truncate">{asset.companyName}</span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <strong>HR:</strong>
              <span className="truncate">{asset.hrEmail}</span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <strong>Added:</strong>
              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 flex justify-end">
          <Link to={`/asset/${asset._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="flex justify-center items-center min-h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>All Assets - Admin | AssetVerse</title>
        <meta
          name="description"
          content="View and manage all assets across all organizations on the AssetVerse platform."
        />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            All Asset List
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            All assets across all organizations ({assetsData.total || 0} total)
          </p>
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
                placeholder="Search by name, company, or HR..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              className="select"
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
        <div className="mt-4">
          <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Total Assets</div>
          <div className="stat-value text-2xl text-primary">
            {assetsData.total || 0}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Returnable</div>
          <div className="stat-value text-2xl text-success">
            {assetsData.assets?.filter((a) => a.productType === "Returnable")
              .length || 0}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Non-returnable</div>
          <div className="stat-value text-2xl text-info">
            {assetsData.assets?.filter(
              (a) => a.productType === "Non-returnable"
            ).length || 0}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Showing</div>
          <div className="stat-value text-2xl text-info">
            {filteredAssets.length}
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-base-content/70 mb-2">
            No Assets Found
          </h3>
          <p className="text-base-content/50">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset._id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAssetList;
