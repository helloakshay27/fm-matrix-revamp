
import React, { useEffect } from 'react';
import { TextField, MenuItem, ThemeProvider, createTheme } from '@mui/material';
import { useLocationData } from '@/hooks/useLocationData';

interface MovementToSectionProps {
  siteId: number | null;
  setSiteId: (value: number | null) => void;
  buildingId: number | null;
  setBuildingId: (value: number | null) => void;
  wingId: number | null;
  setWingId: (value: number | null) => void;
  areaId: number | null;
  setAreaId: (value: number | null) => void;
  floorId: number | null;
  setFloorId: (value: number | null) => void;
  roomId: number | null;
  setRoomId: (value: number | null) => void;
}

// Custom theme for MUI dropdowns
const dropdownTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md
            backgroundColor: '#FFFFFF',
            height: '45px', // Desktop height
            '@media (max-width: 768px)': {
              height: '36px', // Mobile height
            },
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: '6px',
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C72030',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#1A1A1A',
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#C72030',
            },
          },
          '& .MuiSelect-select': {
            color: '#1A1A1A',
            fontSize: '14px',
            '@media (max-width: 768px)': {
              fontSize: '12px',
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
          '&.Mui-selected': {
            backgroundColor: '#C72030',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#B01E2F',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '6px',
        },
      },
    },
  },
});

export const MovementToSection: React.FC<MovementToSectionProps> = ({
  siteId,
  setSiteId,
  buildingId,
  setBuildingId,
  wingId,
  setWingId,
  areaId,
  setAreaId,
  floorId,
  setFloorId,
  roomId,
  setRoomId,
}) => {
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
  } = useLocationData();

  // Handle cascading dropdown changes
  useEffect(() => {
    if (siteId) {
      fetchBuildings(siteId);
      // Reset dependent dropdowns
      setBuildingId(null);
      setWingId(null);
      setAreaId(null);
      setFloorId(null);
      setRoomId(null);
    }
  }, [siteId]);

  useEffect(() => {
    if (buildingId) {
      fetchWings(buildingId);
      // Reset dependent dropdowns
      setWingId(null);
      setAreaId(null);
      setFloorId(null);
      setRoomId(null);
    }
  }, [buildingId]);

  useEffect(() => {
    if (wingId) {
      fetchAreas(wingId);
      // Reset dependent dropdowns
      setAreaId(null);
      setFloorId(null);
      setRoomId(null);
    }
  }, [wingId]);

  useEffect(() => {
    if (areaId) {
      fetchFloors(areaId);
      // Reset dependent dropdowns
      setFloorId(null);
      setRoomId(null);
    }
  }, [areaId]);

  useEffect(() => {
    if (floorId) {
      fetchRooms(floorId);
      // Reset dependent dropdowns
      setRoomId(null);
    }
  }, [floorId]);

  return (
    <div className="mb-6">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Movement To</h3>
      <ThemeProvider theme={dropdownTheme}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <TextField
            select
            label="Site*"
            value={siteId || ''}
            onChange={(e) => setSiteId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Site"
            disabled={loading.sites}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Site</span>;
                }
                const site = sites.find(s => s.id === Number(selected));
                return site?.name || 'Select Site';
              },
            }}
          >
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Building*"
            value={buildingId || ''}
            onChange={(e) => setBuildingId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Building"
            disabled={!siteId || loading.buildings}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Building</span>;
                }
                const building = buildings.find(b => b.building.id === Number(selected));
                return building?.building.name || 'Select Building';
              },
            }}
          >
            {buildings.map((building) => (
              <MenuItem key={building.id} value={building.id}>
                {building.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Wing*"
            value={wingId || ''}
            onChange={(e) => setWingId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Wing"
            disabled={!buildingId || loading.wings}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Wing</span>;
                }
                const wing = wings.find(w => w.wings.id === Number(selected));
                return wing?.wings.name || 'Select Wing';
              },
            }}
          >
            {wings.map((wing) => (
              <MenuItem key={wing.wings.id} value={wing.wings.id}>
                {wing.wings.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Area*"
            value={areaId || ''}
            onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Area"
            disabled={!wingId || loading.areas}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Area</span>;
                }
                const area = areas.find(a => a.id === Number(selected));
                return area?.name || 'Select Area';
              },
            }}
          >
            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                {area.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Floor*"
            value={floorId || ''}
            onChange={(e) => setFloorId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Floor"
            disabled={!areaId || loading.floors}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Floor</span>;
                }
                const floor = floors.find(f => f.id === Number(selected));
                return floor?.name || 'Select Floor';
              },
            }}
          >
            {floors.map((floor) => (
              <MenuItem key={floor.id} value={floor.id}>
                {floor.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Room*"
            value={roomId || ''}
            onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
            variant="outlined"
            size="small"
            placeholder="Select Room"
            disabled={!floorId || loading.rooms}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Room</span>;
                }
                const room = rooms.find(r => r.rooms.id === Number(selected));
                return room?.rooms.name || 'Select Room';
              },
            }}
          >
            {rooms.map((room) => (
              <MenuItem key={room.rooms.id} value={room.rooms.id}>
                {room.rooms.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </ThemeProvider>
    </div>
  );
};
