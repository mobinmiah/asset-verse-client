import React from 'react';
import useAuth from '../../../hooks/useAuth';

const EmployeeDashboard = () => {
      const { user, loading } = useAuth();
      if (loading) {
        return <div><p>Loaging.....</p></div>;
      }
      return (
        <div className="m-2 p-3 bg-base-100 rounded-lg">
          <h3>{user.displayName || user.providerData.displayName} (User)</h3>
        </div>
      );
};

export default EmployeeDashboard;