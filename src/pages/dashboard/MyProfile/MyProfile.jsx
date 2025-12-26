import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch profile data
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch total assets (for HR)
  const { data: totalAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["totalAssets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets");
      return res.data;
    },
  });

  if (isLoading || assetsLoading) return <Loading />;

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
                  <InfoRow label="Role" value="HR" />
                  <InfoRow
                    label="Joined On"
                    value={new Date(profile.createdAt).toLocaleDateString()}
                  />
                  <InfoRow
                    label="Total Assets"
                    value={totalAssets.length}
                    to="/dashboard/asset-list"
                  />
                  <InfoRow
                    label="Employees Used"
                    value={`${profile.currentEmployees}/${profile.packageLimit}`}
                    to="/dashboard/my-employees"
                  />
                  <InfoRow label="Subscription" value={profile.subscription} />
                  <InfoRow
                    label="Paid Plan"
                    value={profile.paid ? "Yes" : "No"}
                  />
                  <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
                </>
              ) : (
                <>
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow
                    label="Affiliations"
                    value={
                      profile.affiliations
                        ?.map((a) => a.companyName)
                        .join(", ") || "None"
                    }
                  />
                  <InfoRow label="Role" value="Employee" />
                  <InfoRow
                    label="Joined On"
                    value={new Date(profile.createdAt).toLocaleDateString()}
                  />
                  <InfoRow
                    label="Assets Assigned"
                    value={profile.assets?.length || 0}
                    to="/dashboard/my-assetes"
                  />
                  <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
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

// InfoRow with optional link
const InfoRow = ({ label, value, to }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="flex flex-col sm:flex-row sm:justify-between gap-1 hover:text-primary hover:underline"
      >
        <span className="font-semibold">{label} :</span>
        <span className="sm:text-right break-all">{value}</span>
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
      <span className="font-semibold">{label} :</span>
      <span className="sm:text-right break-all">{value}</span>
    </div>
  );
};

export default MyProfile;
