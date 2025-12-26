import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Loading from "../../../components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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


  if (isLoading) return <Loading />;

  return (
    <div className="bg-base-100 rounded-xl">
      <Helmet>
        <title>My Employees | AssetVerse</title>
      </Helmet>

      <h2 className="text-3xl font-bold mb-6 pt-5 text-center text-primary">
        My Employees ({employees.length})
      </h2>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Assets</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <img
                    src={emp.photoURL || emp.photo || "/placeholder.png"}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="font-medium">{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  {emp.createdAt
                    ? new Date(emp.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <span className="badge badge-primary">{emp.assetCount}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveEmployee(emp._id)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployees;
