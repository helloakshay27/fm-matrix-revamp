import React, { useState } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

export const ApiPermissionsDebugger: React.FC = () => {
  const { userRole, loading, error } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');

  if (loading) {
    return (
      <div className="fixed bottom-4 left-4 bg-white p-4 border rounded shadow-lg max-w-md z-50">
        <h3 className="font-semibold text-sm mb-2">API Permissions Debug</h3>
        <p className="text-sm text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-50 p-4 border border-red-200 rounded shadow-lg max-w-md z-50">
        <h3 className="font-semibold text-sm mb-2 text-red-800">API Permissions Debug - Error</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!userRole || !userRole.lock_modules) {
    return (
      <div className="fixed bottom-4 left-4 bg-yellow-50 p-4 border border-yellow-200 rounded shadow-lg max-w-md z-50">
        <h3 className="font-semibold text-sm mb-2 text-yellow-800">API Permissions Debug</h3>
        <p className="text-sm text-yellow-600">No user role data available</p>
      </div>
    );
  }

  const filteredModules = userRole.lock_modules.filter(module =>
    module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.lock_functions.some(func => 
      func.function_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getModule = (moduleName: string) => {
    return userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
  };

  const getFunction = (moduleName: string, functionName: string) => {
    const module = getModule(moduleName);
    return module?.lock_functions.find(f => 
      f.function_name.toLowerCase() === functionName.toLowerCase()
    );
  };

  const testPermission = (moduleName: string, functionName?: string, subFunctionName?: string) => {
    const module = getModule(moduleName);
    if (!module || !module.module_active) {
      return { result: false, reason: `Module "${moduleName}" not found or inactive` };
    }

    if (functionName) {
      const func = getFunction(moduleName, functionName);
      if (!func || !func.function_active) {
        return { result: false, reason: `Function "${functionName}" not found or inactive` };
      }

      if (subFunctionName) {
        const subFunc = func.sub_functions.find(sf => 
          sf.sub_function_name === subFunctionName
        );
        if (!subFunc || !subFunc.enabled || !subFunc.sub_function_active) {
          return { result: false, reason: `Sub-function "${subFunctionName}" not found, disabled, or inactive` };
        }
      }
    }

    return { result: true, reason: 'Permission granted' };
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 border rounded shadow-lg max-w-2xl max-h-96 overflow-y-auto z-50">
      <h3 className="font-semibold text-sm mb-2 text-green-800">API Permissions Debug</h3>
      
      <div className="space-y-3 text-xs">
        {/* Role Info */}
        <div className="bg-blue-50 p-2 rounded">
          <strong>Role:</strong> {userRole.role_name} (ID: {userRole.role_id})<br/>
          <strong>Active:</strong> {userRole.active ? 'Yes' : 'No'}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search modules/functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 border rounded text-xs"
        />

        {/* Permission Tester */}
        <div className="bg-gray-50 p-2 rounded">
          <h4 className="font-semibold mb-2">Quick Permission Test</h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Module</label>
              <select 
                value={selectedModule} 
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded"
              >
                <option value="">Select Module</option>
                {userRole.lock_modules.map(module => (
                  <option key={module.module_id} value={module.module_name}>
                    {module.module_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Function</label>
              <select 
                value={selectedFunction} 
                onChange={(e) => setSelectedFunction(e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded"
                disabled={!selectedModule}
              >
                <option value="">Select Function</option>
                {selectedModule && getModule(selectedModule)?.lock_functions.map(func => (
                  <option key={func.function_id} value={func.function_name}>
                    {func.function_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Test</label>
              <button
                onClick={() => {
                  if (selectedModule) {
                    const test = testPermission(selectedModule, selectedFunction || undefined);
                    console.log(`🧪 Permission Test: ${selectedModule}${selectedFunction ? ` -> ${selectedFunction}` : ''}`, test);
                  }
                }}
                className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!selectedModule}
              >
                Test
              </button>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <strong>Modules ({filteredModules.length}):</strong>
          <div className="max-h-48 overflow-y-auto">
            {filteredModules.map((module) => (
              <div key={module.module_id} className="mb-2 border-l-2 border-blue-300 pl-2">
                <div className="font-semibold">
                  📦 {module.module_name} 
                  <span className={`ml-2 px-1 text-xs rounded ${module.module_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {module.module_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="ml-2 mt-1">
                  <strong>Functions ({module.lock_functions.length}):</strong>
                  {module.lock_functions.slice(0, 5).map((func) => (
                    <div key={func.function_id} className="ml-2 border-l border-gray-300 pl-2 mt-1">
                      <div>
                        🔧 {func.function_name}
                        <span className={`ml-2 px-1 text-xs rounded ${func.function_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {func.function_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="ml-2 text-xs text-gray-600">
                        Sub-functions: {func.sub_functions.filter(sf => sf.enabled).length}/{func.sub_functions.length} enabled
                      </div>
                    </div>
                  ))}
                  {module.lock_functions.length > 5 && (
                    <div className="ml-2 text-xs text-gray-500">...and {module.lock_functions.length - 5} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle component
export const ApiPermissionsDebugToggle: React.FC = () => {
  const [showDebugger, setShowDebugger] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="fixed top-24 right-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs z-50 shadow-lg"
      >
        {showDebugger ? 'Hide' : 'Show'} API Debug
      </button>
      {showDebugger && <ApiPermissionsDebugger />}
    </>
  );
};
