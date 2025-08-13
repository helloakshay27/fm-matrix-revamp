import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Download, Filter, Eye, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
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

  // Monthly consumption data
  const monthlyData = [
    { month: 'January', dateRange: '1 to 31', amount: '₹24,000', details: generateMonthlyDetails('January') },
    { month: 'February', dateRange: '1 to 28', amount: '₹25,000', details: generateMonthlyDetails('February') },
    { month: 'March', dateRange: '1 to 31', amount: '₹26,000', details: generateMonthlyDetails('March') },
    { month: 'April', dateRange: '1 to 30', amount: '₹15,000', details: generateMonthlyDetails('April') },
    { month: 'May', dateRange: '1 to 31', amount: '₹22,000', details: generateMonthlyDetails('May') },
    { month: 'June', dateRange: '1 to 30', amount: '₹28,000', details: generateMonthlyDetails('June') },
    { month: 'July', dateRange: '1 to 31', amount: '₹30,000', details: generateMonthlyDetails('July') },
    { month: 'August', dateRange: '1 to 31', amount: '₹27,000', details: generateMonthlyDetails('August') },
    { month: 'September', dateRange: '1 to 30', amount: '₹23,000', details: generateMonthlyDetails('September') },
    { month: 'October', dateRange: '1 to 31', amount: '₹29,000', details: generateMonthlyDetails('October') },
    { month: 'November', dateRange: '1 to 30', amount: '₹25,500', details: generateMonthlyDetails('November') },
    { month: 'December', dateRange: '1 to 31', amount: '₹31,000', details: generateMonthlyDetails('December') }
  ];

  // Generate sample details for each month
  function generateMonthlyDetails(month: string) {
    return [
      { id: `${month}-1`, action: 'Consume', name: 'Tissue', contentStock: '84', consumed: '100', amount: '₹2,800' },
      { id: `${month}-2`, action: 'Consume', name: 'Hand Sanitizer', contentStock: '50', consumed: '25', amount: '₹1,250' },
      { id: `${month}-3`, action: 'Consume', name: 'Cleaning Spray', contentStock: '75', consumed: '40', amount: '₹1,600' },
      { id: `${month}-4`, action: 'Consume', name: 'Paper Towels', contentStock: '120', consumed: '80', amount: '₹2,400' },
      { id: `${month}-5`, action: 'Consume', name: 'Disinfectant', contentStock: '60', consumed: '35', amount: '₹1,750' }
    ];
  }

  // Define table columns for expanded view
  const expandedColumns: ColumnConfig[] = [
    { key: 'action', label: 'Action', sortable: false, draggable: false },
    { key: 'name', label: 'Name', sortable: true, draggable: false },
    { key: 'contentStock', label: 'Content Stock', sortable: true, draggable: false },
    { key: 'consumed', label: 'Consumed', sortable: true, draggable: false },
    { key: 'amount', label: 'Amount', sortable: true, draggable: false }
  ];

  // Render cell content for expanded table
  const renderExpandedCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    if (columnKey === 'action') {
      return (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleViewItem(item)} title="View Details">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      );
    }
    if (columnKey === 'name') {
      return <span className="font-medium text-gray-900">{value}</span>;
    }
    if (columnKey === 'amount') {
      return <span className="font-semibold text-green-600">{value}</span>;
    }
    return <span className="text-gray-700">{value}</span>;
  };

  // Toggle month expansion
  const toggleMonth = (month: string) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  // Get current month
  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return months[now.getMonth()];
  };

  const currentMonth = getCurrentMonth();

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Consumption LIST</h1>
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
      </div>

      {/* Monthly Consumption Boxes */}
      <div className="space-y-4">
        {monthlyData.map((monthData) => (
          <div 
            key={monthData.month} 
            className={`border rounded-lg bg-white shadow-sm ${
              monthData.month === currentMonth 
                ? 'border-[#C72030] border-2 shadow-md' 
                : 'border-gray-200'
            }`}
          >
            {/* Month Header Box */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleMonth(monthData.month)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{monthData.month}</h3>
                  <p className="text-sm text-gray-600">{monthData.dateRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-green-600">{monthData.amount}</span>
                {expandedMonth === monthData.month ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Table */}
            {expandedMonth === monthData.month && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4">
                  <EnhancedTable 
                    data={monthData.details} 
                    columns={expandedColumns} 
                    renderCell={renderExpandedCell}
                    storageKey={`consumption-table-${monthData.month}`}
                    emptyMessage="No consumption data available" 
                    enableExport={false} 
                    hideTableExport={true} 
                    hideTableSearch={true} 
                    hideColumnsButton={true} 
                    loading={false}
                    pagination={false}
                    selectable={false}
                    getItemId={(item) => item.id}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

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

    </div>
  );
};

export default InventoryConsumptionDashboard;