import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const HorizontalBalanceSheet = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-[#DA7756]" />
        <h1 className="text-2xl font-bold text-gray-900">Horizontal Balance Sheet</h1>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Horizontal Balance Sheet</h2>
          <p className="text-gray-500">Comparative horizontal analysis of balance sheet will be displayed here</p>
        </div>
      </Card>
    </div>
  );
};

export default HorizontalBalanceSheet;
