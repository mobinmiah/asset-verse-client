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

  const { role, roleLoading } = useRole();

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email, role],
    enabled: !!user?.email,
    queryFn: async () => {
      if (role === "admin") {
        // Fetch from admin collection
        const res = await axiosSecure.get(`/admin/${user.email}`);
        return res.data;
      } else {
        // Fetch from users collection
        const res = await axiosSecure.get(`/users/${user.email}`);
        return res.data;
      }
    },
  });

  const handleLogOut = () => {
    LogOut();
  };

  if (isLoading || roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen print:h-auto print:overflow-visible">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col print:h-auto print:overflow-visible">
        {/* Mobile/Tablet Navbar */}
        <nav className="navbar bg-base-300 lg:bg-base-100 shadow-sm px-2 sm:px-4 print:hidden">
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
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>

              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="rounded-full hover:bg-primary-focus border-2 border-base-300 hover:border-primary w-12 h-12 p-0 overflow-hidden transition-all duration-200"
                  aria-label="User menu"
                >
                  {profile?.image ||
                  profile?.companyLogo ||
                  profile?.photo ||
                  user?.photoURL ? (
                    <img
                      src={
                        profile?.image ||
                        profile?.companyLogo ||
                        profile?.photo ||
                        user?.photoURL
                      }
                      alt="User profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${(profile?.name ||
                          user?.displayName ||
                          user?.email ||
                          "User")[0]?.toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {(profile?.name ||
                        user?.displayName ||
                        user?.email ||
                        "User")[0]?.toUpperCase()}
                    </span>
                  )}
                </button>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-base-100 rounded-box w-64 max-w-[90vw] border border-base-300"
                >
                  {/* Profile section */}
                  <li className="menu-title">
                    <span className="text-primary font-semibold">
                      {profile?.name ||
                        user?.displayName ||
                        user?.email?.split("@")[0] ||
                        "User"}
                    </span>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/my-profile"
                      className="flex items-center gap-2"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="flex items-center gap-2">
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
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="flex items-center gap-2">
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Home
                    </Link>
                  </li>

                  {/* Theme toggle for mobile */}
                  <li className="lg:hidden border-t border-base-300 mt-2 pt-2">
                    <div className="flex items-center justify-between p-2">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>
                  </li>

                  {/* Logout */}
                  <li className="border-t border-base-300 mt-2 pt-2">
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 text-error hover:bg-error/10"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log out
                    </button>
                  </li>
                </ul>
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
      <div className="drawer-side z-50 print:hidden">
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
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                  }`
                }
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
              </NavLink>
            </li>

            {/* HR Menu Items */}
            {role === "hr" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/asset-list"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <FaListOl className="w-5 h-5" />
                    <span className="text-sm font-medium">Asset List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-asset"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <MdAssignmentAdd className="w-5 h-5" />
                    <span className="text-sm font-medium">Add Asset</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-requests"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <VscGitPullRequestNewChanges className="w-5 h-5" />
                    <span className="text-sm font-medium">All Requests</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-employees"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <FaUsers className="w-5 h-5" />
                    <span className="text-sm font-medium">My Employees</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/upgrade-package-hr"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <GiArmorUpgrade className="w-5 h-5" />
                    <span className="text-sm font-medium">Upgrade Package</span>
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
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <AiFillProduct className="w-5 h-5" />
                    <span className="text-sm font-medium">My Assets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/request-asset"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <VscRequestChanges className="w-5 h-5" />
                    <span className="text-sm font-medium">Request Asset</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-team"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <RiTeamLine className="w-5 h-5" />
                    <span className="text-sm font-medium">My Team</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Menu Items */}
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/admin/assets"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
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
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
                  >
                    <FaUsers className="w-5 h-5" />
                    <span className="text-sm font-medium">User List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/organizations"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`
                    }
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

            {/* Divider */}
            <div className="divider my-2"></div>

            {/* Profile & Settings */}
            <li>
              <NavLink
                to="/dashboard/my-profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                  }`
                }
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
