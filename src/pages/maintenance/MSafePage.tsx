
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MSafePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">M Safe</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Safety Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Welcome to M Safe - your comprehensive safety management system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
