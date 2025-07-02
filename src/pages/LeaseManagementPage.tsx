
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeaseManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/market-place/all')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Market Place
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#C72030] rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lease Management</h1>
              <p className="text-gray-600">Manage your lease agreements and contracts efficiently</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About this App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lease Management is a comprehensive solution for managing all your lease agreements, 
                  rental contracts, and property management needs. Track lease terms, automate renewal 
                  notifications, and maintain detailed records of all lease-related activities.
                </p>
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Automated lease renewal notifications</li>
                  <li>Contract management and tracking</li>
                  <li>Payment history and scheduling</li>
                  <li>Document storage and management</li>
                  <li>Reporting and analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>App Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Version:</span>
                  <span className="ml-2 text-gray-600">2.1.0</span>
                </div>
                <div>
                  <span className="font-medium">Developer:</span>
                  <span className="ml-2 text-gray-600">Facility Management</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-600">Property Management</span>
                </div>
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2 text-gray-600">25.4 MB</span>
                </div>
                <Button className="w-full bg-[#C72030] hover:bg-[#A01020] text-white">
                  Install App
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
