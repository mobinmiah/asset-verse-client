import React from 'react';
import DashboardStats from '../Charts/DashboardStats/DashboardStats';

const EmployeeDashboard = () => {
   
      return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
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
          
          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">📝</div>
                <h3 className="text-lg font-semibold text-primary mb-2">Request Asset</h3>
                <p className="text-sm text-base-content/70 mb-4">Submit a new asset request</p>
                <button className="btn btn-primary btn-sm w-full">
                  Make Request
                </button>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">💼</div>
                <h3 className="text-lg font-semibold text-primary mb-2">My Assets</h3>
                <p className="text-sm text-base-content/70 mb-4">View your assigned assets</p>
                <button className="btn btn-outline btn-primary btn-sm w-full">
                  View Assets
                </button>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-primary mb-2">My Team</h3>
                <p className="text-sm text-base-content/70 mb-4">Connect with team members</p>
                <button className="btn btn-outline btn-primary btn-sm w-full">
                  View Team
                </button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default EmployeeDashboard;