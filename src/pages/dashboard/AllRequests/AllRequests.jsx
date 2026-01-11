import React from "react";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ResponsiveTable from "../../../components/ResponsiveTable/ResponsiveTable";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const {
    data: requests = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["hr"],
    queryFn: async () => {
      const res = await axiosSecure.get("/asset-requests/hr");
      return res.data;
    },
  });

  const handleAction = async (id, action) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${action} this request`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#14C2ED",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/requests/${id}/status`, {
        status: action,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: `Request ${action}`,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update request. Try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/requests/${id}`);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The request has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete request. Try again.",
      });
    }
  };

  // Define table columns
  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,
      render: (request) => (
        <div>
          <div className="font-medium">{request.employeeName}</div>
          <div className="text-xs text-base-content/60">
            {request.employeeEmail}
          </div>
        </div>
      ),
    },
    {
      header: "Asset",
      accessor: "productName",
      sortable: true,
      render: (request) => (
        <div className="flex items-center gap-3">
          {request.productImage && (
            <div className="avatar">
              <div className="mask mask-squircle w-10 h-10">
                <img
                  src={request.productImage}
                  alt={request.productName}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/40x40?text=No+Image";
                  }}
                />
              </div>
            </div>
          )}
          <div>
            <div className="font-medium">{request.productName}</div>
            <div className="text-xs text-base-content/60">
              {request.productType}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Request Date",
      accessor: "requestDate",
      sortable: true,
      render: (request) => (
        <div className="text-sm">
          {new Date(request.requestDate).toLocaleDateString()}
          <div className="text-xs text-base-content/60">
            {new Date(request.requestDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (request) => (
        <div className="flex items-center gap-2">
          <span
            className={`badge badge-sm ${
              request.status === "approved"
                ? "badge-success"
                : request.status === "pending"
                ? "badge-warning"
                : request.status === "rejected"
                ? "badge-error"
                : request.status === "returned"
                ? "badge-info"
                : "badge-neutral"
            }`}
          >
            {request.status === "approved" && (
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {request.status === "pending" && (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {request.status === "rejected" && (
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {request.status === "returned" && (
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            )}
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          {(request.actionDate || request.returnDate) && (
            <div className="text-xs text-base-content/60">
              {new Date(
                request.actionDate || request.returnDate
              ).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (request) => (
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {/* Approve Button */}
          <button
            onClick={() => handleAction(request._id, "approved")}
            disabled={
              request.status === "approved" || request.status === "returned"
            }
            className={`btn btn-xs lg:btn-xs ${
              request.status === "approved"
                ? "btn-disabled bg-success/20 text-success/50"
                : request.status === "returned"
                ? "btn-disabled bg-info/20 text-info/50"
                : "btn-success"
            } min-h-8 h-auto`}
            title={
              request.status === "approved"
                ? "Already approved"
                : request.status === "returned"
                ? "Asset has been returned"
                : "Approve request"
            }
          >
            {request.status === "approved" ? (
              <>
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1">Approved</span>
              </>
            ) : request.status === "returned" ? (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span className="ml-1">Returned</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-1">Approve</span>
              </>
            )}
          </button>

          {/* Reject Button */}
          <button
            onClick={() => handleAction(request._id, "rejected")}
            disabled={
              request.status === "rejected" || request.status === "returned"
            }
            className={`btn btn-xs lg:btn-xs ${
              request.status === "rejected"
                ? "btn-disabled bg-error/20 text-error/50"
                : request.status === "returned"
                ? "btn-disabled bg-info/20 text-info/50"
                : "btn-error"
            } min-h-8 h-auto`}
            title={
              request.status === "rejected"
                ? "Already rejected"
                : request.status === "returned"
                ? "Asset has been returned"
                : "Reject request"
            }
          >
            {request.status === "rejected" ? (
              <>
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1">Rejected</span>
              </>
            ) : request.status === "returned" ? (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span className="ml-1">Returned</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
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
                <span className="ml-1">Reject</span>
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(request._id)}
            className="btn btn-xs lg:btn-xs btn-warning min-h-8 h-auto"
            title="Delete request permanently"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="ml-1">Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>All Requests - AssetVerse | Manage Asset Requests</title>
        <meta
          name="description"
          content="Manage and review all asset requests from employees. Approve, reject, or track the status of asset assignments."
        />
      </Helmet>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Asset Requests
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base">
              Manage employee asset requests ({requests.length} total)
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
            <div className="stat-title text-xs sm:text-sm">Pending</div>
            <div className="stat-value text-lg sm:text-2xl text-warning">
              {requests.filter((r) => r.status === "pending").length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
            <div className="stat-title text-xs sm:text-sm">Approved</div>
            <div className="stat-value text-lg sm:text-2xl text-success">
              {requests.filter((r) => r.status === "approved").length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
            <div className="stat-title text-xs sm:text-sm">Rejected</div>
            <div className="stat-value text-lg sm:text-2xl text-error">
              {requests.filter((r) => r.status === "rejected").length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
            <div className="stat-title text-xs sm:text-sm">Returned</div>
            <div className="stat-value text-lg sm:text-2xl text-info">
              {requests.filter((r) => r.status === "returned").length}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="hidden lg:block">
          <ResponsiveTable
            data={requests}
            columns={columns}
            loading={isLoading}
            searchable={true}
            sortable={true}
            pagination={true}
            itemsPerPage={10}
            emptyMessage="No asset requests found. Employee requests will appear here."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-4 auto-rows-fr">
          {requests.map((r) => (
            <div
              key={r._id}
              className="card bg-base-200 shadow border h-full flex"
            >
              {/* Image */}
              <figure className="p-3 border-b border-primary flex justify-center items-center">
                <img
                  src={r.productImage}
                  alt={r.productName}
                  className="max-h-28 object-contain"
                />
              </figure>

              {/* Content */}
              <div className="card-body p-3 text-sm flex flex-col justify-between">
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Asset</span>
                    <span className="truncate max-w-30">
                      {r.productName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Status</span>
                    <span
                      className={`badge ${
                        r.status === "approved"
                          ? "badge-success"
                          : r.status === "returned"
                          ? "badge-info"
                          : "badge-error"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Request</span>
                    <span>
                      {new Date(r.requestDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Approved</span>
                    <span>
                      {r.actionDate
                        ? new Date(r.actionDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Type</span>
                    <span>{r.productType}</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Employee</span>
                    <span className="truncate max-w-30">
                      {r.employeeName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="truncate max-w-30">
                      {r.employeeEmail}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-col gap-2">
                  {/* Approve */}
                  <button
                    onClick={() => handleAction(r._id, "approved")}
                    disabled={
                      r.status === "approved" || r.status === "returned"
                    }
                    className={`btn min-h-8 h-auto ${
                      r.status === "approved"
                        ? "btn-disabled bg-success/20 text-success/50"
                        : r.status === "returned"
                        ? "btn-disabled bg-info/20 text-info/50"
                        : "btn-success"
                    }`}
                  >
                    {r.status === "approved"
                      ? "Approved"
                      : r.status === "returned"
                      ? "Returned"
                      : "Approve"}
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => handleAction(r._id, "rejected")}
                    disabled={
                      r.status === "rejected" || r.status === "returned"
                    }
                    className={`btn min-h-8 h-auto ${
                      r.status === "rejected"
                        ? "btn-disabled bg-error/20 text-error/50"
                        : r.status === "returned"
                        ? "btn-disabled bg-info/20 text-info/50"
                        : "btn-error"
                    }`}
                  >
                    {r.status === "rejected"
                      ? "Rejected"
                      : r.status === "returned"
                      ? "Returned"
                      : "Reject"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="btn btn-warning min-h-8 h-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AllRequests;
