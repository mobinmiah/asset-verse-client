import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import useRole from "../../hooks/useRole";

const Navbar = () => {
  const { user, LogOut } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Get profile image with better fallback logic
  const profileImage = profile?.image || profile.companyLogo || profile.photo || user?.photoURL;
  
  // Get display name with better fallback logic
  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || "User";

  // Navigation links based on authentication and role
  const getNavLinks = () => {
    // For logged out users - only show basic pages
    if (!user) {
      return [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
        { to: "/help", label: "Help" }
      ];
    }

    // Base links for all authenticated users
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/help", label: "Help" }
    ];

    // Role-specific dashboard links
    const dashboardLinks = [];
    
    if (role === "admin") {
      dashboardLinks.push(
        { to: "/dashboard", label: "Admin Panel" },
        { to: "/dashboard/admin/users", label: "Users" },
        { to: "/dashboard/admin/organizations", label: "Organizations" },
        { to: "/dashboard/admin/assets", label: "All Assets" }
      );
    } else if (role === "hr") {
      dashboardLinks.push(
        { to: "/dashboard", label: "HR Dashboard" },
        { to: "/dashboard/add-asset", label: "Add Asset" },
        { to: "/dashboard/asset-list", label: "Assets" },
        { to: "/dashboard/all-requests", label: "Requests" },
        { to: "/dashboard/my-employees", label: "Employees" }
      );
    } else if (role === "employee") {
      dashboardLinks.push(
        { to: "/dashboard", label: "Dashboard" },
        { to: "/dashboard/my-assets", label: "My Assets" },
        { to: "/dashboard/request-asset", label: "Request" },
        { to: "/dashboard/my-team", label: "Team" }
      );
    }

    return [...baseLinks, ...dashboardLinks];
  };

  const navLinks = getNavLinks();

  // Render navigation links with responsive design
  const renderNavLinks = (isMobile = false) => {
    return navLinks.map((link) => (
      <li key={link.to}>
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `${
              isMobile
                ? "flex items-center px-3 py-2 text-sm font-medium rounded-md"
                : "text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 rounded-lg"
            } hover:bg-primary hover:text-white transition-all duration-200 ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <span className={isMobile ? "" : "hidden sm:inline"}>
            {link.label}
          </span>
        </NavLink>
      </li>
    ));
  };

  // Get user role badge
  const getRoleBadge = () => {
    if (!role) return null;
    
    const roleConfig = {
      admin: { label: "Admin", color: "badge-error" },
      hr: { label: "HR", color: "badge-primary" },
      employee: { label: "Employee", color: "badge-secondary" }
    };

    const config = roleConfig[role];
    if (!config) return null;

    return (
      <span className={`badge badge-xs ${config.color} text-white`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="sticky top-0 z-50 print:hidden">
      <nav className="navbar bg-base-100 shadow-sm px-2 sm:px-4 lg:px-6 xl:px-8 min-h-16">
        <div className="navbar-start">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 font-medium">
            {renderNavLinks()}
          </ul>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle for Desktop */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {user ? (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="rounded-full avatar hover:bg-primary-focus border-2 border-base-300 hover:border-primary transition-all duration-200"
                  aria-label="User menu"
                >
                  <div className="w-10 rounded-full">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="User profile"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">${displayName[0]?.toUpperCase()}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {displayName[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
                
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-base-100 rounded-box w-72 max-w-[90vw] border border-base-300 z-[1000]"
                >
                  {/* Mobile Navigation Links */}
                  <div className="lg:hidden mb-3">
                    <div className="text-xs font-semibold text-base-content/70 mb-2 px-2">
                      Navigation
                    </div>
                    {renderNavLinks(true)}
                    <div className="divider my-2"></div>
                  </div>
                  
                  {/* Profile Section */}
                  <li className="menu-title">
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold truncate">
                        {displayName}
                      </span>
                      {getRoleBadge()}
                    </div>
                  </li>
                  
                  {/* Profile Actions */}
                  <li>
                    <Link
                      to="/dashboard/my-profile"
                      className="flex items-center gap-3 py-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </Link>
                  </li>
                  
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 py-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {/* Role-specific quick actions */}
                  {role === "hr" && (
                    <li>
                      <Link
                        to="/dashboard/upgrade-package-hr"
                        className="flex items-center gap-3 py-2 text-accent"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Upgrade Plan</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Theme Toggle for Mobile */}
                  <li className="lg:hidden">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Theme</span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </li>
                  
                  <div className="divider my-2"></div>
                  
                  {/* Logout */}
                  <li>
                    <button
                      onClick={LogOut}
                      className="flex items-center gap-3 py-2 text-error hover:bg-error/10 w-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log out</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* Login/Register buttons for logged out users */
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-ghost btn-sm text-xs sm:text-sm"
                >
                  Log in
                </Link>
                <div className="dropdown dropdown-end">
                  <button 
                    tabIndex={0} 
                    className="btn btn-primary btn-sm text-xs sm:text-sm"
                  >
                    Join Now
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul 
                    tabIndex={0} 
                    className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-2 z-[1000]"
                  >
                    <li>
                      <Link 
                        to="/register-hr" 
                        className="flex items-center gap-3 py-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="font-medium">Join as HR</div>
                          <div className="text-xs text-base-content/70">Manage your organization</div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/register-employee" 
                        className="flex items-center gap-3 py-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <div className="font-medium">Join as Employee</div>
                          <div className="text-xs text-base-content/70">Access your workplace</div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
