import React from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });
  console.log(profile)
 const profileImage = profile.companyLogo || profile.photo;
  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/register-hr">Join as HR</NavLink>
      </li>
      <li>
        <NavLink to="/register-employee">Join as Employee</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
      <li className="md:hidden">
        <div className="">
          <ThemeToggle />

          <button onClick={logOut} className="btn btn-primary sm:btn-sm">
            Log out
          </button>
        </div>
      </li>
    </>
  );
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="sticky top-0 z-50">
      <nav className="navbar bg-base-100 shadow-xs shadow-neutral px-4 md:px-8 lg:px-12 rounded-sm">
        <div className="navbar-start gap-3">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost md:hidden"
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
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-2 font-medium">{navLinks}</ul>
        </div>
        <div className="navbar-end gap-4">
          <div className="hidden md:block">
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
                    className="w-10 h-10 rounded-full ring-2 ring-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {profile?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>

              <button
                onClick={logOut}
                className="btn btn-primary hidden md:block"
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
