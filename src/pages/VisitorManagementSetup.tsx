import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';
import { ticketManagementAPI } from '../services/ticketManagementAPI';

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
}

interface SocietyGateAPIResponse {
  id: number;
  gate_name: string;
  gate_device: string;
  approve: number;
  active: number;
  society?: {
    name: string;
  };
  building?: {
    name: string;
  };
  user?: {
    name: string;
  };
  created_by?: {
    name: string;
  };
}

export const VisitorManagementSetup = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    id: true,
    society: true,
    tower: true,
    gateName: true,
    gateDevice: true,
    userName: true,
    status: true,
    active: true,
    createdBy: true
  });
  const [activeTab, setActiveTab] = useState<'smartsecure' | 'quikgate'>('smartsecure');
  
  // API data state
  const [visitorGateData, setVisitorGateData] = useState<VisitorGateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const perPage = 20;

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  // Fetch society gates from API
  const fetchSocietyGates = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await ticketManagementAPI.getSocietyGates(page, perPage);
      
      console.log('Society gates API response:', response);
      
      if (response && response.smart_secure_society_gates) {
        // Map API response to component data structure
        const mappedData = response.smart_secure_society_gates.map((gate: SocietyGateAPIResponse) => ({
          id: gate.id,
          society: gate.society?.name || 'N/A',
          tower: gate.building?.name || 'N/A',
          gateName: gate.gate_name,
          gateDevice: gate.gate_device,
          userName: gate.user?.name || 'N/A',
          status: gate.approve === 1,
          active: gate.active === 1,
          createdBy: gate.created_by?.name || 'N/A'
        }));
        
        setVisitorGateData(mappedData);
        
        // Update pagination info
        if (response.smart_secure_pagination) {
          setCurrentPage(response.smart_secure_pagination.current_page);
          setTotalPages(response.smart_secure_pagination.total_pages);
          setTotalEntries(response.smart_secure_pagination.total_entries);
        }
      } else {
        console.error('Invalid society gates response format:', response);
        setVisitorGateData([]);
      }
    } catch (error) {
      console.error('Error fetching society gates:', error);
      toast.error('Failed to load society gates. Please try again.');
      setVisitorGateData([]);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchSocietyGates(currentPage);
  }, [fetchSocietyGates, currentPage]);


  const filteredData = visitorGateData.filter(item =>
    item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number, field: 'status' | 'active') => {
    setVisitorGateData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
    
    const updatedItem = visitorGateData.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem[field] : false;
    toast.success(`${field === 'status' ? 'Status' : 'Active state'} is ${newValue ? 'Active' : 'Deactive'}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/settings/visitor-management/setup/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setVisitorGateData(prevData => prevData.filter(item => item.id !== id));
    toast.success('Visitor gate deleted successfully');
  };

  const handleAdd = () => {
    navigate('/settings/visitor-management/setup/add-gate');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    // { key: 'id', label: 'ID', visible: visibleColumns.id },
    { key: 'society', label: 'Society', visible: visibleColumns.society },
    { key: 'tower', label: 'Tower', visible: visibleColumns.tower },
    { key: 'gateName', label: 'Gate Name', visible: visibleColumns.gateName },
    { key: 'gateDevice', label: 'Gate Device ID', visible: visibleColumns.gateDevice },
    { key: 'userName', label: 'User Name', visible: visibleColumns.userName },
    { key: 'status', label: 'Status', visible: visibleColumns.status },
    // { key: 'active', label: 'Active', visible: visibleColumns.active },
    { key: 'createdBy', label: 'Created By', visible: visibleColumns.createdBy }
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleAdd}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <div className="flex items-center gap-3">
          {/* <Button
            onClick={() => fetchSocietyGates(currentPage)}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.actions && <TableHead className="w-20">Actions</TableHead>}
              {/* {visibleColumns.id && <TableHead className="w-16">ID</TableHead>} */}
              {visibleColumns.society && <TableHead className="min-w-[300px]">Society</TableHead>}
              {visibleColumns.tower && <TableHead className="w-32">Tower</TableHead>}
              {visibleColumns.gateName && <TableHead className="w-32">Gate Name</TableHead>}
              {visibleColumns.gateDevice && <TableHead className="w-40">Gate Device ID</TableHead>}
              {visibleColumns.userName && <TableHead className="w-40">User Name</TableHead>}
              {visibleColumns.status && <TableHead className="w-24 text-center">Status</TableHead>}
              {/* {visibleColumns.active && <TableHead className="w-24 text-center">Active</TableHead>} */}
              {visibleColumns.createdBy && <TableHead className="w-40">Created By</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Loading society gates...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-8 text-gray-500">
                  No society gates found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  {visibleColumns.actions && (
                    <TableCell>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </TableCell>
                  )}
                  {/* {visibleColumns.id && <TableCell className="font-medium">{item.id}</TableCell>} */}
                  {visibleColumns.society && (
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={item.society}>
                        {item.society}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.tower && <TableCell>{item.tower || '--'}</TableCell>}
                  {visibleColumns.gateName && <TableCell>{item.gateName}</TableCell>}
                  {visibleColumns.gateDevice && <TableCell className="font-mono text-sm">{item.gateDevice}</TableCell>}
                  {visibleColumns.userName && <TableCell>{item.userName}</TableCell>}
                  {visibleColumns.status && (
                    <TableCell className="text-center">
                      <Switch
                        checked={item.status}
                        onCheckedChange={() => handleStatusToggle(item.id, 'status')}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </TableCell>
                  )}
                  {/* {visibleColumns.active && (
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 text-xs font-medium ${
                        item.active ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {item.active ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                  )} */}
                  {visibleColumns.createdBy && <TableCell>{item.createdBy}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 10 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
};