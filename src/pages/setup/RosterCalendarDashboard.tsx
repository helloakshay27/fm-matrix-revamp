
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { RosterCalendarFilterDialog } from "@/components/RosterCalendarFilterDialog";

export const RosterCalendarDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = (filters: any) => {
    console.log('Filters applied:', filters);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Roster Calendar</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ROSTER CALENDAR</h1>
            <Button 
              onClick={() => setIsFilterOpen(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="text-[#C72030]">Roster Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <RosterCalendarFilterDialog 
          open={isFilterOpen} 
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};
