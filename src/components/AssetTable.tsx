import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { AssetSelectionPanel } from './AssetSelectionPanel';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface Asset {
  id: string;
  name: string;
  assetId: string;
  assetCode: string;
  assetNo: string;
  assetStatus: string;
  equipmentId: string;
  site: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
  meterType: string;
  assetType: string;
}

interface AssetTableProps {
  searchTerm: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Diesel Generator',
    assetId: '53614',
    assetCode: '83898732f107c5df0119',
    assetNo: '501',
    assetStatus: 'In Use',
    equipmentId: '',
    site: 'Located Site 1',
    building: 'Sarova',
    wing: 'SW1',
    floor: 'FW1',
    area: 'AW1',
    room: '',
    meterType: 'Main Meter',
    assetType: 'Comprehensive'
  },
  {
    id: '2',
    name: 'Panel meter',
    assetId: '53616',
    assetCode: 'f32e0f1a1a8b5c2d3e4f',
    assetNo: '503',
    assetStatus: 'In Use',
    equipmentId: '',
    site: 'Located Site 1',
    building: 'Twin Tower',
    wing: 'TW1',
    floor: 'FTW1',
    area: 'ATW1',
    room: '',
    meterType: 'Sub Meter',
    assetType: 'Non-Comprehensive'
  }
];

export const AssetTable = ({ searchTerm }: AssetTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);

  const columns: ColumnConfig[] = useMemo(() => [
    { key: 'name', label: 'Asset Name', sortable: true, hideable: false, draggable: true },
    { key: 'assetId', label: 'Asset ID', sortable: true, hideable: true, draggable: true },
    { key: 'assetCode', label: 'Asset Code', sortable: true, hideable: true, draggable: true },
    { key: 'assetNo', label: 'Asset No.', sortable: true, hideable: true, draggable: true },
    { key: 'assetStatus', label: 'Asset Status', sortable: true, hideable: true, draggable: true },
    { key: 'equipmentId', label: 'Equipment Id', sortable: true, hideable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true },
    { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true },
    { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true },
    { key: 'floor', label: 'Floor', sortable: true, hideable: true, draggable: true },
    { key: 'area', label: 'Area', sortable: true, hideable: true, draggable: true },
    { key: 'room', label: 'Room', sortable: true, hideable: true, draggable: true },
    { key: 'meterType', label: 'Meter Type', sortable: true, hideable: true, draggable: true },
    { key: 'assetType', label: 'Asset Type', sortable: true, hideable: true, draggable: true },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
  ], []);

  const sortedData = useMemo(() => {
    if (!searchTerm) return mockAssets;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return mockAssets.filter(asset =>
      Object.values(asset).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm]);

  const handleEdit = (id: string) => {
    navigate(`/utility/edit-asset/${id}`);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Delete Asset",
      description: `Deleting asset with id ${id}.`,
    })
  };

  const handleViewDetails = (id: string) => {
    navigate(`/utility/asset-details/${id}`);
  };

  const renderActions = (asset: Asset) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleEdit(asset.id)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(asset.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewDetails(asset.id)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleRowClick = (asset: Asset) => {
    navigate(`/utility/asset-details/${asset.id}`);
  };

  const selectedAssetObjects = useMemo(() => {
    return mockAssets.filter(asset => selectedItems.includes(asset.id));
  }, [selectedItems]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(mockAssets.map(asset => asset.id));
        setShowSelectionPanel(true);
      } else {
        setSelectedItems([]);
        setShowSelectionPanel(false);
      }
    },
    [mockAssets, setSelectedItems]
  );

  const handleSelectItem = useCallback(
    (assetId: string, checked: boolean) => {
      if (checked) {
        setSelectedItems(prev => [...prev, assetId]);
        setShowSelectionPanel(true);
      } else {
        setSelectedItems(prev => prev.filter(id => id !== assetId));
        if (selectedItems.length === 1) {
          setShowSelectionPanel(false);
        }
      }
    },
    [selectedItems, setSelectedItems]
  );

  const getItemId = (asset: Asset) => asset.id;

  const bulkActions = [
    {
      label: 'Move Asset',
      onClick: (selectedAssets) => {
        alert(`Moving ${selectedAssets.length} assets`);
      }
    },
    {
      label: 'Dispose Asset',
      onClick: (selectedAssets) => {
        alert(`Disposing ${selectedAssets.length} assets`);
      }
    }
  ];

  const handleGoldenTicket = () => {
    toast({
      title: "Golden Ticket",
      description: `Creating golden ticket for ${selectedItems.length} asset(s)`,
    });
  };

  const handleSlack = () => {
    toast({
      title: "Slack",
      description: `Sending to Slack for ${selectedItems.length} asset(s)`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: `Exporting ${selectedItems.length} asset(s)`,
    });
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setShowSelectionPanel(false);
  };

  return (
    <div className="relative">
      <EnhancedTable
        data={sortedData}
        columns={columns}
        renderActions={renderActions}
        onRowClick={handleRowClick}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={getItemId}
        bulkActions={bulkActions}
        showBulkActions={true}
        storageKey="energy-assets-table"
        hideTableExport={true}
        hideTableSearch={true}
      />

      {showSelectionPanel && selectedItems.length > 0 && (
        <AssetSelectionPanel
          selectedCount={selectedItems.length}
          selectedAssets={selectedAssetObjects}
          onGoldenTicket={handleGoldenTicket}
          onSlack={handleSlack}
          onExport={handleExport}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};
