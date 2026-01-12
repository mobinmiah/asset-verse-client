import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Loading from "../../../components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import ResponsiveTable from "../../../components/ResponsiveTable/ResponsiveTable";

const AllEmployees = () => {
  const axiosSecure = useAxiosSecure();
  const {
    refetch,
    data: employees = [],
    isLoading,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/employee");
      return res.data;
    },
    staleTime: 1000 * 10,
  });

  const handleRemoveEmployee = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You you want to remove this employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove employee!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/users/employees/${id}`);
        await refetch();
        Swal.fire({
          title: "Removed!",
          text: "Employee has been successfully removed.",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to remove employee. Try again.",
          icon: "error",
        });
      }
    }
  };

  // Define table columns
  const columns = [
    {
      header: "Photo",
      accessor: "photo",
      render: (emp) => (
        <div className="avatar">
          <div className="w-12 h-12 rounded-full">
            <img
              src={emp.photoURL || emp.photo || "/placeholder.png"}
              alt={emp.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/48x48?text=" +
                  (emp.name?.[0] || "U");
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      sortable: true,
      render: (emp) => <div className="font-medium">{emp.name}</div>,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
      render: (emp) => <div className="text-sm">{emp.email}</div>,
    },
    {
      header: "Join Date",
      accessor: "createdAt",
      sortable: true,
      render: (emp) => (
        <div className="text-sm">
          {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "—"}
        </div>
      ),
    },
    {
      header: "Assets",
      accessor: "assetCount",
      sortable: true,
      render: (emp) => (
        <span className="badge badge-primary badge-sm">
          {emp.assetCount || 0}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (emp) => (
        <button
          onClick={() => handleRemoveEmployee(emp._id)}
          className="btn btn-xs btn-error"
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
          <span className="hidden sm:inline ml-1">Remove</span>
        </button>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>My Employees - AssetVerse | Manage Team Members</title>
        <meta
          name="description"
          content="Manage your team members and track their asset assignments. View employee details and manage team structure."
        />
      </Helmet>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              My Employees
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base">
              Manage your team members ({employees.length} total)
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-sm">Total Employees</div>
            <div className="stat-value text-2xl text-primary">
              {employees.length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-sm">Total Assets Assigned</div>
            <div className="stat-value text-2xl text-info">
              {employees.reduce((sum, emp) => sum + (emp.assetCount || 0), 0)}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-4 shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-sm">Active Members</div>
            <div className="stat-value text-2xl text-success">
              {employees.filter((emp) => emp.assetCount > 0).length}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable
          data={employees}
          columns={columns}
          loading={isLoading}
          searchable={true}
          sortable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No employees found. Team members will appear here when they join your organization."
        />
      </div>
    </div>
  );
};

export default AllEmployees;
