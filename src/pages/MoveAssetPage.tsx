import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetTableDisplay } from '@/components/AssetTableDisplay';
import { MovementToSection } from '@/components/MovementToSection';
import { AllocateToSection } from '@/components/AllocateToSection';
import axios from 'axios';
import { API_CONFIG } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';

export const MoveAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedAssets = location.state?.selectedAssets || [];
  
  const [allocateTo, setAllocateTo] = useState('department');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [department, setDepartment] = useState('');
  const [user, setUser] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  const handleSubmit = async () => {
    // Validation
    if (!site || !building) {
      toast({
        title: "Validation Error",
        description: "Site and Building are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedAssets.length === 0) {
      toast({
        title: "No Assets Selected",
        description: "Please select at least one asset to move.",
        variant: "destructive",
      });
      return;
    }

    if (allocateTo === 'department' && !department) {
      toast({
        title: "Department Required",
        description: "Please select a department.",
        variant: "destructive",
      });
      return;
    }

    if (allocateTo === 'user' && !user) {
      toast({
        title: "User Required",
        description: "Please select a user.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data
      const formData = new FormData();
      
      // Add asset IDs
      const assetIds = selectedAssets.map(asset => asset.id);
      formData.append('asset_ids', JSON.stringify(assetIds));
      
      // Add location data
      formData.append('site_id', site);
      formData.append('building_id', building);
      if (wing) formData.append('wing_id', wing);
      if (area) formData.append('area_id', area);
      if (floor) formData.append('floor_id', floor);
      if (room) formData.append('room_id', room);
      
      // Add allocation data
      formData.append('allocation_type', allocateTo);
      const allocatedToId = allocateTo === 'department' ? department : user;
      formData.append('allocated_to_id', allocatedToId);
      
      // Add attachment if present
      if (attachment) {
        formData.append('attachment', attachment);
      }
      
      // Add comments
      formData.append('comments', comments);

      // Submit to API
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/pms/asset_movement.json`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast({
        title: "Success",
        description: `Successfully moved ${selectedAssets.length} asset(s).`,
      });

      // Navigate back to asset dashboard
      navigate('/maintenance/asset');
      
    } catch (error) {
      console.error('Error moving assets:', error);
      toast({
        title: "Error",
        description: "Failed to move assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/maintenance/asset');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <MovementToSection 
              site={site} 
              setSite={setSite} 
              building={building} 
              setBuilding={setBuilding} 
              wing={wing} 
              setWing={setWing} 
              area={area} 
              setArea={setArea} 
              floor={floor} 
              setFloor={setFloor} 
              room={room} 
              setRoom={setRoom} 
            />

            <AllocateToSection 
              allocateTo={allocateTo} 
              setAllocateTo={setAllocateTo} 
              department={department} 
              setDepartment={setDepartment}
              user={user}
              setUser={setUser}
            />

            {/* Attachment Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachment</h3>
              <div className="flex items-center">
                <input 
                  type="file" 
                  id="attachment" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <label htmlFor="attachment" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded cursor-pointer text-sm">
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {attachment ? attachment.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Comments</h3>
              <textarea 
                placeholder="Add Comments" 
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
              />
            </div>
          </div>

          {/* Submit Button - Fixed at bottom */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-center bg-gray-50">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};