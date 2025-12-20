import React from 'react';
import RequestAnAsset from '../RequestAnAsset/RequestAnAsset';

const EmployeeDashboard = () => {
   
      return (
        <div className="m-2 p-3 bg-base-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-primary">
            Employee Dashboard
          </h2>
          <RequestAnAsset></RequestAnAsset>
        </div>
      );
};

export default EmployeeDashboard;