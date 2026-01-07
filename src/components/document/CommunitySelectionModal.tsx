import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Users } from "lucide-react";
import { getCommunities, Community } from "@/services/documentService";

interface CommunitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommunities: { id: number; name: string }[];
  onSelectionChange: (communities: { id: number; name: string }[]) => void;
}

export const CommunitySelectionModal: React.FC<
  CommunitySelectionModalProps
> = ({ isOpen, onClose, selectedCommunities, onSelectionChange }) => {
  const [tempSelected, setTempSelected] = useState<number[]>(
    selectedCommunities.map((c) => c.id)
  );
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedCommunities.map((c) => c.id));
      fetchCommunities();
    }
  }, [isOpen, selectedCommunities]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const response = await getCommunities();
      setCommunities(response.communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((commId) => commId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    const selectedComms = communities
      .filter((c) => tempSelected.includes(c.id))
      .map((c) => ({ id: c.id, name: c.name }));
    onSelectionChange(selectedComms);
    onClose();
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "exited":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="community-selection-dialog-description"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            SELECT COMMUNITIES
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="community-selection-dialog-description" className="sr-only">
            Select communities to share documents with
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading communities...</p>
            </div>
          ) : communities.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No communities available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {communities.map((community) => (
                <div
                  key={community.id}
                  onClick={() => handleToggle(community.id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(community.id)}
                    onChange={() => handleToggle(community.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] rounded"
                  />

                  {/* Community Icon/Image */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {community.icon ? (
                      <img
                        src={community.icon}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Community Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {community.name}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(community.status)}`}
                      >
                        {community.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {community.members_count} members
                      </span>
                      {community.description && (
                        <span className="truncate max-w-xs">
                          {community.description}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created by: {community.created_by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleApply}
            disabled={loading}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex-1 h-11"
          >
            Apply Selection
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1 h-11"
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
