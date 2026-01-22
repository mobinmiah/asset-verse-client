import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import Loading from "../../../components/Loading/Loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch profile data
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email, role],
    enabled: !!user?.email,
    queryFn: async () => {
      if (role === "admin") {
        // Fetch from admin data
        const res = await axiosSecure.get(`/admin/${user.email}`);
        return res.data;
      } else {
        // Fetch from users collection
        const res = await axiosSecure.get(`/users/${user.email}`);
        return res.data;
      }
    },
  });

 useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      reset(profile);
    }
  }, [profile, reset, isEditing]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/users/${user.email}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-profile", user?.email, role]);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Update error:", error);
    },
  });

  const handleUpdateProfile = (data) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([ value]) => value !== "" && value !== null && value !== undefined)
    );
    
    updateProfileMutation.mutate(cleanedData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset(profile);
  };

  // Fetch total assets (for HR only)
  const { data: totalAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["totalAssets"],
    queryFn: async () => {
      if (role === "admin") {
        // Admin gets assets from admin endpoint
        const res = await axiosSecure.get("/admin/assets");
        return res.data.assets || res.data;
      } else if (role === "hr") {
        // HR gets their own assets
        const res = await axiosSecure.get("/assets");
        return res.data;
      }
      return [];
    },
    enabled: role === "hr" || role === "admin"
  });

  if (isLoading || assetsLoading) return <Loading />;

  return (
    <div className="min-h-screen flex justify-center items-center px-2 sm:px-4 md:px-16 lg:px-32 md:py-10 bg-base-200">
      <Helmet>
        <title>My Profile - AssetVerse | Manage Your Profile</title>
        <meta
          name="description"
          content="View and edit your profile information, manage your account settings, and update your personal details."
        />
      </Helmet>

      <div className="w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src={
                profile.role === "hr"
                  ? profile.companyLogo
                  : profile.role === "admin"
                  ? profile.image || profile.photo || user?.photoURL
                  : profile.photo
              }
              alt="Profile"
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl shadow-2xl"
            />
          </div>

          <div className="card-body p-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center md:text-left text-primary">
              {profile.name}
            </h1>

            <div className="space-y-4 text-sm sm:text-base">
              {!isEditing ? (
                // Display Mode
                <>
                  {profile.role === "hr" ? (
                    <>
                      <InfoRow
                        label="Company Name"
                        value={profile.companyName}
                      />
                      <InfoRow label="Email" value={profile.email} />
                      <InfoRow label="Role" value="HR Manager" />
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
                        value={`${profile.currentEmployees}`}
                        to="/dashboard/my-employees"
                      />
                      <InfoRow
                        label="Package Limit"
                        value={`${profile.packageLimit}`}
                      />
                      <InfoRow
                        label="Subscription"
                        value={profile.subscription}
                      />
                      <InfoRow
                        label="Paid Plan"
                        value={profile.paid ? "Yes" : "No"}
                      />
                      <InfoRow
                        label="Date of Birth"
                        value={profile.dateOfBirth}
                      />
                    </>
                  ) : profile.role === "admin" ? (
                    <>
                      <InfoRow label="Email" value={profile.email} />
                      <InfoRow label="Role" value="System Administrator" />
                      <InfoRow
                        label="Joined On"
                        value={new Date(profile.createdAt).toLocaleDateString()}
                      />
                      <InfoRow
                        label="Access Level"
                        value="Full System Access"
                      />
                      <InfoRow
                        label="Admin Panel"
                        value="Available"
                        to="/dashboard/admin"
                      />
                      {profile.dateOfBirth && (
                        <InfoRow
                          label="Date of Birth"
                          value={profile.dateOfBirth}
                        />
                      )}
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
                        to="/dashboard/my-team"
                      />
                      <InfoRow label="Role" value="Employee" />
                      <InfoRow
                        label="Joined On"
                        value={new Date(profile.createdAt).toLocaleDateString()}
                      />
                      <InfoRow
                        label="Assets Assigned"
                        value={profile.assets?.length || 0}
                        to="/dashboard/my-assets"
                      />
                      <InfoRow
                        label="Date of Birth"
                        value={profile.dateOfBirth}
                      />
                    </>
                  )}
                </>
              ) : (
                // Edit Mode
                <form
                  onSubmit={handleSubmit(handleUpdateProfile)}
                  className="space-y-4"
                >
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Name *</span>
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="input w-full focus:input-primary"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {profile.role === "hr" && (
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Company Name *
                        </span>
                      </label>
                      <input
                        {...register("companyName", {
                          required: "Company name is required",
                        })}
                        className="input w-full focus:input-primary"
                        placeholder="Your company name"
                      />
                      {errors.companyName && (
                        <p className="text-error text-sm mt-1">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        Date of Birth
                      </span>
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className="input w-full focus:input-primary"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        {profile.role === "hr"
                          ? "Company Logo URL"
                          : "Profile Image URL"}
                      </span>
                    </label>
                    <input
                      type="url"
                      {...register(
                        profile.role === "hr"
                          ? "companyLogo"
                          : profile.role === "admin"
                          ? "image"
                          : "photo"
                      )}
                      className="input w-full focus:input-primary"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Additional fields for all users */}

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Address</span>
                    </label>
                    <textarea
                      {...register("address")}
                      className="textarea border-primary w-full outline-none resize-none"
                      rows="3"
                      placeholder="Your address"
                    />
                  </div>

                  {profile.role === "employee" && (
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Department
                        </span>
                      </label>
                      <select
                        {...register("department")}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="">Select Department</option>
                        <option value="Operations">Operations</option>
                        <option value="IT">Information Technology</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Administration">Administration</option>
                        <option value="Research">Research & Development</option>
                        <option value="Customer Service">
                          Customer Service
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={updateProfileMutation.isLoading}
                    >
                      {updateProfileMutation.isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
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
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-outline flex-1"
                      disabled={updateProfileMutation.isLoading}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              ) : null}
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
        className="flex justify-between  hover:text-primary hover:underline"
      >
        <span className="font-semibold">{label} :</span>
        <span className="sm:text-right break-all">{value}</span>
      </Link>
    );
  }

  return (
    <div className="flex justify-between">
      <span className="font-semibold">{label} :</span>
      <span className="sm:text-right break-all">{value}</span>
    </div>
  );
};

export default MyProfile;
