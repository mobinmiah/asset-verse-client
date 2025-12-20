import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen flex justify-center items-center px-2 sm:px-4 md:px-16 lg:px-32 md:py-10 bg-base-200">
      <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src={profile.role === "hr" ? profile.companyLogo : profile.photo}
              alt="Profile"
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover rounded-xl shadow-2xl"
            />
          </div>

          <div className="card-body p-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left text-primary">
              {profile.name}
            </h1>

            <div className="space-y-4 text-sm sm:text-base">
              {profile.role === "hr" ? (
                <>
                  <InfoRow label="Company Name" value={profile.companyName} />
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
                  <InfoRow label="Role" value="HR" />
                  <InfoRow label="Subscription" value={profile.subscription} />
                  <InfoRow
                    label="Joined On"
                    value={new Date(profile.createdAt).toLocaleDateString()}
                  />
                </>
              ) : (
                <>
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
                  <InfoRow label="Role" value="Employee" />
                  <InfoRow
                    label="Joined On"
                    value={new Date(profile.createdAt).toLocaleDateString()}
                  />
                </>
              )}
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              <button className="btn btn-primary w-full sm:w-auto">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
      <span className="font-semibold">{label} :</span>
      <span className="sm:text-right break-all">{value}</span>
    </div>
  );
};

export default MyProfile;
