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
        <NavLink 
          to="/"
          className="text-sm sm:text-base font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
        >
          Home
        </NavLink>
      </li>
      {!user && (
        <>
          <li>
            <NavLink 
              to="/register-hr"
              className="text-sm sm:text-base font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Join as HR
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/register-employee"
              className="text-sm sm:text-base font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Join as Employee
            </NavLink>
          </li>
        </>
      )}
      {user && (
        <li>
          <NavLink 
            to="/dashboard"
            className="text-sm sm:text-base font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
          >
            Dashboard
          </NavLink>
        </li>
      )}

      {role === "hr" && (
        <>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/asset-list"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Asset List
            </NavLink>
          </li>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/add-asset"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Add Asset
            </NavLink>
          </li>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/all-requests"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              All Requests
            </NavLink>
          </li>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/my-employees"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              My Employees
            </NavLink>
          </li>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/upgrade-package-hr"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Upgrade Package
            </NavLink>
          </li>
        </>
      )}

      {role === "employee" && (
        <>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/my-assets"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              My Assets
            </NavLink>
          </li>
          <li className="hidden xl:block">
            <NavLink 
              to="/dashboard/request-asset"
              className="text-sm font-medium px-2 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Request Asset
            </NavLink>
          </li>
        </>
      )}
      
      {/* Mobile-only items */}
      <li className="lg:hidden">
        <div className="flex flex-col space-y-2 p-2">
          <ThemeToggle />
          {user && (
            <button 
              onClick={LogOut} 
              className="btn btn-primary btn-sm w-full"
            >
              Log out
            </button>
          )}
        </div>
      </li>
    </>
  );

  if (isLoading) {
    return <Loading></Loading>;
  }
  
  return (
    <div className="sticky top-0 z-50">
      <nav className="navbar bg-base-100 shadow-sm px-2 sm:px-4 lg:px-6 xl:px-8 rounded-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm lg:hidden"
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
              className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-base-100 rounded-box w-64 max-w-[90vw] border border-base-300"
            >
              {navLinks}
            </ul>
          </div>

          <Logo />
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 font-medium">
            {navLinks}
          </ul>
        </div>
        
        <div className="navbar-end">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/dashboard/my-profile"
                  className="tooltip tooltip-bottom"
                  data-tip={`Go to Profile | ${profile.name || "User"}`}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User profile"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/30 object-cover profile-image hover:ring-primary/50 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold profile-image hover:bg-primary/30 transition-all duration-200 text-xs sm:text-sm">
                      {profile?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </Link>

                <button
                  onClick={LogOut}
                  className="btn btn-primary btn-sm sm:btn-md hidden lg:flex"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary btn-sm sm:btn-md"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
