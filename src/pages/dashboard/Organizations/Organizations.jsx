import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminOrganizations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrgDetails, setSelectedOrgDetails] = useState(null);

  const handleSyncEmployeeCounts = () => {
    Swal.fire({
      title: "Sync Employee Counts?",
      text: "This will update employee counts for all organizations based on actual database records.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#14C2ED",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, sync now!",
    }).then((result) => {
      if (result.isConfirmed) {
        syncEmployeeCountsMutation.mutate();
      }
    });
  };

  // Check specific organization mutation
  const checkOrganizationMutation = useMutation({
    mutationFn: async (identifier) => {
      const res = await axiosSecure.get(
        `/admin/check-organization/${identifier}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: `${data.companyName}`,
        html: `
          <div class="text-left space-y-2">
            <p><strong>HR Name:</strong> ${data.hrName}</p>
            <p><strong>HR Email:</strong> ${data.hrEmail}</p>
            <p><strong>Employee Limit:</strong> ${data.employeeLimit}</p>
            <p><strong>Current Employees:</strong> ${
              data.actualEmployeeCount
            }</p>
            <p><strong>Available Slots:</strong> ${data.availableSlots}</p>
            <p><strong>Assets:</strong> ${data.assetCount}</p>
            <p><strong>Subscription:</strong> ${data.subscription}</p>
            <p><strong>Paid:</strong> ${data.paid ? "Yes" : "No"}</p>
            ${
              data.isOverLimit
                ? '<p class="text-red-600"><strong>⚠️ Over Limit!</strong></p>'
                : ""
            }
          </div>
        `,
        icon: data.isOverLimit ? "warning" : "info",
        confirmButtonText: "Close",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Organization not found");
    },
  });

  const handleCheckOrganization = () => {
    Swal.fire({
      title: "Check Organization",
      input: "text",
      inputLabel: "Enter company name, email, or HR name",
      inputPlaceholder: "e.g., mobin-web-agency",
      showCancelButton: true,
      confirmButtonText: "Check",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter an organization identifier!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        checkOrganizationMutation.mutate(result.value);
      }
    });
  };

  // Fetch organizations with real-time updates
  const {
    data: organizations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/organizations-for-admin");
      return res.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    if (!Array.isArray(organizations)) return [];

    return organizations.filter((org) => {
      const matchesSearch =
        !searchTerm.trim() ||
        [org.companyName, org.name, org.email, org.subscription].some(
          (field) =>
            field &&
            field
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase().trim())
        );

      const matchesSubscription =
        subscriptionFilter === "all" ||
        (org.subscription || "Basic").toLowerCase() ===
          subscriptionFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && org.paid) ||
        (paymentFilter === "free" && !org.paid);

      return matchesSearch && matchesSubscription && matchesPayment;
    });
  }, [organizations, searchTerm, subscriptionFilter, paymentFilter]);

  const handleViewDetails = (org) => {
    setSelectedOrgDetails(org);
  };

  // Organization Card Component
  const OrganizationCard = ({ org }) => {
    const usagePercentage = org.packageLimit
      ? Math.min(((org.actualEmployees || 0) / org.packageLimit) * 100, 100)
      : 0;

    const isNearLimit = usagePercentage > 80;
    const isOverLimit = (org.actualEmployees || 0) > (org.packageLimit || 5);

    return (
      <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div className="card-body p-4">
          {/* Organization Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="avatar">
              <div className="w-14 h-14 rounded-xl ring-2 ring-primary/20">
                {org.companyLogo ? (
                  <img
                    src={org.companyLogo}
                    alt={org.companyName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${org.companyName}&background=14C2ED&color=fff&size=56`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg rounded-xl">
                    {org.companyName?.[0]?.toUpperCase() ||
                      org.name?.[0]?.toUpperCase() ||
                      "C"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-base-content truncate">
                {org.companyName || org.name}
              </h3>
              <p className="text-sm text-base-content/70 truncate">
                {org.name}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {org.email}
              </p>

              {/* Status Badges */}
              <div className="flex gap-2 mt-2">
                <span
                  className={`badge badge-sm ${
                    org.subscription === "Premium"
                      ? "badge-primary"
                      : org.subscription === "Standard"
                      ? "badge-secondary"
                      : "badge-neutral"
                  }`}
                >
                  {org.subscription || "Basic"}
                </span>
                <span
                  className={`badge badge-sm ${
                    org.paid ? "badge-success" : "badge-warning"
                  }`}
                >
                  {org.paid ? "Paid" : "Free"}
                </span>
                {isOverLimit && (
                  <span className="badge badge-sm badge-error">Over Limit</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-primary/10 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {org.actualEmployees || 0}
              </div>
              <div className="text-xs text-base-content/70">Employees</div>
            </div>
            <div className="text-center p-2 bg-secondary/10 rounded-lg">
              <div className="text-lg font-bold text-secondary">
                {org.assetCount || 0}
              </div>
              <div className="text-xs text-base-content/70">Assets</div>
            </div>
            <div className="text-center p-2 bg-accent/10 rounded-lg">
              <div className="text-lg font-bold text-accent">
                {org.packageLimit || 5}
              </div>
              <div className="text-xs text-base-content/70">Limit</div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-base-content/70 mb-1">
              <span>Employee Usage</span>
              <span className={isOverLimit ? "text-error font-semibold" : ""}>
                {org.actualEmployees || 0}/{org.packageLimit || 5}
              </span>
            </div>
            <progress
              className={`progress w-full ${
                isOverLimit
                  ? "progress-error"
                  : isNearLimit
                  ? "progress-warning"
                  : "progress-primary"
              }`}
              value={Math.min(org.actualEmployees || 0, org.packageLimit || 5)}
              max={org.packageLimit || 5}
            ></progress>
            {isOverLimit && (
              <p className="text-xs text-error mt-1">
                Exceeds limit by{" "}
                {(org.actualEmployees || 0) - (org.packageLimit || 5)} employees
              </p>
            )}
          </div>

          {/* Join Date */}
          <div className="flex justify-between items-center text-xs text-base-content/60 mb-4 pt-3 border-t border-base-300">
            <span>Joined:</span>
            <span>{new Date(org.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(org)}
              className="btn btn-sm btn-primary flex-1"
            >
              View Details
            </button>
            <button className="btn btn-sm btn-outline btn-secondary">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">
              Loading organizations...
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
            Error Loading Organizations
          </h3>
          <p className="text-base-content/50 mb-4">
            {error.message || "Failed to load organizations. Please try again."}
          </p>
          <button className="btn btn-primary" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>Organizations Management - Admin | AssetVerse</title>
        <meta
          name="description"
          content="Manage all organizations on the AssetVerse platform."
        />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Organizations Management
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Manage all organizations on the platform ({organizations.length}{" "}
            total)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Search Organizations
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Subscription Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Filter by Subscription
              </span>
            </label>
            <select
              className="form-select"
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
            >
              <option value="all">All Subscriptions</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filter by Payment</span>
            </label>
            <select
              className="form-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4">
          <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={() => {
              setSearchTerm("");
              setSubscriptionFilter("all");
              setPaymentFilter("all");
            }}
          >
            Clear All Filters
          </button>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <p className="text-sm text-base-content/60 mt-2">
            Showing {filteredOrganizations.length} results for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Organizations Grid */}
      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold text-base-content/70 mb-2">
            {searchTerm ? "No Organizations Found" : "No Organizations Yet"}
          </h3>
          <p className="text-base-content/50">
            {searchTerm
              ? "Try adjusting your search criteria or filters"
              : "No organizations have registered on the platform yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard key={org._id} org={org} />
          ))}
        </div>
      )}

      {/* Organization Details Modal */}
      {selectedOrgDetails && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-2xl text-primary">
                Organization Details
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedOrgDetails(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Organization Logo and Basic Info */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-32 h-32 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2">
                    {selectedOrgDetails.companyLogo ? (
                      <img
                        src={selectedOrgDetails.companyLogo}
                        alt={selectedOrgDetails.companyName}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${selectedOrgDetails.companyName}&background=14C2ED&color=fff&size=128`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl rounded-xl">
                        {selectedOrgDetails.companyName?.[0]?.toUpperCase() ||
                          "C"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-xl">
                    {selectedOrgDetails.companyName}
                  </h4>
                  <p className="text-base-content/70">
                    {selectedOrgDetails.name}
                  </p>
                  <p className="text-sm text-base-content/60 break-words">
                    {selectedOrgDetails.email}
                  </p>

                  <div className="flex flex-col items-center gap-2 mt-4">
                    <span
                      className={`badge badge-lg ${
                        selectedOrgDetails.subscription === "Premium"
                          ? "badge-primary"
                          : selectedOrgDetails.subscription === "Standard"
                          ? "badge-secondary"
                          : "badge-neutral"
                      }`}
                    >
                      {selectedOrgDetails.subscription || "Basic"} Plan
                    </span>
                    <span
                      className={`badge badge-lg ${
                        selectedOrgDetails.paid
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {selectedOrgDetails.paid
                        ? "Paid Account"
                        : "Free Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="md:col-span-2 space-y-6">
                {/* Usage Statistics */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Usage Statistics
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedOrgDetails.actualEmployees || 0}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Current Employees
                      </div>
                    </div>
                    <div className="text-center p-3 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        {selectedOrgDetails.assetCount || 0}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Total Assets
                      </div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent">
                        {selectedOrgDetails.packageLimit || 5}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Employee Limit
                      </div>
                    </div>
                    <div className="text-center p-3 bg-info/10 rounded-lg">
                      <div className="text-2xl font-bold text-info">
                        {selectedOrgDetails.packageLimit
                          ? Math.round(
                              ((selectedOrgDetails.actualEmployees || 0) /
                                selectedOrgDetails.packageLimit) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-base-content/70">
                        Usage Rate
                      </div>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-base-content/70 mb-2">
                      <span>Employee Usage</span>
                      <span>
                        {selectedOrgDetails.actualEmployees || 0}/
                        {selectedOrgDetails.packageLimit || 5}
                      </span>
                    </div>
                    <progress
                      className={`progress w-full ${
                        (selectedOrgDetails.actualEmployees || 0) >
                        (selectedOrgDetails.packageLimit || 5)
                          ? "progress-error"
                          : (selectedOrgDetails.actualEmployees || 0) /
                              (selectedOrgDetails.packageLimit || 5) >
                            0.8
                          ? "progress-warning"
                          : "progress-primary"
                      }`}
                      value={Math.min(
                        selectedOrgDetails.actualEmployees || 0,
                        selectedOrgDetails.packageLimit || 5
                      )}
                      max={selectedOrgDetails.packageLimit || 5}
                    ></progress>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Account Information
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-base-content/70">
                        Subscription Plan:
                      </span>
                      <p className="font-semibold">
                        {selectedOrgDetails.subscription || "Basic"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-base-content/70">
                        Payment Status:
                      </span>
                      <p
                        className={`font-semibold ${
                          selectedOrgDetails.paid
                            ? "text-success"
                            : "text-warning"
                        }`}
                      >
                        {selectedOrgDetails.paid ? "Paid" : "Free"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-base-content/70">
                        Employee Limit:
                      </span>
                      <p className="font-semibold">
                        {selectedOrgDetails.packageLimit || 5}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-base-content/70">
                        Registration Date:
                      </span>
                      <p className="font-semibold">
                        {new Date(
                          selectedOrgDetails.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedOrgDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedOrgDetails(null)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;
