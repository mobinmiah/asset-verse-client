import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role = "employee" } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        // First check if user is admin from admin collection
        const adminRes = await axiosSecure.get(`/admin/check/${user?.email}`);
        if (adminRes.data.isAdmin) {
          return 'admin';
        }
        
        // If not admin, check regular user role
        const userRes = await axiosSecure.get(`/users/${user?.email}/role`);
        return userRes.data?.role || "employee";
      } catch (error) {
        console.error('Error fetching user role:', error);
        return "employee";
      }
    },
  });
  return { role, roleLoading };
};

export default useRole;
