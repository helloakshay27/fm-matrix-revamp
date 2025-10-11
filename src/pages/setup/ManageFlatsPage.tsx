import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, X, Edit2, Check, Filter } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Column configuration matching the image
const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false },
  { key: "tower", label: "Tower", sortable: true, draggable: true },
  { key: "flat", label: "Flat", sortable: true, draggable: true },
  { key: "flatType", label: "Flat Type", sortable: true, draggable: true },
  { key: "builtUpArea", label: "Built Up Area(Sq.Ft)", sortable: true, draggable: true },
  { key: "carpetArea", label: "Carpet Area(Sq.Ft)", sortable: true, draggable: true },
  { key: "nameOnBill", label: "Name On Bill", sortable: true, draggable: true },
  { key: "possession", label: "Possession", sortable: true, draggable: true },
  { key: "occupancy", label: "Occupancy", sortable: true, draggable: true },
  { key: "occupiedBy", label: "Occupied By", sortable: true, draggable: true },
  { key: "ownerTenant", label: "Owner/Tenant", sortable: true, draggable: true },
  { key: "siteVisits", label: "Site Visits", sortable: true, draggable: true },
  { key: "sold", label: "Sold", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
];

// Sample data matching the image
const sampleFlats = [
  {
    id: "1",
    tower: "",
    flat: "Soc_office",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "2",
    tower: "FM",
    flat: "101",
    flatType: "2 BHK - Apartment",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "Yes",
    occupiedBy: "Ubaid Hashmat",
    ownerTenant: "Owner",
    siteVisits: "0",
    sold: "Yes",
    status: "active",
  },
  {
    id: "3",
    tower: "FM",
    flat: "102",
    flatType: "2 BHK - Apartment",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "Yes",
    occupiedBy: "Deepak Gupta",
    ownerTenant: "Owner",
    siteVisits: "0",
    sold: "No",
    status: "active",
  },
  {
    id: "4",
    tower: "FM",
    flat: "103",
    flatType: "1 BHK - Apartment",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "Deepak Gupta",
    possession: "Yes",
    occupancy: "Yes",
    occupiedBy: "Akshay Mugale",
    ownerTenant: "Tenant",
    siteVisits: "0",
    sold: "No",
    status: "active",
  },
  {
    id: "5",
    tower: "FM",
    flat: "Office",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "Yes",
    occupiedBy: "Dummy Users",
    ownerTenant: "Owner",
    siteVisits: "0",
    sold: "No",
    status: "active",
  },
  {
    id: "6",
    tower: "MLCP1",
    flat: "G-10",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "7",
    tower: "MLCP1",
    flat: "G-2",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "8",
    tower: "MLCP1",
    flat: "G-4",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "9",
    tower: "MLCP1",
    flat: "G-5",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "10",
    tower: "MLCP1",
    flat: "G-6",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
  {
    id: "11",
    tower: "MLCP1",
    flat: "G-8",
    flatType: "",
    builtUpArea: "",
    carpetArea: "",
    nameOnBill: "NA",
    possession: "Yes",
    occupancy: "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: "No",
    status: "inactive",
  },
];

interface FlatType {
  id: number;
  flatUnitType: string;
  apartmentType: string;
  status: boolean;
}

export const ManageFlatsPage = () => {
  const navigate = useNavigate();
  const [flats, setFlats] = useState(sampleFlats);
  const [selectedFlats, setSelectedFlats] = useState<string[]>([]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfigureDialog, setShowConfigureDialog] = useState(false);
  const [flatTypes, setFlatTypes] = useState<FlatType[]>([
    { id: 549, flatUnitType: "2 BHK", apartmentType: "Apartment", status: true },
    { id: 585, flatUnitType: "1 BHK", apartmentType: "Apartment", status: true },
    { id: 586, flatUnitType: "3  BHK", apartmentType: "Apartment", status: true },
    { id: 587, flatUnitType: "3 BHK Luxe-Deck", apartmentType: "Apartment", status: true },
    { id: 588, flatUnitType: "NA BHK", apartmentType: "Apartment", status: true },
    { id: 614, flatUnitType: "1301", apartmentType: "", status: true },
    { id: 839, flatUnitType: "403 BHK", apartmentType: "Apartment", status: true },
  ]);
  const [newFlatType, setNewFlatType] = useState("");
  const [newConfiguration, setNewConfiguration] = useState("");
  const [newApartmentType, setNewApartmentType] = useState("");
  const [editingFlatType, setEditingFlatType] = useState<number | null>(null);
  const [editedApartmentType, setEditedApartmentType] = useState("");
  
  // Add Flat Dialog states
  const [showAddFlatDialog, setShowAddFlatDialog] = useState(false);
  
  // Configure Tower Dialog states
  const [showConfigureTowerDialog, setShowConfigureTowerDialog] = useState(false);
  const [newTowerName, setNewTowerName] = useState("");
  const [newTowerAbbreviation, setNewTowerAbbreviation] = useState("");
  const [towers, setTowers] = useState([
    { id: 661, name: "", abbreviation: "", createdBy: "", status: true },
    { id: 553, name: "FM", abbreviation: "", createdBy: "Deepak Gupta", status: true },
    { id: 1199, name: "MLCP1", abbreviation: "MLCP1", createdBy: "", status: true },
    { id: 740, name: "RG-Retail", abbreviation: "RG-Retail", createdBy: "", status: true },
    { id: 1364, name: "T1", abbreviation: "T1", createdBy: "", status: true },
    { id: 751, name: "Tower 1", abbreviation: "Tower 1", createdBy: "", status: true },
    { id: 665, name: "Tower 10", abbreviation: "Tower 10", createdBy: "", status: true },
    { id: 750, name: "Tower 11", abbreviation: "Tower 11", createdBy: "", status: true },
  ]);
  const [editingTower, setEditingTower] = useState<number | null>(null);
  const [editedTowerData, setEditedTowerData] = useState({ name: "", abbreviation: "" });
  
  // Filters Dialog states
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [filters, setFilters] = useState({
    tower: "",
    flat: "",
    flatType: "",
    status: "",
    occupancy: "",
  });
  
  const [addFlatFormData, setAddFlatFormData] = useState({
    status: true,
    possession: true,
    sold: false,
    tower: "",
    flat: "",
    carpetArea: "",
    builtUpArea: "",
    flatType: "",
    occupied: "",
    nameOnBill: "",
    dateOfPossession: "",
    rmUser: "",
  });

  const handleAddFlat = () => {
    setShowAddFlatDialog(true);
    setShowActionPanel(false);
  };
  
  const handleAddFlatInputChange = (field: string, value: string | boolean) => {
    setAddFlatFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmitAddFlat = () => {
    // Validate required fields
    if (!addFlatFormData.tower || !addFlatFormData.flat) {
      toast.error("Please fill in required fields");
      return;
    }
    
    // Add the new flat
    const newFlat = {
      id: (flats.length + 1).toString(),
      tower: addFlatFormData.tower,
      flat: addFlatFormData.flat,
      flatType: addFlatFormData.flatType,
      builtUpArea: addFlatFormData.builtUpArea,
      carpetArea: addFlatFormData.carpetArea,
      nameOnBill: addFlatFormData.nameOnBill,
      possession: addFlatFormData.possession ? "Yes" : "No",
      occupancy: addFlatFormData.occupied ? "Yes" : "No",
      occupiedBy: "",
      ownerTenant: "",
      siteVisits: "0",
      sold: addFlatFormData.sold ? "Yes" : "No",
      status: addFlatFormData.status ? "active" : "inactive",
    };
    
    setFlats([...flats, newFlat]);
    setShowAddFlatDialog(false);
    
    // Reset form
    setAddFlatFormData({
      status: true,
      possession: true,
      sold: false,
      tower: "",
      flat: "",
      carpetArea: "",
      builtUpArea: "",
      flatType: "",
      occupied: "",
      nameOnBill: "",
      dateOfPossession: "",
      rmUser: "",
    });
    
    toast.success("Flat added successfully!");
  };

  const handleAddUnit = () => {
    setShowConfigureDialog(true);
    setShowActionPanel(false);
  };

  const handleAddTower = () => {
    setShowConfigureTowerDialog(true);
    setShowActionPanel(false);
  };

  const handleSubmitTower = () => {
    if (!newTowerName.trim()) {
      toast.error("Please enter a tower name");
      return;
    }

    const newId = Math.max(...towers.map((t) => t.id), 0) + 1;
    const newTower = {
      id: newId,
      name: newTowerName,
      abbreviation: newTowerAbbreviation,
      createdBy: "",
      status: true,
    };
    
    setTowers([...towers, newTower]);
    setNewTowerName("");
    setNewTowerAbbreviation("");
    toast.success("Tower added successfully!");
  };

  const handleToggleTowerStatus = (id: number) => {
    setTowers(
      towers.map((t) =>
        t.id === id ? { ...t, status: !t.status } : t
      )
    );
  };

  const handleEditTower = (id: number) => {
    setEditingTower(id);
    const tower = towers.find((t) => t.id === id);
    if (tower) {
      setEditedTowerData({
        name: tower.name,
        abbreviation: tower.abbreviation,
      });
    }
  };

  const handleSaveTowerEdit = (id: number) => {
    setTowers(
      towers.map((t) =>
        t.id === id ? { ...t, name: editedTowerData.name, abbreviation: editedTowerData.abbreviation } : t
      )
    );
    setEditingTower(null);
    setEditedTowerData({ name: "", abbreviation: "" });
    toast.success("Tower updated successfully!");
  };

  const handleImport = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) {
        return;
      }

      // Check file type
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
        toast.error('Please upload a valid CSV or Excel file');
        return;
      }

      // Read file
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          
          // For CSV files, parse the content
          if (file.name.endsWith('.csv')) {
            const lines = content.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            // Parse CSV data
            const newFlats = lines.slice(1)
              .filter(line => line.trim())
              .map((line, index) => {
                const values = line.split(',').map(v => v.trim());
                return {
                  id: `imported-${Date.now()}-${index}`,
                  tower: values[0] || '',
                  flat: values[1] || '',
                  flatType: values[2] || '',
                  builtUpArea: values[3] || '',
                  carpetArea: values[4] || '',
                  nameOnBill: values[5] || '',
                  possession: values[6] || 'No',
                  occupancy: values[7] || 'No',
                  occupiedBy: values[8] || '',
                  ownerTenant: values[9] || '',
                  siteVisits: values[10] || '0',
                  sold: values[11] || 'No',
                  status: values[12] === 'active' ? 'active' : 'inactive',
                };
              });
            
            if (newFlats.length > 0) {
              setFlats([...flats, ...newFlats]);
              toast.success(`Successfully imported ${newFlats.length} flats`);
            } else {
              toast.error('No valid data found in the file');
            }
          } else {
            // For Excel files, show message
            toast.info('Excel file detected. Processing...');
            // In a real app, you'd use a library like xlsx to parse Excel files
            toast.warning('Excel parsing requires additional setup. Please use CSV format for now.');
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          toast.error('Error parsing file. Please check the file format.');
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      
      reader.readAsText(file);
    };
    
    // Trigger file input
    input.click();
    setShowActionPanel(false);
  };

  const handleExport = () => {
    try {
      // Prepare CSV headers
      const headers = [
        'Tower',
        'Flat',
        'Flat Type',
        'Built Up Area(Sq.Ft)',
        'Carpet Area(Sq.Ft)',
        'Name On Bill',
        'Possession',
        'Occupancy',
        'Occupied By',
        'Owner/Tenant',
        'Site Visits',
        'Sold',
        'Status'
      ];
      
      // Prepare CSV rows
      const rows = flats.map(flat => [
        flat.tower || '-',
        flat.flat || '-',
        flat.flatType || '-',
        flat.builtUpArea || '-',
        flat.carpetArea || '-',
        flat.nameOnBill || '-',
        flat.possession || '-',
        flat.occupancy || '-',
        flat.occupiedBy || '-',
        flat.ownerTenant || '-',
        flat.siteVisits || '0',
        flat.sold || '-',
        flat.status || 'inactive'
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
          // Escape cells containing commas or quotes
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `manage_flats_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Successfully exported ${flats.length} flats`);
    } catch (error) {
      console.error('Error exporting flats:', error);
      toast.error('Error exporting flats. Please try again.');
    }
    
    setShowActionPanel(false);
  };

  const handleFilters = () => {
    setShowFiltersDialog(true);
    setShowActionPanel(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    // Filter logic would be applied here
    // For now, just close the dialog
    toast.success("Filters applied successfully!");
    setShowFiltersDialog(false);
  };

  const handleResetFilters = () => {
    setFilters({
      tower: "",
      flat: "",
      flatType: "",
      status: "",
      occupancy: "",
    });
    toast.info("Filters reset");
  };

  const handleSubmitFlatType = () => {
    if (!newFlatType.trim()) {
      toast.error("Please enter a flat/unit type");
      return;
    }
    if (!newApartmentType) {
      toast.error("Please select an apartment type");
      return;
    }

    const newId = Math.max(...flatTypes.map((ft) => ft.id), 0) + 1;
    const newType: FlatType = {
      id: newId,
      flatUnitType: newFlatType,
      apartmentType: newApartmentType,
      status: true,
    };
    
    setFlatTypes([...flatTypes, newType]);
    setNewFlatType("");
    setNewConfiguration("");
    setNewApartmentType("");
    toast.success("Flat type added successfully!");
  };

  const handleToggleFlatTypeStatus = (id: number) => {
    setFlatTypes(
      flatTypes.map((ft) =>
        ft.id === id ? { ...ft, status: !ft.status } : ft
      )
    );
  };

  const handleEditFlatType = (id: number) => {
    setEditingFlatType(id);
    const flatType = flatTypes.find((ft) => ft.id === id);
    if (flatType) {
      setEditedApartmentType(flatType.apartmentType);
    }
  };

  const handleSaveEdit = (id: number) => {
    setFlatTypes(
      flatTypes.map((ft) =>
        ft.id === id ? { ...ft, apartmentType: editedApartmentType } : ft
      )
    );
    setEditingFlatType(null);
    setEditedApartmentType("");
    toast.success("Flat type updated successfully!");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFlats(flats.map((f) => f.id));
    } else {
      setSelectedFlats([]);
    }
  };

  const handleSelectFlat = (flatId: string, checked: boolean) => {
    if (checked) {
      setSelectedFlats([...selectedFlats, flatId]);
    } else {
      setSelectedFlats(selectedFlats.filter((id) => id !== flatId));
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionPanel(true);
  };

  const handleEditFlat = (flatId: string) => {
    console.log("Edit flat:", flatId);
    navigate(`/setup/manage-flats/edit/${flatId}`);
  };

  const handleToggleStatus = (flatId: string) => {
    setFlats(prevFlats =>
      prevFlats.map(flat =>
        flat.id === flatId
          ? { ...flat, status: flat.status === "active" ? "inactive" : "active" }
          : flat
      )
    );
    toast.success("Status updated successfully!");
  };

  // Render cell content based on column key
  const renderCell = (flat: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEditFlat(flat.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          </div>
        );
      case "status":
        const isActive = flat.status === "active";
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleToggleStatus(flat.id)}
              style={{
                backgroundColor: isActive ? "#22c55e" : "#ef4444",
              }}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActive ? "focus:ring-green-300" : "focus:ring-red-300"
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isActive ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        );
      case "sold":
      case "possession":
      case "occupancy":
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">
              {flat[columnKey] || "-"}
            </span>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">{flat[columnKey] || "-"}</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Manage Flats</h1>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <EnhancedTable
            columns={columns}
            data={flats}
            onRowClick={(flat) => console.log("Row clicked:", flat)}
            renderCell={renderCell}
            selectedItems={selectedFlats}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectFlat}
            enableSelection={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search flats..."
            leftActions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddFlat}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddUnit}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Unit
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddTower}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tower
                </Button>
                <Button
                  size="sm"
                  onClick={handleImport}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  size="sm"
                  onClick={handleExport}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={handleFilters}
                  className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] border-none"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            }
          />
        </div>

        {/* Add Flat Dialog */}
        <Dialog open={showAddFlatDialog} onOpenChange={setShowAddFlatDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Add Flat</DialogTitle>
                <button
                  onClick={() => setShowAddFlatDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Status, Possession, Sold Toggles */}
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status:</Label>
                  <Switch
                    id="status"
                    checked={addFlatFormData.status}
                    onCheckedChange={(checked) => handleAddFlatInputChange('status', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="possession" className="text-sm font-medium">Possession:</Label>
                  <Switch
                    id="possession"
                    checked={addFlatFormData.possession}
                    onCheckedChange={(checked) => handleAddFlatInputChange('possession', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sold" className="text-sm font-medium">Sold:</Label>
                  <Switch
                    id="sold"
                    checked={addFlatFormData.sold}
                    onCheckedChange={(checked) => handleAddFlatInputChange('sold', checked)}
                  />
                </div>
              </div>

              {/* Tower and Flat */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tower" className="text-sm font-medium">
                    Tower <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={addFlatFormData.tower} 
                    onValueChange={(value) => handleAddFlatInputChange('tower', value)}
                  >
                    <SelectTrigger id="tower">
                      <SelectValue placeholder="Select Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FM">FM</SelectItem>
                      <SelectItem value="MLCP1">MLCP1</SelectItem>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flat" className="text-sm font-medium">
                    Flat <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="flat"
                    placeholder="Enter Flat Number"
                    value={addFlatFormData.flat}
                    onChange={(e) => handleAddFlatInputChange('flat', e.target.value)}
                  />
                </div>
              </div>

              {/* Carpet Area and Built up Area */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carpetArea" className="text-sm font-medium">Carpet Area</Label>
                  <Input
                    id="carpetArea"
                    placeholder="Enter Carpet Area"
                    value={addFlatFormData.carpetArea}
                    onChange={(e) => handleAddFlatInputChange('carpetArea', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="builtUpArea" className="text-sm font-medium">Built up Area</Label>
                  <Input
                    id="builtUpArea"
                    placeholder="Enter Built up Area"
                    value={addFlatFormData.builtUpArea}
                    onChange={(e) => handleAddFlatInputChange('builtUpArea', e.target.value)}
                  />
                </div>
              </div>

              {/* Flat Type and Occupied */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flatType" className="text-sm font-medium">Flat Type</Label>
                  <Select 
                    value={addFlatFormData.flatType} 
                    onValueChange={(value) => handleAddFlatInputChange('flatType', value)}
                  >
                    <SelectTrigger id="flatType">
                      <SelectValue placeholder="Select Flat Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 BHK - Apartment">1 BHK - Apartment</SelectItem>
                      <SelectItem value="2 BHK - Apartment">2 BHK - Apartment</SelectItem>
                      <SelectItem value="3 BHK - Apartment">3 BHK - Apartment</SelectItem>
                      <SelectItem value="3 BHK Luxe-Deck - Apartment">3 BHK Luxe-Deck - Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupied" className="text-sm font-medium">Occupied</Label>
                  <Select 
                    value={addFlatFormData.occupied} 
                    onValueChange={(value) => handleAddFlatInputChange('occupied', value)}
                  >
                    <SelectTrigger id="occupied">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Name on Bill and Date of possession */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameOnBill" className="text-sm font-medium">Name on Bill</Label>
                  <Input
                    id="nameOnBill"
                    placeholder="Enter Name on Bill"
                    value={addFlatFormData.nameOnBill}
                    onChange={(e) => handleAddFlatInputChange('nameOnBill', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfPossession" className="text-sm font-medium">Date of possession</Label>
                  <Input
                    id="dateOfPossession"
                    type="date"
                    placeholder="Date of Possession"
                    value={addFlatFormData.dateOfPossession}
                    onChange={(e) => handleAddFlatInputChange('dateOfPossession', e.target.value)}
                  />
                </div>
              </div>

              {/* Rm User */}
              <div className="space-y-2">
                <Label htmlFor="rmUser" className="text-sm font-medium">Rm User</Label>
                <Select 
                  value={addFlatFormData.rmUser} 
                  onValueChange={(value) => handleAddFlatInputChange('rmUser', value)}
                >
                  <SelectTrigger id="rmUser">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                    <SelectItem value="user3">User 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSubmitAddFlat}
                  className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-8"
                >
                  Submit
                </Button>
              </div>

              {/* Attachment Documents */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-base font-semibold">Attachment Documents</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    multiple
                  />
                  <Label
                    htmlFor="fileUpload"
                    className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Upload className="h-4 w-4" />
                    Choose a file...
                  </Label>
                </div>
                <Button
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  variant="outline"
                  className="w-fit"
                >
                  upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Configure Tower Dialog */}
        <Dialog open={showConfigureTowerDialog} onOpenChange={setShowConfigureTowerDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Configure Tower
                </DialogTitle>
                <button
                  onClick={() => setShowConfigureTowerDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {/* Add New Tower Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tower-name">Tower Name</Label>
                  <Input
                    id="tower-name"
                    placeholder="Enter Tower Name"
                    value={newTowerName}
                    onChange={(e) => setNewTowerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tower-abbreviation">Abbreviation</Label>
                  <Input
                    id="tower-abbreviation"
                    placeholder="Enter Abbreviation"
                    value={newTowerAbbreviation}
                    onChange={(e) => setNewTowerAbbreviation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <Button
                  onClick={handleSubmitTower}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit
                </Button>
              </div>

              {/* Tower List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tower List</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Id
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Tower
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Abbreviation
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {towers.map((tower) => (
                        <tr key={tower.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {tower.id}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {editingTower === tower.id ? (
                              <Input
                                value={editedTowerData.name}
                                onChange={(e) =>
                                  setEditedTowerData({ ...editedTowerData, name: e.target.value })
                                }
                                className="w-full"
                              />
                            ) : (
                              <div>
                                <div className="text-gray-900 font-medium">{tower.name || "-"}</div>
                                {tower.createdBy && (
                                  <div className="text-xs text-gray-500">Created By - {tower.createdBy}</div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {editingTower === tower.id ? (
                              <Input
                                value={editedTowerData.abbreviation}
                                onChange={(e) =>
                                  setEditedTowerData({ ...editedTowerData, abbreviation: e.target.value })
                                }
                                className="w-full"
                              />
                            ) : (
                              <span className="text-gray-900">{tower.abbreviation || "-"}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={tower.status}
                                onCheckedChange={() => handleToggleTowerStatus(tower.id)}
                                className="h-5 w-5"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {editingTower === tower.id ? (
                              <button
                                onClick={() => handleSaveTowerEdit(tower.id)}
                                className="text-green-600 hover:text-green-800 inline-flex items-center justify-center"
                                title="Save"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditTower(tower.id)}
                                className="text-gray-600 hover:text-gray-800 inline-flex items-center justify-center"
                                title="Edit"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Configure Flat Type Dialog */}
        <Dialog open={showConfigureDialog} onOpenChange={setShowConfigureDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Configure Flat Type
                </DialogTitle>
                <button
                  onClick={() => setShowConfigureDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {/* Add New Flat Type Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flat-type">Flat/Unit Type</Label>
                  <Input
                    id="flat-type"
                    placeholder="Enter Flat Type"
                    value={newFlatType}
                    onChange={(e) => setNewFlatType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="configuration">Configuration</Label>
                  <Select value={newConfiguration} onValueChange={setNewConfiguration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1bhk">1 BHK</SelectItem>
                      <SelectItem value="2bhk">2 BHK</SelectItem>
                      <SelectItem value="3bhk">3 BHK</SelectItem>
                      <SelectItem value="4bhk">4 BHK</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apartment-type">Apartment Type</Label>
                <Select value={newApartmentType} onValueChange={setNewApartmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Shop">Shop</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-start">
                <Button
                  onClick={handleSubmitFlatType}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit
                </Button>
              </div>

              {/* Flat/Unit Type List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Flat/Unit Type List</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Id
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Flat/Unit Type
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Apartment Type
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {flatTypes.map((flatType) => (
                        <tr key={flatType.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {flatType.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {flatType.flatUnitType}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {editingFlatType === flatType.id ? (
                              <Select
                                value={editedApartmentType}
                                onValueChange={setEditedApartmentType}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Apartment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Apartment">Apartment</SelectItem>
                                  <SelectItem value="Villa">Villa</SelectItem>
                                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  <SelectItem value="Studio">Studio</SelectItem>
                                  <SelectItem value="Office">Office</SelectItem>
                                  <SelectItem value="Shop">Shop</SelectItem>
                                  <SelectItem value="Parking">Parking</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-gray-500">
                                {flatType.apartmentType || "Select Apartment"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={flatType.status}
                                onCheckedChange={() => handleToggleFlatTypeStatus(flatType.id)}
                                className="h-5 w-5"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {editingFlatType === flatType.id ? (
                              <button
                                onClick={() => handleSaveEdit(flatType.id)}
                                className="text-green-600 hover:text-green-800 inline-flex items-center justify-center"
                                title="Save"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditFlatType(flatType.id)}
                                className="text-gray-600 hover:text-gray-800 inline-flex items-center justify-center"
                                title="Edit"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters Dialog */}
        <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
                <button
                  onClick={() => setShowFiltersDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-5 gap-4">
                {/* Select Tower */}
                <div className="space-y-2">
                  <Label htmlFor="filter-tower" className="text-sm font-medium text-gray-700">
                    Select Tower
                  </Label>
                  <Select
                    value={filters.tower}
                    onValueChange={(value) => handleFilterChange("tower", value)}
                  >
                    <SelectTrigger id="filter-tower" className="w-full">
                      <SelectValue placeholder="Select Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Towers</SelectItem>
                      <SelectItem value="FM">FM</SelectItem>
                      <SelectItem value="MLCP1">MLCP1</SelectItem>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Tower 1">Tower 1</SelectItem>
                      <SelectItem value="Tower 10">Tower 10</SelectItem>
                      <SelectItem value="Tower 11">Tower 11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Flat */}
                <div className="space-y-2">
                  <Label htmlFor="filter-flat" className="text-sm font-medium text-gray-700">
                    Select Flat
                  </Label>
                  <Select
                    value={filters.flat}
                    onValueChange={(value) => handleFilterChange("flat", value)}
                  >
                    <SelectTrigger id="filter-flat" className="w-full">
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Flats</SelectItem>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="103">103</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Soc_office">Soc_office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Flat Type */}
                <div className="space-y-2">
                  <Label htmlFor="filter-flatType" className="text-sm font-medium text-gray-700">
                    Select Flat Type
                  </Label>
                  <Select
                    value={filters.flatType}
                    onValueChange={(value) => handleFilterChange("flatType", value)}
                  >
                    <SelectTrigger id="filter-flatType" className="w-full">
                      <SelectValue placeholder="Select Flat Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="1BHK">1 BHK - Apartment</SelectItem>
                      <SelectItem value="2BHK">2 BHK - Apartment</SelectItem>
                      <SelectItem value="3BHK">3 BHK - Apartment</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Shop">Shop</SelectItem>
                      <SelectItem value="Parking">Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Status */}
                <div className="space-y-2">
                  <Label htmlFor="filter-status" className="text-sm font-medium text-gray-700">
                    Select Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger id="filter-status" className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Occupancy */}
                <div className="space-y-2">
                  <Label htmlFor="filter-occupancy" className="text-sm font-medium text-gray-700">
                    Select Occupancy
                  </Label>
                  <Select
                    value={filters.occupancy}
                    onValueChange={(value) => handleFilterChange("occupancy", value)}
                  >
                    <SelectTrigger id="filter-occupancy" className="w-full">
                      <SelectValue placeholder="Select Occupancy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
