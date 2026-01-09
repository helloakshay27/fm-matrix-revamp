import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  const handleToggle = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((parkId) => parkId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onSelectionChange(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="tech-park-selection-dialog-description"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            SELECT TECH PARK
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="tech-park-selection-dialog-description" className="sr-only">
            Select tech parks to share documents with
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 py-4">
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
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] rounded"
                  />
                  {site.attachfile?.document_url && (
                    <img
                      src={site.attachfile.document_url}
                      alt={site.name}
                      className="w-12 h-12 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {site.name}
                    </p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      {site.city && <span>City: {site.city}</span>}
                      {site.pms_company_setup?.name && (
                        <span>Company: {site.pms_company_setup.name}</span>
                      )}
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
