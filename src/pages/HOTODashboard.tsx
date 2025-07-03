
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HOTODashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">HOTO Dashboard</h1>
        <p className="text-gray-600">Hand Over Take Over management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030]">Active HOTOs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-600">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030]">Completed HOTOs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030]">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-gray-600">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
