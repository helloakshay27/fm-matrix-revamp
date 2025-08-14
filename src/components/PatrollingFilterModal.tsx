
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { toast } from 'sonner';
import { 
  fetchAllBuildings, 
  fetchWings, 
  fetchAreas, 
  fetchFloors, 
  fetchRooms 
} from '@/store/slices/serviceLocationSlice';
import type { RootState, AppDispatch } from '@/store/store';

interface PatrollingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: PatrollingFilters) => void;
}

export interface PatrollingFilters {
  searchTerm?: string;
  buildingId?: number | null;
  wingId?: number | null;
  areaId?: number | null;
  floorId?: number | null;
  roomId?: number | null;
  status?: string;
}

export const PatrollingFilterModal = ({ isOpen, onClose, onApply }: PatrollingFilterModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading
  } = useSelector((state: RootState) => state.serviceLocation);

  const [filters, setFilters] = useState<PatrollingFilters>({
    searchTerm: '',
    buildingId: null,
    wingId: null,
    areaId: null,
    floorId: null,
    roomId: null,
    status: ''
  });

  useEffect(() => {
    if (isOpen) {
      const siteId = localStorage.getItem('selectedSiteId');
      if (siteId && buildings.length === 0) {
        dispatch(fetchAllBuildings(parseInt(siteId)));
      }
    }
  }, [isOpen, dispatch, buildings.length]);

  const handleInputChange = (field: keyof PatrollingFilters, value: string | number | null) => {
    setFilters(prev => {
      const updated = { ...prev, [field]: value };

      // Clear dependent fields when parent changes
      if (field === 'buildingId') {
        updated.wingId = null;
        updated.areaId = null;
        updated.floorId = null;
        updated.roomId = null;
        
        if (value) {
          dispatch(fetchWings(value as number));
        }
      }

      if (field === 'wingId') {
        updated.areaId = null;
        updated.floorId = null;
        updated.roomId = null;
        
        if (value) {
          dispatch(fetchAreas(value as number));
        }
      }

      if (field === 'areaId') {
        updated.floorId = null;
        updated.roomId = null;
        
        if (value) {
          dispatch(fetchFloors(value as number));
        }
      }

      if (field === 'floorId') {
        updated.roomId = null;
        
        if (value) {
          dispatch(fetchRooms(value as number));
        }
      }

      return updated;
    });
  };

  const handleApply = () => {
    // Remove empty/null values
    const cleanFilters: Partial<PatrollingFilters> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        (cleanFilters as any)[key] = value;
      }
    });

    onApply(cleanFilters as PatrollingFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: PatrollingFilters = {
      searchTerm: '',
      buildingId: null,
      wingId: null,
      areaId: null,
      floorId: null,
      roomId: null,
      status: ''
    };
    
    setFilters(resetFilters);
    onApply({});
  };

  const handleClose = () => {
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    backgroundColor: 'white',
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      backgroundColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    }
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }} modal={false}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden" aria-describedby="filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Search Section */}
      

          {/* Location Details */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Building */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={filters.buildingId || ''}
                  onChange={(e) => handleInputChange('buildingId', e.target.value ? Number(e.target.value) : null)}
                  label="Building"
                  notched
                  displayEmpty
                  disabled={loading.buildings}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Building</em>
                  </MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loading.buildings && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>

              {/* Wing */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={filters.wingId || ''}
                  onChange={(e) => handleInputChange('wingId', e.target.value ? Number(e.target.value) : null)}
                  label="Wing"
                  notched
                  displayEmpty
                  disabled={!filters.buildingId || loading.wings}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Wing</em>
                  </MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loading.wings && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>

              {/* Area */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  value={filters.areaId || ''}
                  onChange={(e) => handleInputChange('areaId', e.target.value ? Number(e.target.value) : null)}
                  label="Area"
                  notched
                  displayEmpty
                  disabled={!filters.wingId || loading.areas}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Area</em>
                  </MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loading.areas && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>

              {/* Floor */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  value={filters.floorId || ''}
                  onChange={(e) => handleInputChange('floorId', e.target.value ? Number(e.target.value) : null)}
                  label="Floor"
                  notched
                  displayEmpty
                  disabled={!filters.areaId || loading.floors}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Floor</em>
                  </MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loading.floors && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>

              {/* Room */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Room</InputLabel>
                <MuiSelect
                  value={filters.roomId || ''}
                  onChange={(e) => handleInputChange('roomId', e.target.value ? Number(e.target.value) : null)}
                  label="Room"
                  notched
                  displayEmpty
                  disabled={!filters.floorId || loading.rooms}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Room</em>
                  </MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loading.rooms && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </FormControl>

              {/* Status */}
            
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 border-0"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
