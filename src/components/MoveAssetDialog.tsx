
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { CustomTextField } from '@/components/ui/custom-text-field';

interface MoveAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: any[];
}

export const MoveAssetDialog: React.FC<MoveAssetDialogProps> = ({
  isOpen,
  onClose,
  selectedAssets
}) => {
  const [allocateTo, setAllocateTo] = useState('department');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    console.log('Moving assets:', selectedAssets);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] 2xl:max-w-[70vw] max-h-[90vh] p-0 rounded-none flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              MOVE ASSET
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
          {/* Asset Table */}
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Name</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Code</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Status</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Site</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Building</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Wing</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Floor</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Room</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Department/User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-gray-200">
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Dell Laptop</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#3423</td>
                      <td className="px-2 sm:px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          In Use
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-blue-600">👤 Technical</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Computer Table</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">#1233</td>
                      <td className="px-2 sm:px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Breakdown
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-2 sm:px-3 py-2 text-xs text-orange-600">👤 Rakesh K.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Movement To Section */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Movement To</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="w-full">
                <CustomTextField
                  label="Site*"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="Select Site"
                  size="small"
                />
              </div>
              <div className="w-full">
                <CustomTextField
                  label="Building*"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="Select Building"
                  size="small"
                />
              </div>
              <div className="w-full">
                <CustomTextField
                  label="Wing*"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  placeholder="Select Wing"
                  size="small"
                />
              </div>
              <div className="w-full">
                <CustomTextField
                  label="Area*"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Select Area"
                  size="small"
                />
              </div>
              <div className="w-full">
                <CustomTextField
                  label="Floor*"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="Select Floor"
                  size="small"
                />
              </div>
              <div className="w-full">
                <CustomTextField
                  label="Room*"  
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Select Room"
                  size="small"
                />
              </div>
            </div>
          </div>

          {/* Allocate To Section */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Allocate To</h3>
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
              <div className="flex-shrink-0">
                <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="department" />
                    <Label htmlFor="department" className="text-sm">Department</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="text-sm">User</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex-1 max-w-full lg:max-w-xs">
                <CustomTextField
                  label="Department*"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Select Department"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-center flex-shrink-0 bg-white">
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
          >
            SUBMIT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
