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
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardLayout = () => {
  const { user, LogOut } = useAuth();
  const axiosSecure = useAxiosSecure();

  // const photo = user?.photoURL || user?.providerData?.[0]?.photoURL || "";
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
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar max-w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block w-4 h-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div>
            <Logo></Logo>
          </div>
          <div className="ml-auto flex items-center gap-3 px-4">
            <Link
              to="/dashboard"
              className="tooltip tooltip-bottom"
              data-tip={`${profile.name} | Dashboard Home`}
            >
              {profile.companyLogo || profile.photo ? (
                <img
                  src={profile.companyLogo || profile.photo}
                  alt="User profile"
                  className="w-10 h-10 rounded-full ring-2 ring-primary/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  U
                </div>
              )}
            </Link>
            <div className="hidden md:block">
              <ThemeToggle></ThemeToggle>
            </div>
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4">
          <Outlet></Outlet>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-300 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Dashboard Home"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block w-4 h-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Dashboard Home</span>
              </Link>
            </li>

            {/* List item */}

            {role === "hr" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/asset-list"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Asset List"
                  >
                    <FaListOl />
                    <span className="is-drawer-close:hidden">Asset List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-asset"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add Asset"
                  >
                    <MdAssignmentAdd />
                    <span className="is-drawer-close:hidden">Add Asset</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-requests"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Requests"
                  >
                    <VscGitPullRequestNewChanges />
                    <span className="is-drawer-close:hidden">All Requests</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-employees"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Employees"
                  >
                    <FaUsers />
                    <span className="is-drawer-close:hidden">
                      All Employees
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/upgrade-package"
                    className=" is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Upgrade Your Package"
                  >
                    <GiArmorUpgrade />
                    <span className="is-drawer-close:hidden">
                      Upgrade Your Package
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "employee" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/request-asset"
                    className=" is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Request an Asset"
                  >
                    <AiFillProduct />
                    <span className="is-drawer-close:hidden">
                      Request an Asset
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {/* <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
            
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block w-4 h-4"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li> */}
            <li className="md:hidden">
              <div
                className=" is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Light/Dark"
              >
                <ThemeToggle></ThemeToggle>
                <span className="is-drawer-close:hidden">Light/Dark</span>
              </div>
            </li>
            <li>
              <NavLink
                to="/dashboard/my-profile"
                className=" is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Profile"
              >
                <CgProfile />
                <span className="is-drawer-close:hidden">My Profile</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogOut}
                className=" is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Logout"
              >
                <IoLogOut />

                <span className="is-drawer-close:hidden">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
