import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetTableDisplay } from '@/components/AssetTableDisplay';
import { MovementToSection } from '@/components/MovementToSection';
import { AllocateToSection } from '@/components/AllocateToSection';
export const MoveAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAssets = location.state?.selectedAssets || [];
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
    navigate(-1); // Go back to previous page
  };
  const handleBack = () => {
    navigate('/maintenance/asset');
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              MOVE ASSET
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <AssetTableDisplay selectedAssets={selectedAssets} />
            
            <MovementToSection site={site} setSite={setSite} building={building} setBuilding={setBuilding} wing={wing} setWing={setWing} area={area} setArea={setArea} floor={floor} setFloor={setFloor} room={room} setRoom={setRoom} />

            <AllocateToSection allocateTo={allocateTo} setAllocateTo={setAllocateTo} department={department} setDepartment={setDepartment} />

            {/* Attachment Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachment</h3>
              <div className="flex items-center">
                <input type="file" id="attachment" className="hidden" />
                <label htmlFor="attachment" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded cursor-pointer text-sm">
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">No file chosen</span>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Remarks</h3>
              <textarea placeholder="Add Remarks" className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
            </div>
          </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-center bg-gray-50">
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto">
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    </div>;
};