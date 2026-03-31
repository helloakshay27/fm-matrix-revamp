import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const BusinessPerformanceRatios = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-[#DA7756]" />
        <h1 className="text-2xl font-bold text-gray-900">Business Performance Ratios</h1>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Business Performance Ratios</h2>
          <p className="text-gray-500">Key business performance ratios and metrics will be displayed here</p>
        </div>
      </Card>
    </div>
  );
};

export default BusinessPerformanceRatios;
