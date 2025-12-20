import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { data: requests = [], refetch } = useQuery({
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
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10 bg-base-100 rounded-xl shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
        Requests ({requests.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Asset Name</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id}>
                <th>{index + 1}</th>
                <td>{request.employeeName}</td>
                <td>{request.productName}</td>
                <td>{new Date(request.requestDate).toLocaleString()}</td>
                <td
                  className={`${
                    request.status === "approved"
                      ? "text-success"
                      : request.status === "pending"
                      ? "text-warning"
                      : "text-error"
                  }`}
                >
                  {request.status}
                </td>
                <td>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleAction(request._id, "approved")}
                      className="btn btn-xs btn-primary"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleAction(request._id, "rejected")}
                      className="btn btn-xs btn-error"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;
