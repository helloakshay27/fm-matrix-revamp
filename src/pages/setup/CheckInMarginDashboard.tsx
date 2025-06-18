
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const CheckInMarginDashboard = () => {
  const [checkInMargin, setCheckInMargin] = useState({
    hours: '',
    minutes: '',
    shift: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Check-in margin settings:', checkInMargin);
    toast.success('Check-in margin settings updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Check-in Margin</div>
          <h1 className="text-2xl font-bold text-gray-800">CHECK-IN MARGIN</h1>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-[#C72030]">Configure Check-in Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="0"
                    value={checkInMargin.hours}
                    onChange={(e) => setCheckInMargin(prev => ({ ...prev, hours: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={checkInMargin.minutes}
                    onChange={(e) => setCheckInMargin(prev => ({ ...prev, minutes: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shift">Apply to Shift</Label>
                <Select onValueChange={(value) => setCheckInMargin(prev => ({ ...prev, shift: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="morning">Morning Shift</SelectItem>
                    <SelectItem value="evening">Evening Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCheckInMargin({ hours: '', minutes: '', shift: '' })}
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Settings Display */}
        <Card className="max-w-2xl mt-6">
          <CardHeader>
            <CardTitle className="text-[#C72030]">Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Check-in Margin:</span> {checkInMargin.hours || '0'} hours {checkInMargin.minutes || '0'} minutes</p>
              <p><span className="font-medium">Applied to:</span> {checkInMargin.shift || 'Not selected'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
