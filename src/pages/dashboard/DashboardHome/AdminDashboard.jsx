import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Loading, StatsSkeleton } from '../../../components/LoadingStates/LoadingStates';
import StatCard from '../../../components/StatCard/StatCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch admin overview stats
  const { data: overview = {}, isLoading: overviewLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/analytics/overview');
      return res.data;
    },
  });

  // Fetch admin asset analytics for charts
  const { data: assetAnalytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-asset-analytics'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/analytics/assets');
      return res.data;
    },
  });

  const COLORS = ['#14C2ED', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (overviewLoading) {
    return <Loading text="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Helmet>
        <title>Admin Dashboard - AssetVerse | System Overview</title>
        <meta name="description" content="Admin Dashboard for AssetVerse. Monitor system-wide analytics, manage users, organizations, and oversee platform operations." />
      </Helmet>
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-base-content/70">
          System-wide overview and analytics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/dashboard/admin/users')}
          className="cursor-pointer transform hover:scale-100 transition-all duration-200"
        >
          <StatCard
            title="Total Users"
            value={overview.totalUsers || 0}
            icon="👥"
            color="primary"
            trend="up"
          
          />
        </div>
        <div 
          onClick={() => navigate('/dashboard/admin/organizations')}
          className="cursor-pointer transform hover:scale-100 transition-all duration-200"
        >
          <StatCard
            title="Organizations"
            value={overview.totalHRs || 0}
            icon="🏢"
            color="secondary"
            trend="up"
          
          />
        </div>
        <div 
          onClick={() => navigate('/dashboard/admin/assets')}
          className="cursor-pointer transform hover:scale-100 transition-all duration-200"
        >
          <StatCard
            title="Total Assets"
            value={overview.totalAssets || 0}
            icon="📦"
            color="accent"
            trend="up"
            
          />
        </div>
        <StatCard
          title="Total Requests"
          value={overview.totalRequests || 0}
          icon="📋"
          color="info"
          trend={overview.pendingRequests > 0 ? "up" : "neutral"}
         
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="HR Managers"
          value={overview.totalHRs || 0}
          icon="👔"
          color="primary"
        />
        <StatCard
          title="Employees"
          value={overview.totalEmployees || 0}
          icon="👨‍💼"
          color="secondary"
        />
        <StatCard
          title="Approved Requests"
          value={overview.approvedRequests || 0}
          icon="✅"
          color="success"
        />
        <StatCard
          title="Pending Requests"
          value={overview.pendingRequests || 0}
          icon="⏳"
          color="warning"
        />
      </div>

      {/* Analytics Charts Section */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StatsSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Asset Type Distribution */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold mb-4 text-primary">Asset Type Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAnalytics.assetTypes || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(assetAnalytics.assetTypes || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Asset Status Distribution */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold mb-4 text-primary">Asset Availability Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetAnalytics.assetStatus || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#14C2ED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Organizations by Assets */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold mb-4 text-primary">Top Organizations by Assets</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetAnalytics.topOrganizations || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="assets" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Asset Creation Trends */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold mb-4 text-primary">Asset Creation Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={assetAnalytics.monthlyTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="assets" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;