import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import DashboardStats from '../Charts/DashboardStats/DashboardStats';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const handleRequestAsset = () => {
    navigate('/dashboard/request-asset');
  };

  const handleViewMyAssets = () => {
    navigate('/dashboard/my-assets');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <Helmet>
        <title>Employee Dashboard - AssetVerse | Your Asset Overview</title>
        <meta name="description" content="Employee Dashboard for AssetVerse. View your assigned assets, request new assets, and manage your asset-related activities." />
      </Helmet>
      
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
          Employee Dashboard
        </h2>
        <p className="text-sm sm:text-base text-base-content/70">
          Your personal asset overview and quick actions
        </p>
      </div>
      
      {/* Statistics Cards - Fully Responsive */}
      <div className="w-full">
        <DashboardStats />
      </div>
      
      {/* Quick Actions Section - 2 Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        <div 
          className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border border-base-300 hover:border-primary"
          onClick={handleRequestAsset}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-primary mb-2">Request Asset</h3>
            <p className="text-sm text-base-content/70 mb-4">Submit a new asset request to your HR</p>
            <div className="btn btn-primary btn-sm w-full">
              Make Request
            </div>
          </div>
        </div>
        
        <div 
          className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border border-base-300 hover:border-primary"
          onClick={handleViewMyAssets}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3">💼</div>
            <h3 className="text-lg font-semibold text-primary mb-2">My Assets</h3>
            <p className="text-sm text-base-content/70 mb-4">View and manage your assigned assets</p>
            <div className="btn btn-outline btn-primary btn-sm w-full">
              View Assets
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;