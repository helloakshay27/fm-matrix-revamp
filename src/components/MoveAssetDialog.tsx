
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
      <DialogContent className="max-w-6xl w-full p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
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

        <div className="p-6">
          {/* Asset Table */}
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asset Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asset Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asset Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Site</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Building</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Wing</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Floor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Area</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Room</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department/User</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">Dell Laptop</td>
                    <td className="px-4 py-3 text-sm text-gray-900">#3423</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                        In Use
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">Haven Infoline</td>
                    <td className="px-4 py-3 text-sm text-gray-900">Jyoti Tower</td>
                    <td className="px-4 py-3 text-sm text-gray-900">J</td>
                    <td className="px-4 py-3 text-sm text-gray-900">2</td>
                    <td className="px-4 py-3 text-sm text-gray-900">East</td>
                    <td className="px-4 py-3 text-sm text-gray-900">R 202</td>
                    <td className="px-4 py-3 text-sm text-blue-600">👤 Technical</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">Computer Table</td>
                    <td className="px-4 py-3 text-sm text-gray-900">#1233</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800">
                        Breakdown
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">Haven Infoline</td>
                    <td className="px-4 py-3 text-sm text-gray-900">Jyoti Tower</td>
                    <td className="px-4 py-3 text-sm text-gray-900">J</td>
                    <td className="px-4 py-3 text-sm text-gray-900">2</td>
                    <td className="px-4 py-3 text-sm text-gray-900">East</td>
                    <td className="px-4 py-3 text-sm text-gray-900">R 202</td>
                    <td className="px-4 py-3 text-sm text-orange-600">👤 Rakesh K.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Movement To Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movement To</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="site" className="text-sm font-medium text-gray-700">
                  Site<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haven">Haven Infoline</SelectItem>
                    <SelectItem value="other">Other Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="building" className="text-sm font-medium text-gray-700">
                  Building<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jyoti">Jyoti Tower</SelectItem>
                    <SelectItem value="other">Other Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="wing" className="text-sm font-medium text-gray-700">
                  Wing<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="j">J</SelectItem>
                    <SelectItem value="k">K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                  Area<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor" className="text-sm font-medium text-gray-700">
                  Floor<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="room" className="text-sm font-medium text-gray-700">
                  Room<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
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
          <div className="mb-8">
            <div className="flex items-center gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocate To</h3>
                <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="department" />
                    <Label htmlFor="department">Department</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex-1">
                <Label htmlFor="department-select" className="text-sm font-medium text-gray-700">
                  Department<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
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

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-16 py-3 text-base font-medium"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
