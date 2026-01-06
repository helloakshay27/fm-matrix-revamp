import React, { useState, useEffect } from "react";
import { X, Eye, Pencil, Search, Filter } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Community {
  id: number;
  name: string;
  image?: string;
  description?: string;
  members?: number;
  status?: "Active" | "Inactive";
  created_date?: string;
}

interface CommunitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommunities: Community[];
  onSelectionChange: (communities: Community[]) => void;
}

// Mock community data matching the screenshot
const mockCommunities: Community[] = [
  {
    id: 1,
    name: "Wellness Warriors",
    image: "/lovable-uploads/wellness.jpg",
    description: "Lorem ipsum dolor sit amet,",
    members: 200,
    status: "Active",
    created_date: "13 Oct 2024",
  },
  {
    id: 2,
    name: "Green Guardians",
    image: "/lovable-uploads/green.jpg",
    description: "Lorem ipsum dolor sit amet,",
    members: 250,
    status: "Active",
    created_date: "13 Oct 2024",
  },
  {
    id: 3,
    name: "Overtime overlords",
    image: "/lovable-uploads/overtime.jpg",
    description: "-",
    members: 346,
    status: "Active",
    created_date: "13 Oct 2024",
  },
  {
    id: 4,
    name: "Coffee before code",
    image: "/lovable-uploads/coffee.jpg",
    description: "Lorem ipsum dolor sit amet,",
    members: 453,
    status: "Inactive",
    created_date: "13 Oct 2024",
  },
];

const columns: ColumnConfig[] = [
  {
    key: "image",
    label: "Community Image",
    sortable: false,
    defaultVisible: true,
  },
  {
    key: "name",
    label: "Community Name",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "description",
    label: "Description",
    sortable: true,
    defaultVisible: true,
  },
  { key: "members", label: "Members", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "created_date",
    label: "Created",
    sortable: true,
    defaultVisible: true,
  },
];

export const CommunitySelectionModal: React.FC<
  CommunitySelectionModalProps
> = ({ isOpen, onClose, selectedCommunities, onSelectionChange }) => {
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedCommunities.map((c) => c.id.toString())
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // TODO: Fetch communities from API
    // For now using mock data
  }, []);

  if (!isOpen) return null;

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, itemId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(communities.map((c) => c.id.toString()));
    } else {
      setSelectedIds([]);
    }
  };

  const handleApply = () => {
    const selected = communities.filter((c) =>
      selectedIds.includes(c.id.toString())
    );
    onSelectionChange(selected);
    onClose();
  };

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCell = (item: Community, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/48x48?text=IMG";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                IMG
              </div>
            )}
          </div>
        );
      case "name":
        return <span className="font-medium text-gray-900">{item.name}</span>;
      case "description":
        return <span className="text-gray-600">{item.description || "-"}</span>;
      case "members":
        return <span className="text-gray-700">{item.members || 0}</span>;
      case "status":
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-5 rounded-full relative ${
                item.status === "Active" ? "bg-green-500" : "bg-red-400"
              }`}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${
                  item.status === "Active" ? "right-0.5" : "left-0.5"
                }`}
              />
            </div>
            <span
              className={`text-sm ${
                item.status === "Active" ? "text-green-600" : "text-red-500"
              }`}
            >
              {item.status}
            </span>
          </div>
        );
      case "created_date":
        return <span className="text-gray-600">{item.created_date}</span>;
      default:
        return <span>{String(item[columnKey as keyof Community] || "")}</span>;
    }
  };

  const renderActions = (item: Community) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Eye className="h-4 w-4 text-gray-600" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Pencil className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-[900px] max-w-[95vw] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Community</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-end gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 border-gray-300"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-[#C72030] text-[#C72030]"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <EnhancedTable
            data={filteredCommunities}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="community-selection-table"
            emptyMessage="No communities found"
            selectable={true}
            selectedItems={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            getItemId={(item) => item.id.toString()}
            hideTableSearch={true}
            hideTableExport={true}
            pagination={false}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedIds.length} community(ies) selected
          </div>
          <div className="flex gap-3">
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
      </div>
    </>
  );
};
