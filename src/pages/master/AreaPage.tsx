import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from "@/utils/apiClient";
import { ImportDataModal } from '@/components/ImportDataModal';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { AddAreaDialog } from '@/components/AddAreaDialog';

export const AreaPage = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [wingId, setWingId] = useState('');
  const [active, setActive] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchAreas = async () => {
    try {
      const response = await apiClient.get('/pms/areas.json');
      setAreas(response.data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to fetch areas');
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await apiClient.get('/buildings.json');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to fetch buildings');
    }
  };

  const fetchWings = async () => {
    try {
      const response = await apiClient.get('/pms/wings.json');
      setWings(response.data.wings || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      toast.error('Failed to fetch wings');
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchBuildings();
    fetchWings();
  }, []);

  // Reset pagination when areas data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [areas.length]);

  // Filter areas based on search term
  const filteredAreas = areas.filter(area => {
    const searchLower = searchTerm.toLowerCase();
    return (
      area.name?.toLowerCase().includes(searchLower) ||
      area.building?.name?.toLowerCase().includes(searchLower) ||
      area.wing?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalItems = filteredAreas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAreas = filteredAreas.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setName(area.name);
    setBuildingId(area.building_id);
    setWingId(area.wing_id);
    setActive(area.active);
    setIsEditModalOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleImportAreas = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsImporting(true);
    console.log('Starting area import process for file:', selectedFile.name);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', 'areas');

      // Make API call to import areas
      const response = await apiClient.post('/pms/areas/bulk_import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Areas imported successfully');
        setSelectedFile(null);
        setIsImportModalOpen(false);
        await fetchAreas(); // Refresh the areas list
      } else {
        toast.error(response.data.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import areas. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadSampleFormat = () => {
    console.log('Downloading sample format for areas...');

    // Create sample CSV data for areas
    const sampleData = [
      ['Area Name', 'Building ID', 'Wing ID', 'Status'],
      ['Reception Area', '1', '1', 'active'],
      ['Conference Room', '1', '2', 'active'],
      ['Lobby', '2', '3', 'active'],
      ['Storage Room', '2', '4', 'inactive']
    ];

    // Convert to CSV format
    const csvContent = sampleData.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'areas_sample_format.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success('Sample format downloaded successfully');
  };

  const handleUpdateArea = async () => {
    if (!selectedArea) return;

    try {
      const response = await apiClient.put(`/pms/areas/${selectedArea.id}.json`, {
        pms_area: {
          name,
          building_id: buildingId,
          wing_id: wingId,
          active,
        },
      });

      if (response.status === 200) {
        toast.success('Area updated successfully');
        setIsEditModalOpen(false);
        fetchAreas();
      } else {
        toast.error('Failed to update area');
      }
    } catch (error) {
      console.error('Error updating area:', error);
      toast.error('Failed to update area');
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      const response = await apiClient.delete(`/pms/areas/${id}.json`);

      if (response.status === 200) {
        toast.success('Area deleted successfully');
        fetchAreas();
      } else {
        toast.error('Failed to delete area');
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Failed to delete area');
    }
  };

  const handleToggleStatus = async (area: any) => {
    try {
      const response = await apiClient.put(`/pms/areas/${area.id}.json`, {
        pms_area: {
          ...area,
          active: !area.active,
        },
      });

      if (response.status === 200) {
        toast.success(`Area ${!area.active ? 'activated' : 'deactivated'} successfully`);
        fetchAreas();
      } else {
        toast.error('Failed to update area status');
      }
    } catch (error) {
      console.error('Error updating area status:', error);
      toast.error('Failed to update area status');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">


      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AREA</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>

          <Button onClick={() => setIsImportModalOpen(true)} style={{ backgroundColor: '#C72030' }} className="text-white hover:opacity-90 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Search:</span>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            placeholder="Search areas..."
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No areas found
                </TableCell>
              </TableRow>
            ) : filteredAreas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No areas match your search
                </TableCell>
              </TableRow>
            ) : (
              currentAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell>

                    <Button variant="ghost" size="sm" onClick={() => handleEdit(area)}>
                      <Edit className="w-4 h-4 text-[#C72030]" />
                    </Button>

                  </TableCell>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>{area.building?.name || 'N/A'}</TableCell>
                  <TableCell>{area.wing?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <button onClick={() => handleToggleStatus(area)} className="cursor-pointer">
                      {area.active ? (
                        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                          <span className="text-white text-xs">✗</span>
                        </div>
                      )}
                    </button>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {areas.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} areas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {/* Show first page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="w-8 h-8 p-0"
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                .map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}

              {/* Show last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Area Dialog */}
      <AddAreaDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAreaAdded={fetchAreas}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Area</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="building" className="text-right">
                Building
              </Label>
              <Select value={buildingId} onValueChange={setBuildingId} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wing" className="text-right">
                Wing
              </Label>
              <Select value={wingId} onValueChange={setWingId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a wing" />
                </SelectTrigger>
                <SelectContent>
                  {wings.map((wing) => (
                    <SelectItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Status
              </Label>
              <Switch id="active" checked={active} onCheckedChange={setActive} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdateArea} style={{ backgroundColor: '#C72030' }} className="text-white hover:opacity-90">Update Area</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Areas</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="area-file-upload"
              />
              <label htmlFor="area-file-upload" className="cursor-pointer">
                <div className="text-gray-600">
                  <span className="text-[#C72030] font-medium">Choose File</span>
                  <p className="text-sm mt-1">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleDownloadSampleFormat}
                variant="outline"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                disabled={isImporting}
              >
                Download Sample Format
              </Button>
              <Button
                onClick={handleImportAreas}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
                disabled={!selectedFile || isImporting}
              >
                {isImporting ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
