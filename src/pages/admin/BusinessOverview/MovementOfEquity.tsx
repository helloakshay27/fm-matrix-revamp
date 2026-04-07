import React from "react";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

const MovementOfEquity = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-6 w-6 text-[#DA7756]" />
        <h1 className="text-2xl font-bold text-gray-900">Movement of Equity</h1>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-12">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Movement of Equity</h2>
          <p className="text-gray-500">Equity movement analysis will be displayed here</p>
        </div>
      </Card>
    </div>
  );
};

export default MovementOfEquity;
