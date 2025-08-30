import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useLocation } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

export const DynamicPermissionChecker: React.FC = () => {
  const { userRole, loading, error, refreshPermissions, isModuleEnabled, isFunctionEnabled, isSubFunctionEnabled, hasPermissionForPath } = usePermissions();
  const [isVisible, setIsVisible] = useState(false);
  const [testModule, setTestModule] = useState('safety');
  const [testFunction, setTestFunction] = useState('M Safe');
  const [testSubFunction, setTestSubFunction] = useState('m_safe_all');
  const [testPath, setTestPath] = useState('/safety/m-safe');
  const location = useLocation();

  // Real-time permission checks
  const [permissionResults, setPermissionResults] = useState({
    module: false,
    function: false,
    subFunction: false,
    path: false
  });

  useEffect(() => {
    if (userRole) {
      setPermissionResults({
        module: isModuleEnabled(testModule),
        function: isFunctionEnabled(testModule, testFunction),
        subFunction: isSubFunctionEnabled(testModule, testFunction, testSubFunction),
        path: hasPermissionForPath(testPath)
      });
    }
  }, [userRole, testModule, testFunction, testSubFunction, testPath, isModuleEnabled, isFunctionEnabled, isSubFunctionEnabled, hasPermissionForPath]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg z-50 transition-colors"
        title="Show Dynamic Permission Checker"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Dynamic Permission Checker</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPermissions}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh Permissions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Hide Permission Checker"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-blue-600 mb-2 flex items-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Loading permissions...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 mb-2 p-2 bg-red-50 rounded">
          Error: {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Current Page Info */}
        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
          <strong>Current Page:</strong> {location.pathname}
        </div>

        {/* User Role Info */}
        {userRole && (
          <div className="text-xs p-2 bg-green-50 rounded">
            <strong>Role:</strong> {userRole.role_name} (ID: {userRole.role_id})
            <br />
            <strong>Active:</strong> {userRole.active ? 'Yes' : 'No'}
            <br />
            <strong>Modules:</strong> {userRole.lock_modules.length}
          </div>
        )}

        {/* Dynamic Permission Testing */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Test Permissions</h4>
          
          {/* Module Test */}
          <div>
            <label className="text-xs text-gray-600">Module:</label>
            <input
              type="text"
              value={testModule}
              onChange={(e) => setTestModule(e.target.value)}
              className="w-full text-xs p-1 border rounded mt-1"
              placeholder="e.g., safety"
            />
            <div className={`text-xs mt-1 ${permissionResults.module ? 'text-green-600' : 'text-red-600'}`}>
              {permissionResults.module ? '✅ Enabled' : '❌ Disabled'}
            </div>
          </div>

          {/* Function Test */}
          <div>
            <label className="text-xs text-gray-600">Function:</label>
            <input
              type="text"
              value={testFunction}
              onChange={(e) => setTestFunction(e.target.value)}
              className="w-full text-xs p-1 border rounded mt-1"
              placeholder="e.g., M Safe"
            />
            <div className={`text-xs mt-1 ${permissionResults.function ? 'text-green-600' : 'text-red-600'}`}>
              {permissionResults.function ? '✅ Enabled' : '❌ Disabled'}
            </div>
          </div>

          {/* Sub-Function Test */}
          <div>
            <label className="text-xs text-gray-600">Sub-Function:</label>
            <input
              type="text"
              value={testSubFunction}
              onChange={(e) => setTestSubFunction(e.target.value)}
              className="w-full text-xs p-1 border rounded mt-1"
              placeholder="e.g., m_safe_all"
            />
            <div className={`text-xs mt-1 ${permissionResults.subFunction ? 'text-green-600' : 'text-red-600'}`}>
              {permissionResults.subFunction ? '✅ Enabled' : '❌ Disabled'}
            </div>
          </div>

          {/* Path Test */}
          <div>
            <label className="text-xs text-gray-600">Path:</label>
            <input
              type="text"
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              className="w-full text-xs p-1 border rounded mt-1"
              placeholder="e.g., /safety/m-safe"
            />
            <div className={`text-xs mt-1 ${permissionResults.path ? 'text-green-600' : 'text-red-600'}`}>
              {permissionResults.path ? '✅ Accessible' : '❌ Not Accessible'}
            </div>
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-700">Quick Tests</h4>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                setTestModule('safety');
                setTestFunction('M Safe');
                setTestSubFunction('m_safe_all');
                setTestPath('/safety/m-safe');
              }}
              className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
            >
              Test Safety
            </button>
            <button
              onClick={() => {
                setTestModule('maintenance');
                setTestFunction('ticket');
                setTestSubFunction('ticket_all');
                setTestPath('/maintenance/ticket');
              }}
              className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded transition-colors"
            >
              Test Maintenance
            </button>
            <button
              onClick={() => {
                setTestModule('security');
                setTestFunction('gate_pass');
                setTestSubFunction('gate_pass_all');
                setTestPath('/security/gate-pass');
              }}
              className="text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
            >
              Test Security
            </button>
            <button
              onClick={() => {
                setTestModule('finance');
                setTestFunction('procurement');
                setTestSubFunction('pr_sr');
                setTestPath('/finance/procurement');
              }}
              className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded transition-colors"
            >
              Test Finance
            </button>
          </div>
        </div>

        {/* Available Modules */}
        {userRole && userRole.lock_modules.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-700">Available Modules</h4>
            <div className="text-xs space-y-1">
              {userRole.lock_modules.map((module) => (
                <div key={module.module_id} className={`p-1 rounded ${module.module_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {module.module_name} ({module.lock_functions.length} functions)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
