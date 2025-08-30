import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

export const PermissionsSummaryPanel: React.FC = () => {
  const { userRole, loading, error } = usePermissions();

  if (loading) return <div className="p-4 bg-blue-50 rounded">Loading permissions...</div>;
  if (error) return <div className="p-4 bg-red-50 rounded text-red-600">Error: {error}</div>;
  if (!userRole || !userRole.lock_modules) return <div className="p-4 bg-yellow-50 rounded">No permission data</div>;

  // Calculate stats
  const totalModules = userRole.lock_modules.length;
  const activeModules = userRole.lock_modules.filter(m => m.module_active).length;
  const totalFunctions = userRole.lock_modules.reduce((sum, m) => sum + m.lock_functions.length, 0);
  const activeFunctions = userRole.lock_modules.reduce((sum, m) => 
    sum + m.lock_functions.filter(f => f.function_active).length, 0);
  const totalSubFunctions = userRole.lock_modules.reduce((sum, m) => 
    sum + m.lock_functions.reduce((fSum, f) => fSum + f.sub_functions.length, 0), 0);
  const enabledSubFunctions = userRole.lock_modules.reduce((sum, m) => 
    sum + m.lock_functions.reduce((fSum, f) => 
      fSum + f.sub_functions.filter(sf => sf.enabled).length, 0), 0);

  const getKeyFunctions = () => {
    const keyFunctions = [];
    userRole.lock_modules.forEach(module => {
      module.lock_functions.forEach(func => {
        if (func.function_active && ['Asset', 'Ticket', 'Service', 'Inventory', 'AMC', 'Attendance', 'Permits', 'Msafe', 'Visitors', 'Patrolling'].includes(func.function_name)) {
          keyFunctions.push({
            module: module.module_name,
            function: func.function_name,
            enabledSubFunctions: func.sub_functions.filter(sf => sf.enabled).length,
            totalSubFunctions: func.sub_functions.length
          });
        }
      });
    });
    return keyFunctions;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Dynamic Permissions Summary</h2>
      
      {/* Role Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h3 className="font-semibold text-lg text-blue-800">{userRole.role_name}</h3>
        <p className="text-sm text-blue-600">Role ID: {userRole.role_id} | Status: {userRole.active ? '✅ Active' : '❌ Inactive'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{activeModules}/{totalModules}</div>
          <div className="text-sm text-green-700">Active Modules</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{activeFunctions}/{totalFunctions}</div>
          <div className="text-sm text-blue-700">Active Functions</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{enabledSubFunctions}/{totalSubFunctions}</div>
          <div className="text-sm text-purple-700">Enabled Sub-Functions</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{Math.round((enabledSubFunctions/totalSubFunctions)*100)}%</div>
          <div className="text-sm text-orange-700">Coverage</div>
        </div>
      </div>

      {/* Key Functions */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-700">Key Module Functions Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {getKeyFunctions().map((item, index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50">
              <div className="font-medium text-sm text-gray-800">{item.function}</div>
              <div className="text-xs text-gray-600">{item.module}</div>
              <div className="text-xs mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.enabledSubFunctions > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.enabledSubFunctions}/{item.totalSubFunctions} enabled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Testing */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-700">How to Test Dynamically:</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>1. <strong>Use the sidebar:</strong> Items will show/hide based on your actual permissions</p>
          <p>2. <strong>API Debug Panel:</strong> Click "Show API Debug" to explore your permission structure</p>
          <p>3. <strong>Console Logging:</strong> Check browser console for real-time permission checks</p>
          <p>4. <strong>Interactive Tester:</strong> Use the eye icon tool to test specific combinations</p>
        </div>
        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
          <strong>Your API Structure:</strong> {userRole.lock_modules.length} modules → {totalFunctions} functions → {totalSubFunctions} sub-functions
        </div>
      </div>
    </div>
  );
};

export default PermissionsSummaryPanel;
