
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MSafeDashboard = () => {
  const location = useLocation();
  const isSafetyRoute = location.pathname.startsWith('/safety');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">M Safe</h1>
      
      {isSafetyRoute && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/safety/m-safe/non-fte-users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NON FTE USERS</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Manage non-FTE users and their details
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/safety/m-safe/krcc-form-list">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KRCC FORM LIST</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  View and manage KRCC forms
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
};
