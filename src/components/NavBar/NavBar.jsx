import React from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import useRole from "../../hooks/useRole";

const Navbar = () => {
  const { role } = useRole();
  const { user, LogOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const profileImage = profile.companyLogo || profile.photo;
  const navLinks = (
    <>
      <li>
        <NavLink to="/">
          Home
        </NavLink>
      </li>
      {!user && (
        <>
          <li>
            <NavLink to="/register-hr">Join as HR</NavLink>
          </li>
          <li>
            <NavLink to="/register-employee">Join as Employee</NavLink>
          </li>
        </>
      )}
      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}

      {role === "hr" && (
        <>
          <li>
            <NavLink to="/dashboard/asset-list">Asset List</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/add-asset">Add Asset</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/all-requests">All Requests</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/my-employees">My Employees</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/upgrade-package-hr">
              Upgrade Package
            </NavLink>
          </li>
        </>
      )}

      {role === "employee" && (
        <>
          <li>
            <NavLink to="/dashboard/my-assets">My Assets</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/request-asset">Request Asset</NavLink>
          </li>
        </>
      )}
      <li className="md:hidden">
        <div className="">
          <ThemeToggle />

          {user && (
            <button onClick={LogOut} className="btn btn-primary sm:btn-sm">
              Log out
            </button>
          )}
        </div>
      </li>
    </>
  );

  if (isLoading ) {
    return <Loading></Loading>;
  }
  return (
    <div className="sticky top-0 z-50">
      <nav className="navbar bg-base-100 shadow-xs shadow-neutral px-4 md:px-8 lg:px-12 rounded-sm">
        <div className="navbar-start gap-3">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-56 max-w-[90vw]"
            >
              {navLinks}
            </ul>
          </div>

          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 font-medium">{navLinks}</ul>
        </div>
        <div className="navbar-end gap-4">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/my-profile"
                className="tooltip tooltip-bottom"
                data-tip={`Go to Profile | ${profile.name || "User"}`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="User profile"
                    className="w-10 h-10 rounded-full ring-2 ring-primary/30 object-cover profile-image hover:ring-primary/50 transition-all duration-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold profile-image hover:bg-primary/30 transition-all duration-200">
                    {profile?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>

              <button
                onClick={LogOut}
                className="btn btn-primary hidden lg:block"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
