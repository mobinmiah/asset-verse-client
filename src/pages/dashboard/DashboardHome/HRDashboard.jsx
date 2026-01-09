import React from 'react';
import AssetTypePieChart from '../Charts/AssetTypePielChrat/AssetTypePielChrat';
import TopRequestedAssetsChart from '../Charts/TopRequestedAssetsChart/TopRequestedAssetsChart';
import DashboardStats from '../Charts/DashboardStats/DashboardStats';
import MonthlyTrendsChart from '../Charts/MonthlyTrendsChart/MonthlyTrendsChart';
import AssetStatusChart from '../Charts/AssetStatusChart/AssetStatusChart';

const HRDashboard = () => {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
            HR Dashboard
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Overview of your organization's asset management
          </p>
        </div>
        
        {/* Statistics Cards - Fully Responsive */}
        <div className="w-full">
          <DashboardStats />
        </div>
        
        {/* Main Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <div className="w-full">
            <AssetTypePieChart />
          </div>
          <div className="w-full">
            <TopRequestedAssetsChart />
          </div>
        </div>
        
        {/* Secondary Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <div className="w-full">
            <MonthlyTrendsChart />
          </div>
          <div className="w-full">
            <AssetStatusChart />
          </div>
        </div>
      </div>
    );
};

export default HRDashboard;