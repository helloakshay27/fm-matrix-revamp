import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface Community {
  id: number;
  name: string;
}

interface CommunitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommunities: Community[];
  onSelectionChange: (communities: Community[]) => void;
}

export const CommunitySelectionModal: React.FC<
  CommunitySelectionModalProps
> = ({ isOpen, onClose, selectedCommunities, onSelectionChange }) => {
  const [communities, setCommunities] =
    useState<Community[]>(selectedCommunities);
  const [newCommunityName, setNewCommunityName] = useState("");

  if (!isOpen) return null;

  const handleAddCommunity = () => {
    if (newCommunityName.trim()) {
      const newCommunity: Community = {
        id: Date.now(),
        name: newCommunityName.trim(),
      };
      setCommunities((prev) => [...prev, newCommunity]);
      setNewCommunityName("");
    }
  };

  const handleRemoveCommunity = (id: number) => {
    setCommunities((prev) => prev.filter((community) => community.id !== id));
  };

  const handleApply = () => {
    onSelectionChange(communities);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-[500px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            Add Communities
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Add Community Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddCommunity();
                  }
                }}
                placeholder="Enter community name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
              <button
                onClick={handleAddCommunity}
                disabled={!newCommunityName.trim()}
                className="px-4 py-2 bg-[#C72030] text-white rounded-lg hover:bg-[#A01828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Communities List */}
          {communities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected Communities ({communities.length})
              </h3>
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-sm text-gray-700">
                    {community.name}
                  </span>
                  <button
                    onClick={() => handleRemoveCommunity(community.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {communities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No communities added yet. Add communities above.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#C72030] text-white rounded hover:bg-[#A01828] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
