import React from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Logo from "../Logo/Logo";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const photo = user?.photoURL || user?.providerData[0]?.photoURL;
console.log(user)
  const handleLogOut = () => {
    logOut();
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className="px-3 py-2 rounded-sm font-semibold text-primary hover:bg-primary/10 transition"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/register-hr"
          className="px-3 py-2 rounded-sm font-semibold text-primary hover:bg-primary/10 transition"
        >
          Join as HR
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/register-employee"
          className="px-3 py-2 rounded-sm font-semibold text-primary hover:bg-primary/10 transition"
        >
          Join as Employee
        </NavLink>
      </li>
      <li className="md:hidden mt-2">
        <ThemeToggle />
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="navbar bg-base-100 shadow-xs shadow-neutral px-4 sm:px-6 lg:px-10 rounded-sm">
        {/* Left */}
        <div className="navbar-start gap-2">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost md:hidden">
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
              className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-56"
            >
              {navLinks}
            </ul>
          </div>

          <Logo />
        </div>

        {/* Center */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-2">{navLinks}</ul>
        </div>

        {/* Right */}
        <div className="navbar-end gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div>
            {user ? (
              <div className="flex justify-between items-center gap-3">
                <Link to="/dashboard">
                  {photo ? (
                    <img
                      className="w-10 h-10 rounded-full bg-primary"
                      src={photo}
                      alt={
                        user?.displayName || user?.providerData[0]?.displayName
                      }
                      title={
                        user?.displayName || user?.providerData[0]?.displayName
                      }
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary"></div>
                  )}
                </Link>
                <button
                  onClick={handleLogOut}
                  className="btn btn-primary btn-sm sm:btn-md"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn bg-primary">
                Log In
              </Link>
            )}
          </div>
          {/* <div>
            {user ? (
              <button
                onClick={handleLogOut}
                className="btn btn-primary btn-sm sm:btn-md"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
                Login
              </Link>
            )}
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
