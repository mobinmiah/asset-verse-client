import React from 'react';
import AssetList from '../AssetList/AssetList';
import AssetTypePieChart from '../Charts/AssetTypePielChrat/AssetTypePielChrat';
import TopRequestedAssetsChart from '../Charts/TopRequestedAssetsChart/TopRequestedAssetsChart';

const HRDashboard = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          HR Dashboard
        </h2>
        <div className='grid grid-rows-1 grid-cols-2 gap-3 mb-4'>
          <AssetTypePieChart></AssetTypePieChart>
          <TopRequestedAssetsChart></TopRequestedAssetsChart>
        </div>
        <AssetList />
      </div>
    );
};

export default HRDashboard;