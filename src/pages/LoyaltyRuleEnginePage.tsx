
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoyaltyRuleEnginePage = () => {
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
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loyalty Rule Engine</h1>
              <p className="text-gray-600">Set up and manage customer loyalty programs</p>
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
                  The Loyalty Rule Engine enables you to create, manage, and automate customer loyalty 
                  programs with flexible rule configurations. Design point-based systems, tier structures, 
                  and reward mechanisms to enhance customer engagement and retention.
                </p>
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Flexible rule configuration</li>
                  <li>Point-based loyalty systems</li>
                  <li>Tier management and progression</li>
                  <li>Automated reward distribution</li>
                  <li>Customer engagement analytics</li>
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
                  <span className="ml-2 text-gray-600">1.5.2</span>
                </div>
                <div>
                  <span className="font-medium">Developer:</span>
                  <span className="ml-2 text-gray-600">Facility Management</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-600">Customer Management</span>
                </div>
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2 text-gray-600">18.7 MB</span>
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
