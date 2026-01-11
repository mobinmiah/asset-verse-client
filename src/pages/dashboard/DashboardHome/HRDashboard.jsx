import React from 'react';
import { Helmet } from 'react-helmet';
import AssetTypePieChart from '../Charts/AssetTypePielChrat/AssetTypePielChrat';
import TopRequestedAssetsChart from '../Charts/TopRequestedAssetsChart/TopRequestedAssetsChart';
import DashboardStats from '../Charts/DashboardStats/DashboardStats';
import MonthlyTrendsChart from '../Charts/MonthlyTrendsChart/MonthlyTrendsChart';
import AssetStatusChart from '../Charts/AssetStatusChart/AssetStatusChart';

const HRDashboard = () => {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        <Helmet>
          <title>HR Dashboard - AssetVerse | Asset Management Overview</title>
          <meta name="description" content="HR Dashboard for AssetVerse. View asset statistics, employee requests, and manage your organization's assets efficiently." />
        </Helmet>
        
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
        
        {/* Reorganized Charts Section - Better Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Asset Type Pie Chart - Takes 1 column */}
          <div className="w-full">
            <AssetTypePieChart />
          </div>
          
          {/* Top Requested Assets - Takes 2 columns */}
          <div className="w-full lg:col-span-2">
            <TopRequestedAssetsChart />
          </div>
        </div>
        
        {/* Bottom Charts Section - Equal Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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