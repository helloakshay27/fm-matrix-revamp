import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

export const PermissionsDebugger: React.FC = () => {
  const { userRole, loading, error } = usePermissions();

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg max-w-md">
        <h3 className="font-semibold text-sm mb-2">Permissions Debug</h3>
        <p className="text-sm text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 p-4 border border-red-200 rounded shadow-lg max-w-md">
        <h3 className="font-semibold text-sm mb-2 text-red-800">Permissions Debug - Error</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-50 p-4 border border-yellow-200 rounded shadow-lg max-w-md">
        <h3 className="font-semibold text-sm mb-2 text-yellow-800">Permissions Debug</h3>
        <p className="text-sm text-yellow-600">No user role data available</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 p-4 border border-green-200 rounded shadow-lg max-w-md max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-2 text-green-800">Permissions Debug</h3>
      <div className="space-y-2 text-xs">
        <div>
          <strong>Role:</strong> {userRole.role_name} (ID: {userRole.role_id})
        </div>
        <div>
          <strong>Active:</strong> {userRole.active ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Modules ({userRole.lock_modules.length}):</strong>
          <ul className="ml-2 mt-1">
            {userRole.lock_modules.map((module) => (
              <li key={module.module_id} className="mb-1">
                <strong>{module.module_name}</strong> (Active: {module.module_active ? 'Yes' : 'No'})
                <ul className="ml-2">
                  {module.lock_functions.map((func) => (
                    <li key={func.function_id} className="mb-1">
                      <em>{func.function_name}</em> (Active: {func.function_active ? 'Yes' : 'No'})
                      <ul className="ml-2">
                        {func.sub_functions.map((subFunc) => (
                          <li key={subFunc.sub_function_id} className="text-xs">
                            {subFunc.sub_function_name}: {subFunc.enabled ? '✅' : '❌'}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Toggle component to show/hide the debugger
export const PermissionsDebugToggle: React.FC = () => {
  const [showDebugger, setShowDebugger] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="fixed top-20 right-4 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs z-50"
      >
        {showDebugger ? 'Hide' : 'Show'} Permissions Debug
      </button>
      {showDebugger && <PermissionsDebugger />}
    </>
  );
};
