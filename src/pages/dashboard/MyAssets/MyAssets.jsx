import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Loading } from "../../../components/LoadingStates/LoadingStates";
import ResponsiveTable from "../../../components/ResponsiveTable/ResponsiveTable";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const returnAsset = useMutation({
    mutationFn: async (assetId) => {
      const res = await axiosSecure.patch("/assets/return", { assetId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Asset returned successfully!");
      queryClient.invalidateQueries(["my-profile", user?.email]);
      queryClient.invalidateQueries(["employee-approved-assets"]);
      setSelectedAsset(null);
      document.getElementById("return_modal").close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to return asset");
    },
  });

  // Fetch user profile (assigned assets)
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch approved asset requests
  const { data: approvedAssets = [] } = useQuery({
    queryKey: ["employee-approved-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/asset-requests/employee?status=approved"
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const mergedAssets = (profile.assets || []).map((asset) => {
    // Find the approved request that matches this asset
    const request = approvedAssets.find(
      (r) => r.assetId === asset.assetId && r.status === "approved"
    );

    return {
      ...asset,
      status: request?.status || asset.status || "approved",
      requestDate: request?.requestDate || asset.requestDate,
      approvalDate: request?.actionDate || asset.approvalDate,
      companyName: request?.companyName || asset.companyName,
    };
  });

  // Filter by search and type
  const filteredAssets = mergedAssets.filter(
    (asset) =>
      asset.productName.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? asset.productType === typeFilter : true)
  );

  const handleReturnAsset = (asset) => {
    setSelectedAsset(asset);
    document.getElementById("return_modal").showModal();
  };

  const confirmReturn = async () => {
    if (selectedAsset) {

      returnAsset.mutate(selectedAsset.assetId);
    }
  };

  // Define table columns
  const columns = [
    {
      header: "#",
      accessor: "index",
      render: (item, index) => index + 1,
    },
    {
      header: "Asset",
      accessor: "productName",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img
                src={item.productImage}
                alt={item.productName}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                }}
              />
            </div>
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base">{item.productName}</div>
            <div className="text-xs text-base-content/70">
              {item.companyName}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "HR Email",
      accessor: "hrEmail",
      render: (item) => (
        <div className="text-sm">
          <a href={`mailto:${item.hrEmail}`} className="link link-primary">
            {item.hrEmail}
          </a>
        </div>
      ),
    },
    {
      header: "Request Date",
      accessor: "requestDate",
      render: (item) => (
        <div className="text-sm">
          {new Date(item.requestDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Approval Date",
      accessor: "approvalDate",
      render: (item) => (
        <div className="text-sm">
          {new Date(item.approvalDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <span className={`badge badge-sm ${
          item.status === "approved" ? "badge-success" : 
          item.status === "pending" ? "badge-warning" : "badge-error"
        }`}>
          {item.status || "approved"}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: "productType",
      render: (item) => (
        <span className={`badge badge-sm ${
          item.productType === "Returnable" ? "badge-success" : "badge-info"
        }`}>
          {item.productType}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (item) => (
        <div>
          {item.productType === "Returnable" && item.status === "approved" ? (
            <button 
              className="btn btn-xs btn-primary"
              onClick={() => handleReturnAsset(item)}
              disabled={returnAsset.isLoading}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {returnAsset.isLoading ? "Returning..." : "Return"}
            </button>
          ) : (
            <span className="text-xs text-base-content/50">Not Returnable</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>My Assets - AssetVerse | Your Assigned Assets</title>
        <meta
          name="description"
          content="View and manage your assigned assets from your organization."
        />
      </Helmet>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              My Assets
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base">
              View and manage your assigned assets ({filteredAssets.length}{" "}
              total)
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="join">
              <input
                type="text"
                placeholder="Search assets..."
                className="input input-bordered input-sm sm:input-md join-item w-full sm:w-auto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select select-bordered select-sm sm:select-md join-item"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="btn btn-primary btn-sm sm:btn-md no-print"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Total Assets</div>
            <div className="stat-value text-lg sm:text-2xl text-primary">
              {mergedAssets.length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Returnable</div>
            <div className="stat-value text-lg sm:text-2xl text-info">
              {
                mergedAssets.filter(
                  (asset) => asset.productType === "Returnable"
                ).length
              }
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Non-returnable</div>
            <div className="stat-value text-lg sm:text-2xl text-info">
              {
                mergedAssets.filter(
                  (asset) => asset.productType === "Non-returnable"
                ).length
              }
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">This Month</div>
            <div className="stat-value text-lg sm:text-2xl text-success">
              {
                mergedAssets.filter((asset) => {
                  const approvalDate = new Date(asset.approvalDate);
                  const now = new Date();
                  return (
                    approvalDate.getMonth() === now.getMonth() &&
                    approvalDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable
          data={filteredAssets}
          columns={columns}
          loading={isLoading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No assets assigned to you yet. Request assets from your HR to get started!"
          mobileKeyFields={[
            "productName",
            "productType",
            "approvalDate",
            "status",
          ]}
        />
      </div>

      {/* Return Asset Modal */}
      <dialog id="return_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg text-primary">
            Confirm Asset Return
          </h3>

          {selectedAsset && (
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Asset:</strong> {selectedAsset.productName}
              </p>
              <p>
                <strong>Company:</strong> {selectedAsset.companyName}
              </p>
              <p>
                <strong>HR Email:</strong> {selectedAsset.hrEmail}
              </p>
              <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-warning-content">
                  <strong>⚠️ Important:</strong> Once returned, this asset will
                  be available for other employees to request. This action
                  cannot be undone.
                </p>
              </div>
            </div>
          )}

          <div className="modal-action flex-col sm:flex-row gap-2">
            <button
              className="btn btn-outline w-full sm:w-auto"
              onClick={() => {
                document.getElementById("return_modal").close();
                setSelectedAsset(null);
              }}
              disabled={returnAsset.isLoading}
            >
              Cancel
            </button>

            <button
              onClick={confirmReturn}
              disabled={returnAsset.isLoading}
              className="btn btn-primary w-full sm:w-auto"
            >
              {returnAsset.isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Returning...
                </>
              ) : (
                "Confirm Return"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyAssets;
