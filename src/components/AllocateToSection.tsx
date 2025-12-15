
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, MenuItem, ThemeProvider, createTheme } from '@mui/material';
import { useAllocationData } from '@/hooks/useAllocationData';

interface AllocateToSectionProps {
  allocateTo: string;
  setAllocateTo: (value: string) => void;
  allocatedToId: number | null;
  setAllocatedToId: (value: number | null) => void;
  type?: string; // Optional type parameter for API filtering
  siteId?: number | null; // Optional site ID parameter for API filtering
}

// Custom theme for MUI dropdowns (same as MovementToSection)
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

export const AllocateToSection: React.FC<AllocateToSectionProps> = ({
  allocateTo,
  setAllocateTo,
  allocatedToId,
  setAllocatedToId,
  type,
  siteId,
}) => {
  const { departments, users, loading } = useAllocationData(type, siteId);
  return (
    <div className="mb-6">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Allocate To</h3>
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
        <div className="flex-shrink-0">
          <RadioGroup value={allocateTo} onValueChange={setAllocateTo} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="department" id="department" />
              <Label htmlFor="department" className="text-sm">Department</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="text-sm">User</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex-1 max-w-full lg:max-w-xs">
          <ThemeProvider theme={dropdownTheme}>
            <TextField
              select
              label={allocateTo === 'department' ? 'Department' : 'User'}
              value={allocatedToId || ''}
              onChange={(e) => setAllocatedToId(e.target.value ? Number(e.target.value) : null)}
              variant="outlined"
              size="small"
              placeholder={allocateTo === 'department' ? 'Select Department' : 'Select User'}
              disabled={loading.departments || loading.users}
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return <span style={{ color: '#9CA3AF' }}>{allocateTo === 'department' ? 'Select Department' : 'Select User'}</span>;
                  }
                  if (allocateTo === 'department') {
                    const dept = departments.find(d => d.id === Number(selected));
                    return dept?.department_name || 'Select Department';
                  } else {
                    const user = users.find(u => u.id === Number(selected));
                    return user?.full_name || 'Select User';
                  }
                },
              }}
            >
              {allocateTo === 'department'
                ? departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </MenuItem>
                ))
                : users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name}
                  </MenuItem>
                ))
              }
            </TextField>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};
