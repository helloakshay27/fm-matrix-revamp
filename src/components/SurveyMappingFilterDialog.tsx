import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";

interface SurveyMappingFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SurveyMappingFilters) => void;
}

export interface SurveyMappingFilters {
  siteIds?: string[];
  buildingIds?: string[];
  wingIds?: string[];
  floorIds?: string[];
  areaIds?: string[];
  roomIds?: string[];
  surveyTitle?: string;
}

interface LocationOption {
  id: number;
  name: string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const SurveyMappingFilterDialog: React.FC<SurveyMappingFilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedWing, setSelectedWing] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Location options
  const [sites, setSites] = useState<LocationOption[]>([]);
  const [buildings, setBuildings] = useState<LocationOption[]>([]);
  const [wings, setWings] = useState<LocationOption[]>([]);
  const [floors, setFloors] = useState<LocationOption[]>([]);
  const [areas, setAreas] = useState<LocationOption[]>([]);
  const [rooms, setRooms] = useState<LocationOption[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  // Fetch buildings when site changes
  useEffect(() => {
    if (selectedSite) {
      fetchBuildings(selectedSite);
    } else {
      setBuildings([]);
      setSelectedBuilding("");
      setWings([]);
      setSelectedWing("");
      setFloors([]);
      setSelectedFloor("");
      setAreas([]);
      setSelectedArea("");
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedSite]);

  // Fetch wings when building changes
  useEffect(() => {
    if (selectedBuilding) {
      fetchWings(selectedBuilding);
    } else {
      setWings([]);
      setSelectedWing("");
      setFloors([]);
      setSelectedFloor("");
      setAreas([]);
      setSelectedArea("");
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedBuilding]);

  // Fetch floors when wing changes
  useEffect(() => {
    if (selectedWing) {
      fetchFloors(selectedWing);
    } else {
      setFloors([]);
      setSelectedFloor("");
      setAreas([]);
      setSelectedArea("");
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedWing]);

  // Fetch areas when floor changes
  useEffect(() => {
    if (selectedFloor) {
      fetchAreas(selectedFloor);
    } else {
      setAreas([]);
      setSelectedArea("");
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedFloor]);

  // Fetch rooms when area changes
  useEffect(() => {
    if (selectedArea) {
      fetchRooms(selectedArea);
    } else {
      setRooms([]);
      setSelectedRoom("");
    }
  }, [selectedArea]);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/pms/sites.json");
      // Handle both array and object with sites property
      const sitesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.sites || []);
      setSites(sitesData);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to fetch sites");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuildings = async (siteId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/pms/sites/${siteId}/buildings.json`);
      // Handle both array and object with buildings property
      const buildingsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.buildings || []);
      setBuildings(buildingsData);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      toast.error("Failed to fetch buildings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWings = async (buildingId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/pms/wings.json?building_id=${buildingId}`);
      // Handle both array and object with wings property
      const wingsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.wings || []);
      setWings(wingsData);
    } catch (error) {
      console.error("Error fetching wings:", error);
      toast.error("Failed to fetch wings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFloors = async (wingId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/pms/floors.json?wing_id=${wingId}`);
      // Handle both array and object with floors property
      const floorsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.floors || []);
      setFloors(floorsData);
    } catch (error) {
      console.error("Error fetching floors:", error);
      toast.error("Failed to fetch floors");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAreas = async (floorId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/pms/areas.json?floor_id=${floorId}`);
      // Handle both array and object with areas property
      const areasData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.areas || []);
      setAreas(areasData);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Failed to fetch areas");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async (areaId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/pms/rooms.json?area_id=${areaId}`);
      // Handle both array and object with rooms property
      const roomsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.rooms || []);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const filters: SurveyMappingFilters = {
        surveyTitle: surveyTitle.trim() || undefined,
        siteIds: selectedSite ? [selectedSite] : undefined,
        buildingIds: selectedBuilding ? [selectedBuilding] : undefined,
        wingIds: selectedWing ? [selectedWing] : undefined,
        floorIds: selectedFloor ? [selectedFloor] : undefined,
        areaIds: selectedArea ? [selectedArea] : undefined,
        roomIds: selectedRoom ? [selectedRoom] : undefined,
      };

      console.log("Applying survey mapping filters:", filters);
      onApply(filters);
      onClose();
      toast.success("Filters applied successfully");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSurveyTitle("");
    setSelectedSite("");
    setSelectedBuilding("");
    setSelectedWing("");
    setSelectedFloor("");
    setSelectedArea("");
    setSelectedRoom("");
    setBuildings([]);
    setWings([]);
    setFloors([]);
    setAreas([]);
    setRooms([]);
    
    onApply({});
    toast.success("Filters cleared successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="survey-mapping-filter-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            FILTER SURVEY MAPPINGS
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="survey-mapping-filter-dialog-description" className="sr-only">
            Filter survey mappings by survey title and location hierarchy (site, building, wing, floor, area, room)
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Survey Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Survey Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <TextField
                label="Survey Title"
                placeholder="Enter Survey Title"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Location Hierarchy Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Location Hierarchy
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Site Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Site</InputLabel>
                <MuiSelect
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  label="Site"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Site</em>
                  </MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id.toString()}>
                      {site.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Building Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  label="Building"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={!selectedSite}
                >
                  <MenuItem value="">
                    <em>Select Building</em>
                  </MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Wing Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={selectedWing}
                  onChange={(e) => setSelectedWing(e.target.value)}
                  label="Wing"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={!selectedBuilding}
                >
                  <MenuItem value="">
                    <em>Select Wing</em>
                  </MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Floor Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  label="Floor"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={!selectedWing}
                >
                  <MenuItem value="">
                    <em>Select Floor</em>
                  </MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id.toString()}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Area Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  label="Area"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={!selectedFloor}
                >
                  <MenuItem value="">
                    <em>Select Area</em>
                  </MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Room Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Room</InputLabel>
                <MuiSelect
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  label="Room"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                  disabled={!selectedArea}
                >
                  <MenuItem value="">
                    <em>Select Room</em>
                  </MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleApply}
            disabled={isLoading}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex-1 h-11"
          >
            {isLoading ? "Applying..." : "Apply Filter"}
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
