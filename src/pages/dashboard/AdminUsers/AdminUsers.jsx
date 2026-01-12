import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // Fetch all users with auto-refresh for real-time data
  const { data: usersData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching admin users...');
      const res = await axiosSecure.get('/users-for-admin'); // Get all users
      console.log('Admin users response:', res.data);
      return res.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
    refetchOnWindowFocus: true, // Refetch when window gains focus
    enabled: !!user?.email, // Only run query if user is logged in
  });

  // Filter users by search term
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(usersData)) return { hr: [], employee: [] };
    
    // If no search term, return all users
    if (!searchTerm.trim()) {
      return {
        hr: usersData.filter(user => user.role === 'hr'),
        employee: usersData.filter(user => user.role === 'employee')
      };
    }
    
    // Filter users based on search term (enhanced search)
    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = usersData.filter(user => {
      const searchFields = [
        user.name,
        user.email,
        user.companyName,
        user.department,
        user.phone,
        user.role,
        user.subscription
      ];
      
      return searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchLower)
      );
    });

    return {
      hr: filtered.filter(user => user.role === 'hr'),
      employee: filtered.filter(user => user.role === 'employee')
    };
  }, [usersData, searchTerm]);

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.delete(`/admin/users/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${user.name}? This action cannot be undone and will clean up all related data.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete user!'
    });

    if (result.isConfirmed) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUserDetails(user);
  };

  // User Card Component
  const UserCard = ({ user }) => (
    <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-all duration-200">
      <div className="card-body p-3">
        <div className="flex items-start gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              {user.companyLogo || user.photo || user.image ? (
                <img
                  src={user.companyLogo || user.photo || user.image}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=14C2ED&color=fff&size=40`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs rounded-full">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{user.name}</h3>
            <p className="text-xs text-base-content/70 truncate">{user.email}</p>
            {user.companyName && (
              <p className="text-xs text-primary truncate">{user.companyName}</p>
            )}
            
            <div className="flex items-center gap-1 mt-1">
              <span className={`badge badge-xs ${
                user.role === 'hr' ? 'badge-primary' : 'badge-secondary'
              }`}>
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-2 text-xs text-base-content/60">
          {user.role === 'hr' && (
            <div className="flex justify-between">
              <span>Employees: {user.currentEmployees || 0}</span>
              <span>Plan: {user.subscription || 'Basic'}</span>
            </div>
          )}
          {user.role === 'employee' && (
            <div>Assets: {user.assets?.length || 0}</div>
          )}
          <div className="mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => handleViewDetails(user)}
            className="btn btn-xs btn-info flex-1"
          >
            Details
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="btn btn-xs btn-error"
            disabled={deleteUserMutation.isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-error mb-2">
            Error Loading Users
          </h3>
          <p className="text-base-content/50 mb-4">
            {error.message || 'Failed to load users. Please try again.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>User Management - Admin | AssetVerse</title>
        <meta
          name="description"
          content="Manage all users across the AssetVerse platform."
        />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            User Management
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Manage all users across the platform ({usersData.length || 0} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search users by name, email, company, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-base-content/60 mt-2">
            Showing {filteredUsers.hr.length + filteredUsers.employee.length}{" "}
            results for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Total Users</div>
          <div className="stat-value text-2xl text-primary">
            {searchTerm
              ? filteredUsers.hr.length + filteredUsers.employee.length
              : usersData.length || 0}
          </div>
          <div className="stat-desc text-xs text-base-content/50 mt-1">
            {searchTerm ? "Filtered results" : "Real-time count"}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">HR Managers</div>
          <div className="stat-value text-2xl text-secondary">
            {filteredUsers.hr.length}
          </div>
          <div className="stat-desc text-xs text-base-content/50 mt-1">
            {searchTerm ? "In search results" : "Organization managers"}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-xl border border-base-300 p-4 shadow-md transform hover:scale-105 transition-all duration-200">
          <div className="stat-title text-sm">Employees</div>
          <div className="stat-value text-2xl text-accent">
            {filteredUsers.employee.length}
          </div>
          <div className="stat-desc text-xs text-base-content/50 mt-1">
            {searchTerm ? "In search results" : "Active workforce"}
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HR Managers Column */}
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">HR Managers</h2>
              <p className="text-sm text-base-content/70">
                {filteredUsers.hr.length} managers
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.hr.length === 0 ? (
              <div className="text-center py-8 text-base-content/50">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p>No HR managers found</p>
              </div>
            ) : (
              filteredUsers.hr.map((user) => (
                <UserCard key={user._id} user={user} />
              ))
            )}
          </div>
        </div>

        {/* Employees Column */}
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">Employees</h2>
              <p className="text-sm text-base-content/70">
                {filteredUsers.employee.length} employees
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.employee.length === 0 ? (
              <div className="text-center py-8 text-base-content/50">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <p>No employees found</p>
              </div>
            ) : (
              filteredUsers.employee.map((user) => (
                <UserCard key={user._id} user={user} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Professional User Details Modal */}
      {selectedUserDetails && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-2xl text-primary">User Details</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedUserDetails(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Photo Section */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {selectedUserDetails.companyLogo ||
                    selectedUserDetails.photo ||
                    selectedUserDetails.image ? (
                      <img
                        src={
                          selectedUserDetails.companyLogo ||
                          selectedUserDetails.photo ||
                          selectedUserDetails.image
                        }
                        alt={selectedUserDetails.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${selectedUserDetails.name}&background=14C2ED&color=fff&size=128`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl rounded-full">
                        {selectedUserDetails.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-lg">
                    {selectedUserDetails.name}
                  </h4>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <span
                      className={`badge ${
                        selectedUserDetails.role === "hr"
                          ? "badge-primary"
                          : "badge-secondary"
                      } badge-lg`}
                    >
                      {selectedUserDetails.role?.toUpperCase()}
                    </span>

                    {/* HR Asset Count */}
                    {selectedUserDetails.role === "hr" && (
                      <div className="text-sm text-base-content/70">
                        <span className="font-medium">Assets: </span>
                        <span className="font-semibold text-primary">
                          {selectedUserDetails.totalAssets || 0}
                        </span>
                      </div>
                    )}

                    {/* Delete User Button */}
                    <button
                      onClick={() => {
                        setSelectedUserDetails(null);
                        handleDeleteUser(selectedUserDetails);
                      }}
                      className="btn btn-error btn-sm mt-2"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete User
                    </button>
                  </div>
                </div>
              </div>

              {/* User Information Section */}
              <div className="md:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Basic Information
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between items-center lg:felx-none">
                      <span className="text-xs font-medium text-base-content/70">
                        Email:
                      </span>
                      <p className="text-sm font-semibold wrap-break-words">
                        {selectedUserDetails.email}
                      </p>
                    </div>
                    {selectedUserDetails.dateOfBirth && (
                      <div className="flex justify-between items-center lg:felx-none">
                        <span className="text-xs font-medium text-base-content/70">
                          Date of Birth:
                        </span>
                        <p className="text-sm font-semibold">
                          {selectedUserDetails.dateOfBirth}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center lg:felx-none">
                      <span className="text-xs font-medium text-base-content/70">
                        Joined:
                      </span>
                      <p className="text-sm font-semibold">
                        {new Date(
                          selectedUserDetails.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center lg:felx-none">
                      <span className="text-xs font-medium text-base-content/70">
                        Last Updated:
                      </span>
                      <p className="text-sm font-semibold">
                        {selectedUserDetails.updatedAt
                          ? new Date(
                              selectedUserDetails.updatedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedUserDetails.address && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-base-content/70">
                        Address:
                      </span>
                      <p className="text-sm font-semibold wrap-break-words">
                        {selectedUserDetails.address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Role-Specific Information */}
                {selectedUserDetails.role === "hr" && (
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
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
                      Organization Details
                    </h5>
                    <div className="md:flex justify-start md:justify-around items-center text-sm">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-base-content/70">
                            Company:
                          </span>
                          <p className="text-sm font-semibold wrap-break-words">
                            {selectedUserDetails.companyName}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-base-content/70">
                            Employees:
                          </span>
                          <p className="text-sm font-semibold">
                            {selectedUserDetails.currentEmployees || 0}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-base-content/70">
                            Package Limit:
                          </span>
                          <p className="text-sm font-semibold">
                            {selectedUserDetails.packageLimit || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="w-px h-16 bg-base-300 hidden md:block"></div>
                      <div>
                        {" "}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-base-content/70">
                            Subscription:
                          </span>
                          <p className="text-sm font-semibold">
                            {selectedUserDetails.subscription || "Basic"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-base-content/70">
                            Paid Plan:
                          </span>
                          <p className="text-sm font-semibold">
                            {selectedUserDetails.paid ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUserDetails.role === "employee" && (
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h5 className="font-semibold text-secondary mb-3 flex items-center gap-2">
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                      Employment Details
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs font-medium text-base-content/70">
                          Assets Assigned:
                        </span>
                        <p className="text-sm font-semibold">
                          {selectedUserDetails.assets?.length || 0}
                        </p>
                      </div>
                      {selectedUserDetails.department && (
                        <div>
                          <span className="text-xs font-medium text-base-content/70">
                            Department:
                          </span>
                          <p className="text-sm font-semibold">
                            {selectedUserDetails.department}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.affiliations &&
                        selectedUserDetails.affiliations.length > 0 && (
                          <div className="sm:col-span-2">
                            <span className="text-xs font-medium text-base-content/70">
                              Affiliations:
                            </span>
                            <div className="mt-2">
                              {selectedUserDetails.affiliations.map(
                                (affiliation, index) => (
                                  <div
                                    key={index}
                                    className="badge badge-outline mr-2 mb-1 text-xs"
                                  >
                                    {affiliation.companyName}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedUserDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedUserDetails(null)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;