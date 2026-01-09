import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { MdAssignmentAdd } from "react-icons/md";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import Loading from "../components/Loading/Loading";
import { FaListOl, FaUsers } from "react-icons/fa6";
import Logo from "../components/Logo/Logo";
import { IoLogOut } from "react-icons/io5";
import { GiArmorUpgrade } from "react-icons/gi";
import {
  VscGitPullRequestNewChanges,
  VscRequestChanges,
} from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { RiTeamLine } from "react-icons/ri";

const DashboardLayout = () => {
  const { user, LogOut } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { role } = useRole();
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });
  
  const handleLogOut = () => {
    LogOut();
  };
  
  if (isLoading) {
    return <Loading></Loading>;
  }
  
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Mobile/Tablet Navbar */}
        <nav className="navbar bg-base-300 lg:bg-base-100 shadow-sm px-2 sm:px-4">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost btn-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
          </div>

          <div className="flex-1">
            <div className="tooltip tooltip-bottom" data-tip="Home">
              <Logo></Logo>
            </div>
          </div>

          <div className="flex-none">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/dashboard"
                className="tooltip tooltip-bottom"
                data-tip={`${profile.name} | Dashboard Home`}
              >
                {profile.companyLogo || profile.photo ? (
                  <img
                    src={profile.companyLogo || profile.photo}
                    alt="User profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/30 object-cover profile-image hover:ring-primary/50 transition-all duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold profile-image hover:bg-primary/30 transition-all duration-200 text-xs sm:text-sm">
                    {profile?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>
              <div className="hidden sm:block">
                <ThemeToggle></ThemeToggle>
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 bg-base-200 min-h-0">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet></Outlet>
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col bg-base-300 w-64 lg:w-72">
          {/* Sidebar header - only visible on mobile */}
          <div className="p-4 border-b border-base-content/10 lg:hidden">
            <div className="flex items-center justify-between">
              <Logo />
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Sidebar content */}
          <ul className="menu w-full flex-1 p-2 text-base-content">
            {/* Dashboard Home */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="text-sm font-medium">Dashboard Home</span>
              </Link>
            </li>

            {/* HR Menu Items */}
            {role === "hr" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/asset-list"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <FaListOl className="w-5 h-5" />
                    <span className="text-sm font-medium">Asset List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-asset"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <MdAssignmentAdd className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Asset</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-requests"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <VscGitPullRequestNewChanges className="w-5 h-5" />
                    <span className="text-sm font-medium">All Requests</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-employees"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <FaUsers className="w-5 h-5" />
                    <span className="text-sm font-medium">My Employees</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/upgrade-package-hr"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <GiArmorUpgrade className="w-5 h-5" />
                    <span className="text-sm font-medium">Upgrade Package</span>
                  </NavLink>
                </li>
              </>
            )}
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/admin/assets"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="text-sm font-medium">All Assets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/users"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <FaUsers className="w-5 h-5" />
                    <span className="text-sm font-medium">User List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/organizations"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
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
                    <span className="text-sm font-medium">Organizations</span>
                  </NavLink>
                </li>
              </>
            )}
            {/* Employee Menu Items */}
            {role === "employee" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/my-assets"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <AiFillProduct className="w-5 h-5" />
                    <span className="text-sm font-medium">My Assets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/request-asset"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <VscRequestChanges className="w-5 h-5" />
                    <span className="text-sm font-medium">Request Asset</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-team"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <RiTeamLine className="w-5 h-5" />
                    <span className="text-sm font-medium">My Team</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Divider */}
            <div className="divider my-2"></div>

            {/* Profile & Settings */}
            <li>
              <NavLink
                to="/dashboard/my-profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
              >
                <CgProfile className="w-5 h-5" />
                <span className="text-sm font-medium">My Profile</span>
              </NavLink>
            </li>

            {/* Logout */}
            <li className="mt-auto">
              <button
                onClick={handleLogOut}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-white transition-all duration-200 w-full text-left"
              >
                <IoLogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
