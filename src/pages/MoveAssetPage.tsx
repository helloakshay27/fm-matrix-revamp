import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetTableDisplay } from "@/components/AssetTableDisplay";
import { MovementToSection } from "@/components/MovementToSection";
import { AllocateToSection } from "@/components/AllocateToSection";
import { useToast } from "@/hooks/use-toast";
export const MoveAssetPage: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedAssets = location.state?.selectedAssets || [];
  const [allocateTo, setAllocateTo] = useState("department");
  const [siteId, setSiteId] = useState<number | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [wingId, setWingId] = useState<number | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [floorId, setFloorId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [allocatedToId, setAllocatedToId] = useState<number | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  // const handleSubmit = async () => {
  //   // Validation for required fields
  //   if (!selectedAssets.length) {
  //     toast({
  //       title: "Validation Error",
  //       description: "No assets selected for movement.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!siteId) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Please select a site.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!buildingId) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Please select a building.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Optional validation for allocation
  //   if (allocateTo && !allocatedToId) {
  //     toast({
  //       title: "Validation Error",
  //       description: `Please select a ${allocateTo} for allocation.`,
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const payload = {
  //     assets: selectedAssets.map(asset => ({
  //       id: asset.id,
  //       site_id: siteId,
  //       building_id: buildingId,
  //       wing_id: wingId || null,
  //       floor_id: floorId || null,
  //       area_id: areaId || null,
  //       room_id: roomId || null,
  //       allocate_to_id: allocatedToId || null,
  //       allocate_type: allocateTo, // "department" or "user"
  //       attachment: attachment ? attachment.name : "",
  //       comments: comments || ""
  //     }))
  //   };

  //   try {
  //     const response = await fetch(`https://${baseUrl}/pms/asset_movement.json`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: "Asset Movement Successful",
  //         description: "Assets moved successfully!",
  //         variant: "default",
  //       });
  //       navigate('/maintenance/asset');
  //     } else {
  //       toast({
  //         title: "Asset Movement Failed",
  //         description: "Failed to move assets. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error moving assets:', error);
  //     toast({
  //       title: "Asset Movement Error",
  //       description: "An error occurred. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const handleSubmit = async () => {
    if (!selectedAssets.length) {
      toast({
        title: "Validation Error",
        description: "No assets selected for movement.",
        variant: "destructive",
      });
      return;
    }

    if (!siteId) {
      toast({
        title: "Validation Error",
        description: "Please select a site.",
        variant: "destructive",
      });
      return;
    }

    // Building, department/user allocation, and other location fields are optional

    const assets = selectedAssets.map((asset) => ({
      id: asset.id,
      site_id: siteId,
      building_id: buildingId,
      wing_id: wingId || null,
      floor_id: floorId || null,
      area_id: areaId || null,
      room_id: roomId || null,
      allocate_to_id: allocatedToId || null,
      allocate_type: allocateTo === 'user' ? 'users' : allocateTo,
      comments: comments || "",
    }));

    const formData = new FormData();
    formData.append("assets", JSON.stringify(assets));
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await fetch(
        `https://${baseUrl}/pms/asset_movement.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not set Content-Type here — browser sets it automatically for FormData
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast({
          title: "Asset Movement Successful",
          description: "Assets moved successfully!",
          variant: "default",
        });
        navigate("/maintenance/asset", { state: { refreshAssets: true } });
      } else {
        toast({
          title: "Asset Movement Failed",
          description: "Failed to move assets. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error moving assets:", error);
      toast({
        title: "Asset Movement Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate("/maintenance/asset");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              MOVE ASSET
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <AssetTableDisplay selectedAssets={selectedAssets} />

            <MovementToSection
              siteId={siteId}
              setSiteId={setSiteId}
              buildingId={buildingId}
              setBuildingId={setBuildingId}
              wingId={wingId}
              setWingId={setWingId}
              areaId={areaId}
              setAreaId={setAreaId}
              floorId={floorId}
              setFloorId={setFloorId}
              roomId={roomId}
              setRoomId={setRoomId}
            />

            <AllocateToSection
              allocateTo={allocateTo}
              setAllocateTo={setAllocateTo}
              allocatedToId={allocatedToId}
              setAllocatedToId={setAllocatedToId}
              type="Asset"
              siteId={siteId}
            />

            {/* Attachment Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Attachment
              </h3>
              <div className="flex items-center">
                <input
                  type="file"
                  id="attachment"
                  className="hidden"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="attachment"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded cursor-pointer text-sm"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {attachment ? attachment.name : "No file chosen"}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Comments
              </h3>
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
              className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-2 text-sm font-medium rounded-none w-full sm:w-auto"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
