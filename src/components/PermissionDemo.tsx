import React, { useState } from "react";
import { usePermissionCache } from "@/services/simplePermissionCache";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Code,
  Terminal,
} from "lucide-react";

// Comprehensive demo component showing all permission checking methods
export const PermissionDemo = () => {
  const {
    canViewModule,
    canUseFunction,
    canExecute,
    shouldShow,
    getModuleFunctions,
    getFunctionActions,
    getAllModules,
  } = usePermissionCache();

  // Test inputs
  const [testModule, setTestModule] = useState("PMS");
  const [testFunction, setTestFunction] = useState("Broadcast");
  const [testAction, setTestAction] = useState("broadcast_create");

  // Custom canShowAction method - developers can reference this pattern
  const canShowAction = (
    module: string,
    functionName?: string,
    actionName?: string
  ): boolean => {
    if (!module) return false;

    // Module level check
    if (!canViewModule(module)) return false;

    // Function level check (optional)
    if (functionName && !canUseFunction(module, functionName)) return false;

    // Action/Sub-function level check (optional)
    if (
      actionName &&
      functionName &&
      !canExecute(module, functionName, actionName)
    )
      return false;

    return true;
  };

  // Get all available data for reference
  const allModules = getAllModules();
  const currentModuleFunctions = getModuleFunctions(testModule);
  const currentFunctionActions = getFunctionActions(testModule, testFunction);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Permission System Demo</h1>
        <p className="text-gray-600">
          Complete guide for developers to understand permission checking
          methods
        </p>
      </div>

      {/* Method Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* canViewModule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              canViewModule
            </CardTitle>
            <CardDescription>Check if user can access a module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <code className="text-sm bg-gray-100 p-2 rounded block">
                canViewModule('PMS')
              </code>
              <div className="flex items-center gap-2">
                {canViewModule("PMS") ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">✅ Allowed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">❌ Denied</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* canUseFunction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              canUseFunction
            </CardTitle>
            <CardDescription>
              Check if user can use a specific function
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <code className="text-sm bg-gray-100 p-2 rounded block">
                canUseFunction('PMS', 'Broadcast')
              </code>
              <div className="flex items-center gap-2">
                {canUseFunction("PMS", "Broadcast") ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">✅ Allowed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">❌ Denied</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* canExecute */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="w-5 h-5" />
              canExecute
            </CardTitle>
            <CardDescription>
              Check if user can execute a specific action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <code className="text-sm bg-gray-100 p-2 rounded block">
                canExecute('PMS', 'Broadcast', 'broadcast_create')
              </code>
              <div className="flex items-center gap-2">
                {canExecute("PMS", "Broadcast", "broadcast_create") ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">✅ Allowed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">❌ Denied</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom canShowAction Method */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800">
            canShowAction Method (Custom Implementation)
          </CardTitle>
          <CardDescription className="text-blue-600">
            A comprehensive method that developers can use for permission
            checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold mb-2">Method Implementation:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`const canShowAction = (
  module: string, 
  functionName?: string, 
  actionName?: string
): boolean => {
  if (!module) return false;
  
  // Module level check
  if (!canViewModule(module)) return false;
  
  // Function level check (optional)
  if (functionName && !canUseFunction(module, functionName)) return false;
  
  // Action/Sub-function level check (optional)
  if (actionName && functionName && !canExecute(module, functionName, actionName)) return false;
  
  return true;
};`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Usage Examples:</h4>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border">
                  <code className="text-sm">canShowAction('PMS')</code>
                  <div className="mt-1">
                    {canShowAction("PMS") ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        ✅ Allowed
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        ❌ Denied
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border">
                  <code className="text-sm">
                    canShowAction('PMS', 'Broadcast')
                  </code>
                  <div className="mt-1">
                    {canShowAction("PMS", "Broadcast") ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        ✅ Allowed
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        ❌ Denied
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border">
                  <code className="text-sm">
                    canShowAction('PMS', 'Broadcast', 'broadcast_create')
                  </code>
                  <div className="mt-1">
                    {canShowAction("PMS", "Broadcast", "broadcast_create") ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        ✅ Allowed
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        ❌ Denied
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Component Usage:</h4>
              <div className="bg-white p-3 rounded border">
                <pre className="text-sm text-gray-700">
                  {`// Hide/Show components
{canShowAction('PMS', 'Broadcast') && (
  <BroadcastComponent />
)}

// Disable buttons
<Button 
  disabled={!canShowAction('PMS', 'Broadcast', 'broadcast_create')}
>
  Create Broadcast
</Button>

// Conditional rendering
const showEditButton = canShowAction('PMS', 'Assets', 'assets_update');`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Permission Testing</CardTitle>
          <CardDescription>
            Test different module, function, and action combinations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Module</label>
              <Input
                value={testModule}
                onChange={(e) => setTestModule(e.target.value)}
                placeholder="e.g., PMS"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Function</label>
              <Input
                value={testFunction}
                onChange={(e) => setTestFunction(e.target.value)}
                placeholder="e.g., Broadcast"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Action</label>
              <Input
                value={testAction}
                onChange={(e) => setTestAction(e.target.value)}
                placeholder="e.g., broadcast_create"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Module Check</div>
              <div className="mt-1">
                {canViewModule(testModule) ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Allowed
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">❌ Denied</Badge>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Function Check</div>
              <div className="mt-1">
                {canUseFunction(testModule, testFunction) ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Allowed
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">❌ Denied</Badge>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Action Check</div>
              <div className="mt-1">
                {canExecute(testModule, testFunction, testAction) ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Allowed
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">❌ Denied</Badge>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">canShowAction</div>
              <div className="mt-1">
                {canShowAction(testModule, testFunction, testAction) ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Allowed
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">❌ Denied</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* shouldShow Method */}
      <Card>
        <CardHeader>
          <CardTitle>shouldShow Method (Alternative)</CardTitle>
          <CardDescription>
            Another way to check permissions with optional parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Method Usage:</h4>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-sm">shouldShow('PMS')</code>
                  <div className="mt-1">
                    {shouldShow("PMS") ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Show
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">❌ Hide</Badge>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-sm">
                    shouldShow('PMS', 'Broadcast')
                  </code>
                  <div className="mt-1">
                    {shouldShow("PMS", "Broadcast") ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Show
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">❌ Hide</Badge>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <code className="text-sm">
                    shouldShow('PMS', 'Broadcast', 'broadcast_create')
                  </code>
                  <div className="mt-1">
                    {shouldShow("PMS", "Broadcast", "broadcast_create") ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Show
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">❌ Hide</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Component Examples:</h4>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-sm text-gray-700">
                  {`// Basic usage
{shouldShow('PMS') && (
  <div>PMS Module Content</div>
)}

// Function level
{shouldShow('PMS', 'Broadcast') && (
  <BroadcastPanel />
)}

// Action level
{shouldShow('PMS', 'Broadcast', 'broadcast_create') && (
  <Button>Create Broadcast</Button>
)}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Live Permission Examples</CardTitle>
          <CardDescription>
            These components will show/hide based on your actual permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* PMS Module Example */}
            {shouldShow("PMS") && (
              <div className="border p-4 rounded-lg bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-3">
                  PMS Module (Visible - You have access)
                </h3>

                {/* Broadcast Function */}
                {shouldShow("PMS", "Broadcast") && (
                  <div className="ml-4 border-l-2 border-blue-300 pl-4 mb-3">
                    <h4 className="font-medium text-blue-700 mb-2">
                      Broadcast Function (Visible)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shouldShow("PMS", "Broadcast", "broadcast_create") && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Create
                        </Button>
                      )}
                      {shouldShow("PMS", "Broadcast", "broadcast_show") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-300"
                        >
                          View
                        </Button>
                      )}
                      {shouldShow("PMS", "Broadcast", "broadcast_update") && (
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          Edit
                        </Button>
                      )}
                      {shouldShow("PMS", "Broadcast", "broadcast_destroy") && (
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Assets Function */}
                {shouldShow("PMS", "Assets") && (
                  <div className="ml-4 border-l-2 border-blue-300 pl-4">
                    <h4 className="font-medium text-blue-700 mb-2">
                      Assets Function (Visible)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shouldShow("PMS", "Assets", "assets_create") && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Add Asset
                        </Button>
                      )}
                      {shouldShow("PMS", "Assets", "assets_show") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300"
                        >
                          View Assets
                        </Button>
                      )}
                      {shouldShow("PMS", "Assets", "assets_update") && (
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Edit Asset
                        </Button>
                      )}
                      {shouldShow("PMS", "Assets", "assets_destroy") && (
                        <Button size="sm" variant="destructive">
                          Delete Asset
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!shouldShow("PMS") && (
              <div className="border p-4 rounded-lg bg-red-50">
                <h3 className="font-semibold text-red-800">
                  PMS Module (Hidden - No access)
                </h3>
                <p className="text-red-600 text-sm mt-1">
                  You don't have permission to view this module
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Available Permissions Summary</CardTitle>
          <CardDescription>
            Overview of all modules, functions, and actions available to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Available Modules ({allModules.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {allModules.map((module) => (
                  <Badge
                    key={module.module_name}
                    variant="outline"
                    className="bg-green-50 border-green-300"
                  >
                    {module.module_name} ({module.functions.length} functions)
                  </Badge>
                ))}
              </div>
            </div>

            {testModule && currentModuleFunctions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  Functions in {testModule} ({currentModuleFunctions.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentModuleFunctions.map((func) => (
                    <div
                      key={func.function_name}
                      className="bg-gray-50 p-2 rounded text-sm"
                    >
                      <div className="font-medium">{func.function_name}</div>
                      {func.action_name && (
                        <div className="text-gray-600">
                          Action: {func.action_name}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {func.sub_functions.length} sub-functions
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testFunction && currentFunctionActions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  Actions in {testFunction} ({currentFunctionActions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentFunctionActions.map((action) => (
                    <Badge
                      key={action.name}
                      variant="outline"
                      className="bg-blue-50 border-blue-300"
                    >
                      {action.display_name || action.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Developer Notes */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Developer Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-700">
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>canShowAction</strong>: Custom method for comprehensive
              permission checking
            </li>
            <li>
              <strong>shouldShow</strong>: Built-in method with optional
              parameters for quick checks
            </li>
            <li>
              <strong>canViewModule</strong>: Check module-level access
            </li>
            <li>
              <strong>canUseFunction</strong>: Check function-level access
            </li>
            <li>
              <strong>canExecute</strong>: Check action/sub-function level
              access
            </li>
            <li>
              All methods return <code>boolean</code> values for easy
              conditional rendering
            </li>
            <li>Permission data is cached for 30 minutes for performance</li>
            <li>Methods are safe to call even with invalid/missing data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionDemo;
