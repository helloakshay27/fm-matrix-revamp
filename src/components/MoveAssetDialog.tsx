import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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

  const handleSubmit = () => {
    console.log('Moving assets:', selectedAssets);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-hidden p-0 rounded-none">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
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

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Asset Table */}
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Site</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Building</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Wing</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Floor</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Room</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Department/User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-gray-200">
                      <td className="px-3 py-2 text-xs text-gray-900">Dell Laptop</td>
                      <td className="px-3 py-2 text-xs text-gray-900">#3423</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          In Use
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-3 py-2 text-xs text-blue-600">👤 Technical</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-3 py-2 text-xs text-gray-900">Computer Table</td>
                      <td className="px-3 py-2 text-xs text-gray-900">#1233</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Breakdown
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">Haven Infoline</td>
                      <td className="px-3 py-2 text-xs text-gray-900">Jyoti Tower</td>
                      <td className="px-3 py-2 text-xs text-gray-900">J</td>
                      <td className="px-3 py-2 text-xs text-gray-900">2</td>
                      <td className="px-3 py-2 text-xs text-gray-900">East</td>
                      <td className="px-3 py-2 text-xs text-gray-900">R 202</td>
                      <td className="px-3 py-2 text-xs text-orange-600">👤 Rakesh K.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Movement To Section */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Movement To</h3>
            <div className="grid grid-cols-6 gap-2">
              <div>
                <Label htmlFor="site" className="text-xs font-medium text-gray-700 mb-1 block">
                  Site<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haven">Haven Infoline</SelectItem>
                    <SelectItem value="other">Other Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="building" className="text-xs font-medium text-gray-700 mb-1 block">
                  Building<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jyoti">Jyoti Tower</SelectItem>
                    <SelectItem value="other">Other Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="wing" className="text-xs font-medium text-gray-700 mb-1 block">
                  Wing<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="j">J</SelectItem>
                    <SelectItem value="k">K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area" className="text-xs font-medium text-gray-700 mb-1 block">
                  Area<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor" className="text-xs font-medium text-gray-700 mb-1 block">
                  Floor<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="room" className="text-xs font-medium text-gray-700 mb-1 block">
                  Room<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="r202">R 202</SelectItem>
                    <SelectItem value="r203">R 203</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Allocate To Section */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Allocate To</h3>
            <div className="flex items-start gap-8">
              <div>
                <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex gap-6">
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
              <div className="flex-1 max-w-xs">
                <Label htmlFor="department-select" className="text-xs font-medium text-gray-700 mb-1 block">
                  Department<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed at bottom */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-center flex-shrink-0">
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-2 text-sm font-medium rounded-none"
          >
            SUBMIT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
