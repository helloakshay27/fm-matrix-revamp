import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Download, Filter, Eye, X } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionHistory } from '@/store/slices/inventoryConsumptionSlice';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const InventoryConsumptionDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { inventories, loading, error } = useSelector((state: RootState) => state.inventoryConsumption);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [filterValues, setFilterValues] = useState({
    group: '',
    subGroup: '',
    criticality: '',
    name: ''
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchInventoryConsumptionHistory());
  }, [dispatch]);
  
  // Transform API data to match table structure
  const consumptionData = inventories.map(item => ({
    id: item.id,
    inventory: item.name,
    stock: item.quantity.toString(),
    unit: item.unit || '',
    minStockLevel: item.min_stock_level,
    group: item.group || '-',
    subGroup: item.sub_group || '-',
    criticality: item.criticality === 0 ? 'Non-Critical' : 'Critical'
  }));

  // Calculate pagination
  const totalPages = Math.ceil(Math.max(consumptionData.length, 1) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = consumptionData.slice(startIndex, startIndex + pageSize);

  // Define table columns for drag and drop functionality
  const columns: ColumnConfig[] = [{
    key: 'actions',
    label: 'Actions',
    sortable: false,
    draggable: true
  }, {
    key: 'inventory',
    label: 'Inventory',
    sortable: true,
    draggable: true
  }, {
    key: 'stock',
    label: 'Stock',
    sortable: true,
    draggable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true,
    draggable: true
  }, {
    key: 'minStockLevel',
    label: 'Min. Stock Level',
    sortable: true,
    draggable: true
  }, {
    key: 'group',
    label: 'Group',
    sortable: true,
    draggable: true
  }, {
    key: 'subGroup',
    label: 'Sub Group',
    sortable: true,
    draggable: true
  }, {
    key: 'criticality',
    label: 'Criticality',
    sortable: true,
    draggable: true
  }];

  // Render cell content
  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleViewItem(item)} title="View Details">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      );
    }
    const value = item[columnKey];
    if (columnKey === 'criticality') {
      return <span className="text-sm text-gray-600">{value}</span>;
    }
    if (columnKey === 'inventory') {
      return <span className="font-medium">{value}</span>;
    }
    return value || '-';
  };

  // Handle MUI Select change
  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle text field change
  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Apply filters
  const handleApplyFilter = () => {
    console.log('Applied filters:', filterValues);
    setIsFilterOpen(false);
  };

  // Reset filters
  const handleResetFilter = () => {
    setFilterValues({
      group: '',
      subGroup: '',
      criticality: '',
      name: ''
    });
  };

  // Navigate to view page
  const handleViewItem = (item: any) => {
    navigate(`/maintenance/inventory-consumption/view/${item.id}`);
  };


  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Consumption LIST</h1>
        
      </div>

      {/* Enhanced Table with Drag and Drop */}
      <EnhancedTable 
        data={paginatedData} 
        columns={columns} 
        renderCell={renderCell}
        storageKey="inventory-consumption-table" 
        emptyMessage="No consumption data available" 
        enableExport={true} 
        exportFileName="inventory-consumption" 
        hideTableExport={false} 
        hideTableSearch={false} 
        hideColumnsButton={false} 
        searchPlaceholder="Search inventory items..."
        loading={loading}
        pagination={false}
        selectable={true}
        selectedItems={selectedItems}
        onSelectItem={(itemId: string, checked: boolean) => {
          if (checked) {
            setSelectedItems(prev => [...prev, itemId]);
          } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
          }
        }}
        onSelectAll={(checked: boolean) => {
          if (checked) {
            setSelectedItems(paginatedData.map(item => item.id.toString()));
          } else {
            setSelectedItems([]);
          }
        }}
        getItemId={(item) => item.id.toString()}
        leftActions={
          <div className="flex gap-3">
            <Button className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Import
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(true)}
              className="border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        }
      />

      {/* Floating Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">FILTER BY</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFilterOpen(false)} 
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-6">
              {/* First Row - Three Dropdowns */}
              <div className="grid grid-cols-3 gap-6">
                {/* Group */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel 
                    id="group-label" 
                    shrink={true}
                    sx={{
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#C72030'
                      },
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
                  >
                    Group
                  </InputLabel>
                  <Select 
                    labelId="group-label" 
                    value={filterValues.group} 
                    label="Group" 
                    onChange={handleSelectChange('group')} 
                    displayEmpty 
                    sx={{
                      height: '48px',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#D1D5DB'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C72030'
                        }
                      },
                      '& .MuiSelect-select': {
                        padding: '12px 14px'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>Select Group</span>
                    </MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                    <MenuItem value="group3">Group 3</MenuItem>
                  </Select>
                </FormControl>

                {/* Sub Group */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel 
                    id="subgroup-label" 
                    shrink={true}
                    sx={{
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#C72030'
                      },
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
                  >
                    Sub Group
                  </InputLabel>
                  <Select 
                    labelId="subgroup-label" 
                    value={filterValues.subGroup} 
                    label="Sub Group" 
                    onChange={handleSelectChange('subGroup')} 
                    displayEmpty 
                    sx={{
                      height: '48px',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#D1D5DB'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C72030'
                        }
                      },
                      '& .MuiSelect-select': {
                        padding: '12px 14px'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>Select Sub Group</span>
                    </MenuItem>
                    <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                    <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                    <MenuItem value="subgroup3">Sub Group 3</MenuItem>
                  </Select>
                </FormControl>

                {/* Criticality */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel 
                    id="criticality-label" 
                    shrink={true}
                    sx={{
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#C72030'
                      },
                      '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                      }
                    }}
                  >
                    Select Criticality
                  </InputLabel>
                  <Select 
                    labelId="criticality-label" 
                    value={filterValues.criticality} 
                    label="Select Criticality" 
                    onChange={handleSelectChange('criticality')} 
                    displayEmpty 
                    sx={{
                      height: '48px',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#D1D5DB'
                        },
                        '&:hover fieldset': {
                          borderColor: '#9CA3AF'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C72030'
                        }
                      },
                      '& .MuiSelect-select': {
                        padding: '12px 14px'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <span style={{ color: '#9CA3AF' }}>Select Criticality</span>
                    </MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="non-critical">Non-Critical</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Second Row - Name Input */}
              <div className="space-y-2">
                <TextField 
                  fullWidth 
                  label="Name" 
                  placeholder="Enter Name" 
                  value={filterValues.name} 
                  onChange={handleTextChange('name')} 
                  variant="outlined" 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '48px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#D1D5DB'
                      },
                      '&:hover fieldset': {
                        borderColor: '#9CA3AF'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: '#C72030'
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '12px 14px',
                      fontSize: '14px',
                      '&::placeholder': {
                        color: '#9CA3AF'
                      }
                    }
                  }} 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilter} 
                  className="px-8 py-3 h-12 border-2 border-gray-800 text-gray-800 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleApplyFilter} 
                  className="px-8 py-3 h-12 bg-[#6B2C91] text-white hover:bg-[#5A2479] rounded-lg font-medium"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default InventoryConsumptionDashboard;