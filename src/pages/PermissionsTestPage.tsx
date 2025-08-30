import React from 'react';
import { Card } from '@/components/ui/card';
import { PermissionsDebugger } from '@/components/PermissionsDebugger';
import { DynamicPermissionChecker } from '@/components/DynamicPermissionChecker';
import { ApiPermissionsDebugger } from '@/components/ApiPermissionsDebugger';
import { PermissionsSummaryPanel } from '@/components/PermissionsSummaryPanel';
import PermissionTester from '@/components/PermissionTester';
import HeaderDebugger from '@/components/HeaderDebugger';
import FmUserDebugTest from '@/components/FmUserDebugTest';

const PermissionsTestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Permissions Testing Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test and debug dynamic permissions for sidebar menu management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FM User Specific Debug Test */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">FM User Specific Debug Test</h2>
          <FmUserDebugTest />
        </Card>

        {/* Dynamic Header Debugger */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Dynamic Header Debug Info</h2>
          <HeaderDebugger />
        </Card>

        {/* Permissions Summary Panel */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Permissions Overview</h2>
          <PermissionsSummaryPanel />
        </Card>

        {/* API Structure Debugger */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API Response Debugger</h2>
          <ApiPermissionsDebugger />
        </Card>

        {/* Permission Tester */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Enhanced Permission Testing</h2>
          <PermissionTester />
        </Card>

        {/* Dynamic Permission Checker */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Interactive Permission Checker</h2>
          <DynamicPermissionChecker />
        </Card>

        {/* Full Permissions Debugger */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Complete Permissions Debug View</h2>
          <PermissionsDebugger />
        </Card>
      </div>

      {/* Testing Instructions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">How to Use This Dashboard:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Permissions Overview:</strong> Shows your current role and enabled modules/functions</li>
              <li><strong>API Response Debugger:</strong> Displays raw API response structure</li>
              <li><strong>Interactive Permission Checker:</strong> Test specific permissions dynamically</li>
              <li><strong>Complete Debug View:</strong> Full technical details of the permission system</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Testing Different Scenarios:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Navigate to different pages and check how permissions refresh</li>
              <li>Use the Interactive Checker to test specific module/function combinations</li>
              <li>Check the sidebar to see which items are visible based on your role</li>
              <li>Watch the console for permission check logs (enable in browser dev tools)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Expected Behavior:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Sidebar items should only appear if you have the required permissions</li>
              <li>Permissions should refresh automatically when navigating between pages</li>
              <li>Debug panels should show real-time permission data</li>
              <li>Interactive checker should accurately reflect your access rights</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PermissionsTestPage;
