import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { hasAnyFunctionAccess, getAccessibleModules, getActiveModuleForUser, getModuleForFunction } from '../utils/moduleDetection';
import { Card } from '@/components/ui/card';

const HeaderDebugger: React.FC = () => {
  const { userRole } = usePermissions();

  if (!userRole) {
    return (
      <Card className="p-4 mb-4 bg-gray-50">
        <h3 className="font-bold text-red-600">Header Debugger</h3>
        <p>No user role data available</p>
      </Card>
    );
  }

  const hasAccess = hasAnyFunctionAccess(userRole);
  const accessibleModules = getAccessibleModules(userRole);
  const activeModule = getActiveModuleForUser(userRole);

  // Get all active functions for debugging
  const activeFunctions = userRole.lock_modules?.flatMap(module => 
    module.module_active === 1 ? 
      module.lock_functions.filter(func => func.function_active === 1).map(func => ({
        functionName: func.function_name,
        actionName: (func as any).action_name,
        mappedModule: getModuleForFunction(func.function_name),
        mappedModuleFromAction: (func as any).action_name ? getModuleForFunction((func as any).action_name) : null
      })) : []
  ) || [];

  return (
    <Card className="p-4 mb-4 bg-blue-50">
      <h3 className="font-bold text-blue-600 mb-3">Dynamic Header Debugger</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <strong>Has Any Function Access:</strong> 
          <span className={`ml-2 px-2 py-1 rounded ${hasAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {hasAccess ? 'YES' : 'NO'}
          </span>
        </div>
        
        <div>
          <strong>Accessible Modules:</strong>
          <div className="ml-2 mt-1">
            {accessibleModules.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {accessibleModules.map(module => (
                  <span key={module} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {module}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-red-600">None found</span>
            )}
          </div>
        </div>

        <div>
          <strong>Active Module (auto-selected):</strong> 
          <span className={`ml-2 px-2 py-1 rounded ${activeModule ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
            {activeModule || 'None'}
          </span>
        </div>

        <div>
          <strong>Active Functions ({activeFunctions.length}):</strong>
          <div className="ml-2 mt-1 max-h-32 overflow-y-auto">
            {activeFunctions.length > 0 ? (
              <div className="space-y-1">
                {activeFunctions.map((func, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                    <div><strong>Function:</strong> {func.functionName}</div>
                    {func.actionName && <div><strong>Action:</strong> {func.actionName}</div>}
                    <div><strong>Maps to:</strong> {func.mappedModule || 'No mapping'}</div>
                    {func.mappedModuleFromAction && func.mappedModuleFromAction !== func.mappedModule && (
                      <div><strong>Action maps to:</strong> {func.mappedModuleFromAction}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-red-600">No active functions found</span>
            )}
          </div>
        </div>

        <div>
          <strong>Raw User Role Modules:</strong>
          <details className="ml-2 mt-1">
            <summary className="cursor-pointer text-blue-600">Show Raw Data</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
              {JSON.stringify(userRole.lock_modules, null, 2)}
            </pre>
          </details>
        </div>

        <div className="pt-2 border-t">
          <strong>Expected Header Behavior:</strong>
          <div className="ml-2 mt-1">
            {!hasAccess ? (
              <div className="text-red-600">❌ Header should be HIDDEN (no function access)</div>
            ) : accessibleModules.length === 0 ? (
              <div className="text-red-600">❌ Header should be HIDDEN (no accessible modules)</div>
            ) : (
              <div className="text-green-600">✅ Header should show with modules: {accessibleModules.join(', ')}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeaderDebugger;
