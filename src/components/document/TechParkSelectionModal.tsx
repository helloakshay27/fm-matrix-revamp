import React, { useState } from "react";
import { X } from "lucide-react";

interface TechPark {
  id: number;
  name: string;
  towerName: string;
  image: string;
}

const TECH_PARKS: TechPark[] = [
  {
    id: 1,
    name: "Tech Park One",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 2,
    name: "Business Bay",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 3,
    name: "Eon Free Zone",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 4,
    name: "WTC",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 5,
    name: "Business Bay",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 6,
    name: "Eon Free Zone",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
  {
    id: 7,
    name: "Tech Park One",
    towerName: "Tower Name",
    image: "/lovable-uploads/default-building.jpg",
  },
];

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
          <div className="space-y-2">
            {TECH_PARKS.map((park) => (
              <div
                key={park.id}
                onClick={() => handleToggle(park.id)}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={tempSelected.includes(park.id)}
                  onChange={() => handleToggle(park.id)}
                  className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] rounded"
                />
                <img
                  src={park.image}
                  alt={park.name}
                  className="w-16 h-12 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="48"%3E%3Crect fill="%23f0f0f0" width="64" height="48"/%3E%3C/svg%3E';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a1a1a]">{park.name}</h3>
                  <p className="text-sm text-[#C72030]">{park.towerName}</p>
                </div>
              </div>
            ))}
          </div>
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
