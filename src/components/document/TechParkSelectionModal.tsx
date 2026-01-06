import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllSites, Site } from "@/services/documentService";

interface TechParkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParks: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

export const TechParkSelectionModal: React.FC<TechParkSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedParks,
  onSelectionChange,
}) => {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedParks);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedParks);
      fetchSites();
    }
  }, [isOpen, selectedParks]);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await getAllSites();
      setSites(response.sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleToggle = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((parkId) => parkId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onSelectionChange(tempSelected);
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-[600px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            Select Tech Park
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading tech parks...</p>
            </div>
          ) : sites.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No tech parks available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sites.map((site) => (
                <div
                  key={site.id}
                  onClick={() => handleToggle(site.id)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(site.id)}
                    onChange={() => handleToggle(site.id)}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] rounded"
                  />
                  {site.attachfile?.document_url && (
                    <img
                      src={site.attachfile.document_url}
                      alt={site.name}
                      className="w-16 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="48"%3E%3Crect fill="%23f0f0f0" width="64" height="48"/%3E%3C/svg%3E';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a1a1a]">
                      {site.name}
                    </h3>
                    <p className="text-sm text-[#C72030]">
                      {site.city}
                      {site.pms_region && ` • ${site.pms_region.name}`}
                    </p>
                  </div>
                </div>
              ))}
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
