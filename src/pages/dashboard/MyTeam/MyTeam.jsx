import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Loading } from "../../../components/LoadingStates/LoadingStates";

const MyTeam = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch companies the employee is affiliated with
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["myCompanies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/companies/my");
      return res.data;
    },
  });

  // Fetch team members for selected company
  const { data: team = [], isLoading: teamLoading } = useQuery({
    queryKey: ["team", selectedCompany],
    enabled: !!selectedCompany,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/company/${selectedCompany}`);
      return res.data;
    },
  });

  // Filter team members based on search term
  const filteredTeam = useMemo(() => {
    if (!searchTerm.trim()) return team;
    
    return team.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.position && member.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [team, searchTerm]);

  // Get current month birthdays
  const currentMonth = new Date().getMonth();
  const upcomingBirthdays = team.filter(
    (member) => member.dateOfBirth && new Date(member.dateOfBirth).getMonth() === currentMonth
  );

  // Get selected company info
  const selectedCompanyInfo = companies.find(c => c.hrEmail === selectedCompany);

  // Auto-select first company if only one exists
  React.useEffect(() => {
    if (companies.length === 1 && !selectedCompany) {
      setSelectedCompany(companies[0].hrEmail);
    }
  }, [companies, selectedCompany]);

  if (companiesLoading) {
    return <Loading text="Loading your companies..." />;
  }

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>My Team - AssetVerse | View Your Team Members</title>
        <meta name="description" content="View and connect with your team members across different organizations." />
      </Helmet>

      {/* Header */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
              My Team
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base">
              Connect with your colleagues and team members
              {selectedCompanyInfo && ` at ${selectedCompanyInfo.companyName}`}
            </p>
          </div>

          {/* Company Selector */}
          {companies.length > 1 && (
            <div className="w-full lg:w-80">
              <label className="label">
                <span className="label-text font-medium">Select Company</span>
              </label>
              <select
                className="select select-bordered w-full focus:select-primary"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSearchTerm(""); // Clear search when changing company
                }}
              >
                <option value="">Choose a company...</option>
                {companies.map((company, index) => (
                  <option key={index} value={company.hrEmail}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* No Companies State */}
      {companies.length === 0 && (
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-8 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Company Affiliations</h3>
          <p className="text-base-content/50">
            You are not currently affiliated with any companies. Contact your HR manager to get added to a team.
          </p>
        </div>
      )}

      {/* Company Selection Required */}
      {companies.length > 0 && !selectedCompany && (
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-base-content/70 mb-2">Select a Company</h3>
          <p className="text-base-content/50">
            Choose a company from the dropdown above to view your team members.
          </p>
        </div>
      )}

      {/* Team Content */}
      {selectedCompany && (
        <>
          {/* Search and Stats */}
          <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="stat bg-primary/10 rounded-lg p-3">
                  <div className="stat-title text-xs">Team Size</div>
                  <div className="stat-value text-lg text-primary">{team.length}</div>
                </div>
                {upcomingBirthdays.length > 0 && (
                  <div className="stat bg-accent/10 rounded-lg p-3">
                    <div className="stat-title text-xs">Birthdays This Month</div>
                    <div className="stat-value text-lg text-accent">{upcomingBirthdays.length}</div>
                  </div>
                )}
              </div>

              {/* Search */}
              {team.length > 0 && (
                <div className="form-control w-full sm:w-80">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input input-bordered w-full pr-10 focus:input-primary"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {searchTerm ? (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-base-content/50 hover:text-base-content"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : (
                        <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <p className="text-sm text-base-content/60">
                Showing {filteredTeam.length} of {team.length} team members
              </p>
            )}
          </div>

          {/* Loading State */}
          {teamLoading && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-8">
              <Loading text="Loading team members..." />
            </div>
          )}

          {/* No Team Members */}
          {!teamLoading && team.length === 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-8 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Team Members</h3>
              <p className="text-base-content/50">
                No other employees found for {selectedCompanyInfo?.companyName}. You might be the first team member!
              </p>
            </div>
          )}

          {/* No Search Results */}
          {!teamLoading && team.length > 0 && filteredTeam.length === 0 && searchTerm && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Results Found</h3>
              <p className="text-base-content/50">
                No team members match your search for "{searchTerm}". Try a different search term.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-primary btn-sm mt-4"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Team Members Grid */}
          {!teamLoading && filteredTeam.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6 mb-6">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Members ({filteredTeam.length})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTeam.map((member) => (
                  <div
                    key={member._id}
                    className="card bg-base-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="card-body p-4 text-center">
                      {/* Avatar */}
                      <div className="avatar mx-auto mb-3">
                        <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=14C2ED&color=fff&size=64`;
                            }}
                          />
                        </div>
                      </div>

                      {/* Member Info */}
                      <h3 className="font-bold text-base text-base-content line-clamp-1" title={member.name}>
                        {member.name}
                      </h3>
                      <p className="text-sm text-base-content/70 line-clamp-1" title={member.email}>
                        {member.email}
                      </p>

                      {/* Position Badge */}
                      <div className="mt-2">
                        <span className="badge badge-primary badge-sm">
                          {member.position || "Employee"}
                        </span>
                      </div>

                      {/* Birthday Indicator */}
                      {member.dateOfBirth && new Date(member.dateOfBirth).getMonth() === currentMonth && (
                        <div className="mt-2">
                          <span className="badge badge-accent badge-sm">
                            🎂 Birthday This Month
                          </span>
                        </div>
                      )}

                      {/* You Indicator */}
                      {member.email === user?.email && (
                        <div className="mt-2">
                          <span className="badge badge-success badge-sm">
                            You
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Birthdays Section */}
          {upcomingBirthdays.length > 0 && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                🎂 Birthdays This Month ({upcomingBirthdays.length})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBirthdays.map((member) => (
                  <div
                    key={member._id}
                    className="card bg-accent/10 border border-accent/20 shadow-sm"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=F59E0B&color=fff&size=48`;
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base-content line-clamp-1">
                            {member.name}
                          </h4>
                          <p className="text-sm text-base-content/70">
                            {new Date(member.dateOfBirth).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-2xl">🎉</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTeam;
