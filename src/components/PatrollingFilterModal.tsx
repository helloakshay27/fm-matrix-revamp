
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
  fetchPatrollingFilterOptions,
  type PatrollingFilterOptions,
} from '@/services/patrollingResponsesAPI';
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
  patrolId?: string | number | null;
  scheduleDateFrom?: string;
  scheduleDateTo?: string;
  patrolDateFrom?: string;
  patrolDateTo?: string;
  submittedById?: string | number | null;
  approvedById?: string | number | null;
}

const EMPTY_FILTERS: PatrollingFilters = {
  searchTerm: '',
  buildingId: null,
  wingId: null,
  areaId: null,
  floorId: null,
  roomId: null,
  status: '',
  patrolId: null,
  scheduleDateFrom: '',
  scheduleDateTo: '',
  patrolDateFrom: '',
  patrolDateTo: '',
  submittedById: null,
  approvedById: null,
};

const EMPTY_OPTIONS: PatrollingFilterOptions = { patrols: [], statuses: [], submitted_by: [], approved_by: [] };

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

  const [filters, setFilters] = useState<PatrollingFilters>(EMPTY_FILTERS);
  const [options, setOptions] = useState<PatrollingFilterOptions>(EMPTY_OPTIONS);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const siteId = localStorage.getItem('selectedSiteId');
      if (siteId) {
        dispatch(fetchAllBuildings(parseInt(siteId)));
      }
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setOptionsLoading(true);
    fetchPatrollingFilterOptions()
      .then((res) => !cancelled && setOptions(res))
      .catch(() => !cancelled && toast.error('Could not load filter options'))
      .finally(() => !cancelled && setOptionsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

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
          dispatch(fetchAreas({ buildingId: updated.buildingId as number, wingId: value as number }));
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
    const resetFilters: PatrollingFilters = { ...EMPTY_FILTERS };
    
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white [&>button]:hidden" aria-describedby="filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Search Section */}
      

          {/* Patrol Details */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Patrol Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Patrol Name</InputLabel>
                <MuiSelect
                  value={filters.patrolId ?? ''}
                  onChange={(e) => handleInputChange('patrolId', e.target.value === '' ? null : (e.target.value as string | number))}
                  label="Patrol Name"
                  notched
                  displayEmpty
                  disabled={optionsLoading}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Patrol Name</em>
                  </MenuItem>
                  {options.patrols.map((o) => (
                    <MenuItem key={String(o.value)} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect
                  value={filters.status ?? ''}
                  onChange={(e) => handleInputChange('status', e.target.value === '' ? null : (e.target.value as string | number))}
                  label="Status"
                  notched
                  displayEmpty
                  disabled={optionsLoading}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  {options.statuses.map((o) => (
                    <MenuItem key={String(o.value)} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <TextField
                fullWidth
                type="date"
                label="Schedule Date From"
                variant="outlined"
                value={filters.scheduleDateFrom || ''}
                onChange={(e) => handleInputChange('scheduleDateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
              <TextField
                fullWidth
                type="date"
                label="Schedule Date To"
                variant="outlined"
                value={filters.scheduleDateTo || ''}
                onChange={(e) => handleInputChange('scheduleDateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
              <TextField
                fullWidth
                type="date"
                label="Patrol Date From"
                variant="outlined"
                value={filters.patrolDateFrom || ''}
                onChange={(e) => handleInputChange('patrolDateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
              <TextField
                fullWidth
                type="date"
                label="Patrol Date To"
                variant="outlined"
                value={filters.patrolDateTo || ''}
                onChange={(e) => handleInputChange('patrolDateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Submitted by</InputLabel>
                <MuiSelect
                  value={filters.submittedById ?? ''}
                  onChange={(e) => handleInputChange('submittedById', e.target.value === '' ? null : (e.target.value as string | number))}
                  label="Submitted by"
                  notched
                  displayEmpty
                  disabled={optionsLoading}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Submitted by</em>
                  </MenuItem>
                  {options.submitted_by.map((o) => (
                    <MenuItem key={String(o.value)} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Approved by</InputLabel>
                <MuiSelect
                  value={filters.approvedById ?? ''}
                  onChange={(e) => handleInputChange('approvedById', e.target.value === '' ? null : (e.target.value as string | number))}
                  label="Approved by"
                  notched
                  displayEmpty
                  disabled={optionsLoading}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Approved by</em>
                  </MenuItem>
                  {options.approved_by.map((o) => (
                    <MenuItem key={String(o.value)} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

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
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-11 px-8 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button
              className="h-11 px-8 bg-[#1A1A18] text-white hover:bg-black"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
