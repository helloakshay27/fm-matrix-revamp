
import React from 'react';
import { TextField, MenuItem, ThemeProvider, createTheme } from '@mui/material';

interface MovementToSectionProps {
  site: string;
  setSite: (value: string) => void;
  building: string;
  setBuilding: (value: string) => void;
  wing: string;
  setWing: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  floor: string;
  setFloor: (value: string) => void;
  room: string;
  setRoom: (value: string) => void;
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
  site,
  setSite,
  building,
  setBuilding,
  wing,
  setWing,
  area,
  setArea,
  floor,
  setFloor,
  room,
  setRoom,
}) => {
  // Sample options for dropdowns
  const siteOptions = ['Haven Infoline', 'Site 2', 'Site 3'];
  const buildingOptions = ['Jyoti Tower', 'Building 2', 'Building 3'];
  const wingOptions = ['J', 'A', 'B', 'C'];
  const areaOptions = ['East', 'West', 'North', 'South'];
  const floorOptions = ['1', '2', '3', '4', '5'];
  const roomOptions = ['R 101', 'R 102', 'R 201', 'R 202', 'R 301'];

  return (
    <div className="mb-6">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Movement To</h3>
      <ThemeProvider theme={dropdownTheme}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <TextField
            select
            label="Site*"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Site"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Site</span>;
                }
                return selected as string;
              },
            }}
          >
            {siteOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Building*"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Building"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Building</span>;
                }
                return selected as string;
              },
            }}
          >
            {buildingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Wing*"
            value={wing}
            onChange={(e) => setWing(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Wing"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Wing</span>;
                }
                return selected as string;
              },
            }}
          >
            {wingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Area*"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Area"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Area</span>;
                }
                return selected as string;
              },
            }}
          >
            {areaOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Floor*"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Floor"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Floor</span>;
                }
                return selected as string;
              },
            }}
          >
            {floorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Room*"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Select Room"
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <span style={{ color: '#9CA3AF' }}>Select Room</span>;
                }
                return selected as string;
              },
            }}
          >
            {roomOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </ThemeProvider>
    </div>
  );
};
