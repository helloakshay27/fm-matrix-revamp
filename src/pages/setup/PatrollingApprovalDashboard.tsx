
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export const PatrollingApprovalDashboard = () => {
  const [notificationInterval, setNotificationInterval] = useState('2');
  const [approvers, setApprovers] = useState([
    'Ankit Gupta',
    'Vinayak Mane'
  ]);

  const removeApprover = (index: number) => {
    setApprovers(approvers.filter((_, i) => i !== index));
  };

  const addApprover = (name: string) => {
    if (name && !approvers.includes(name)) {
      setApprovers([...approvers, name]);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting patrolling approval settings:', {
      notificationInterval,
      approvers
    });
    // Handle form submission logic here
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">PATROLLING Approval</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <Label htmlFor="notification-interval">
                  Send Notification After(mins):
                </Label>
                <Input
                  id="notification-interval"
                  type="number"
                  value={notificationInterval}
                  onChange={(e) => setNotificationInterval(e.target.value)}
                  className="w-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Approver:</Label>
                <div className="border border-gray-300 rounded-md p-3 min-h-[80px] bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {approvers.map((approver, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        <span>{approver}</span>
                        <button
                          onClick={() => removeApprover(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
