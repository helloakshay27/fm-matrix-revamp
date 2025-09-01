import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { permissionService } from '../services/permissionService';
import { getModuleForFunction } from '../utils/moduleDetection';

const FmUserDebugTest: React.FC = () => {
  const { userRole } = usePermissions();

  if (!userRole) {
    return <div className="p-4 bg-red-100 text-red-700">No user role available</div>;
  }

  // Check "Fm User" function specifically
  const fmUserFunction = userRole.lock_modules
    ?.flatMap(m => m.lock_functions)
    ?.find(f => f.function_name.toLowerCase() === 'fm user');

  const fmUserHasAccess = permissionService.isFunctionEnabled(
    userRole,
    'Master',
    'fm user'
  );

  const fmUserModuleMapping = getModuleForFunction('fm user');
  
  // Test various function name variants
  const testVariants = ['Fm User', 'fm user', 'fm_user', 'fm-user', 'fmuser'];
  const variantResults = testVariants.map(variant => ({
    variant,
    hasAccess: permissionService.isFunctionEnabled(userRole, 'Master', variant),
    moduleMapping: getModuleForFunction(variant),
    generatedVariants: permissionService.generateFunctionNameVariants(variant)
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">FM User Debug Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Function Details</h3>
        <div className="bg-gray-100 p-3 rounded text-sm">
          <p><strong>Function Found:</strong> {fmUserFunction ? 'Yes' : 'No'}</p>
          {fmUserFunction && (
            <>
              <p><strong>Function ID:</strong> {fmUserFunction.function_id}</p>
              <p><strong>Function Name:</strong> "{fmUserFunction.function_name}"</p>
              <p><strong>Function Active:</strong> {fmUserFunction.function_active === 1 ? 'Yes' : 'No'}</p>
              <p><strong>Action Name:</strong> "{(fmUserFunction as any).action_name || 'N/A'}"</p>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Access Check</h3>
        <div className="bg-gray-100 p-3 rounded text-sm">
          <p><strong>Has Access:</strong> {fmUserHasAccess ? 'Yes' : 'No'}</p>
          <p><strong>Module Mapping:</strong> "{fmUserModuleMapping || 'None'}"</p>
          <p><strong>Expected Module:</strong> "Master"</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Variant Testing</h3>
        <div className="space-y-3">
          {variantResults.map((result, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded border">
              <p><strong>Variant:</strong> "{result.variant}"</p>
              <p><strong>Has Access:</strong> {result.hasAccess ? 'Yes' : 'No'}</p>
              <p><strong>Module Mapping:</strong> "{result.moduleMapping || 'None'}"</p>
              <p><strong>Generated Variants:</strong> [{result.generatedVariants.slice(0, 10).join(', ')}]</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">All Available Functions</h3>
        <div className="bg-gray-100 p-3 rounded text-xs max-h-40 overflow-y-auto">
          {userRole.lock_modules?.map(module => 
            module.lock_functions
              .filter(f => f.function_active === 1)
              .map(func => (
                <div key={func.function_id} className="mb-1">
                  <strong>{func.function_name}</strong> (ID: {func.function_id}, Module: {module.module_name})
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FmUserDebugTest;
