import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, RefreshCw, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

interface EscalationMatrix {
  id: number;
  matrixTitle: string;
  triggerEvent: string;
  notificationType: string;
  noOfEscalations: number;
  level1EscalatesTo: string;
  level2EscalatesTo: string;
  created_on: string;
  created_by: string;
}

export const EscalationMatrixManagePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [escalationMatrixData, setEscalationMatrixData] = useState<EscalationMatrix[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    matrixTitle: true,
    triggerEvent: true,
    level1EscalatesTo: true,
    level2EscalatesTo: true,
    notificationType: true
  });

  // Notification type options
  const notificationTypeOptions = [
    'Email',
    'SMS',
    'Push Notification',
    'In-App Notification',
    'WhatsApp',
    'Slack',
    'Teams'
  ];

  const [filteredMatrix, setFilteredMatrix] = useState<EscalationMatrix[]>([]);

  // Load escalation matrix from API (mock implementation)
  const loadEscalationMatrix = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading escalation matrix...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - replace with actual API calls
      const mockMatrixData: EscalationMatrix[] = [
        {
          id: 1,
          matrixTitle: 'Maintenance Request',
          triggerEvent: 'High Priority Ticket',
          notificationType: 'Email',
          noOfEscalations: 2,
          level1EscalatesTo: 'Team Lead',
          level2EscalatesTo: 'Manager',
          created_on: '15/09/2025, 10:30 AM',
          created_by: 'Admin'
        },
        {
          id: 2,
          matrixTitle: 'Security Incident',
          triggerEvent: 'Critical Alert',
          notificationType: 'SMS',
          noOfEscalations: 3,
          level1EscalatesTo: 'Security Officer',
          level2EscalatesTo: 'Security Manager',
          created_on: '14/09/2025, 02:15 PM',
          created_by: 'Admin'
        },
        {
          id: 3,
          matrixTitle: 'IT Support',
          triggerEvent: 'System Outage',
          notificationType: 'Push Notification',
          noOfEscalations: 2,
          level1EscalatesTo: 'IT Support',
          level2EscalatesTo: 'IT Manager',
          created_on: '13/09/2025, 09:45 AM',
          created_by: 'Admin'
        }
      ];
      
      setEscalationMatrixData(mockMatrixData);
      setFilteredMatrix(mockMatrixData);
    } catch (error) {
      console.error('Failed to load escalation matrix:', error);
      toast({
        title: "Error",
        description: "Failed to load escalation matrix",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredMatrix.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredMatrix.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadEscalationMatrix();
  }, [loadEscalationMatrix]);

  useEffect(() => {
    const filtered = escalationMatrixData.filter(matrix =>
      matrix.matrixTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matrix.triggerEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matrix.notificationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matrix.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMatrix(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, escalationMatrixData]);

  const handleAdd = () => {
    navigate('/settings/manage-users/escalation-matrix/add');
  };

  const handleEdit = (matrix: EscalationMatrix) => {
    navigate(`/settings/manage-users/escalation-matrix/edit/${matrix.id}`);
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadEscalationMatrix();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed successfully",
    });
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'sNo', label: 'S.No.', visible: visibleColumns.sNo },
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'matrixTitle', label: 'Matrix Title', visible: visibleColumns.matrixTitle },
    { key: 'triggerEvent', label: 'Trigger Event', visible: visibleColumns.triggerEvent },
    { key: 'level1EscalatesTo', label: 'Level 1 Escalates To', visible: visibleColumns.level1EscalatesTo },
    { key: 'level2EscalatesTo', label: 'Level 2 Escalates To', visible: visibleColumns.level2EscalatesTo },
    { key: 'notificationType', label: 'Notification Type', visible: visibleColumns.notificationType }
  ];

  return (
    <>
      <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex items-center gap-3">
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
              {visibleColumns.sNo && <TableHead className="w-20">S.No.</TableHead>}
              {visibleColumns.actions && <TableHead className="w-20">Actions</TableHead>}
              {visibleColumns.matrixTitle && <TableHead className="w-48">Matrix Title</TableHead>}
              {visibleColumns.triggerEvent && <TableHead className="w-48">Trigger Event</TableHead>}
              {visibleColumns.level1EscalatesTo && <TableHead className="w-48">Level 1 Escalates To</TableHead>}
              {visibleColumns.level2EscalatesTo && <TableHead className="w-48">Level 2 Escalates To</TableHead>}
              {visibleColumns.notificationType && <TableHead className="w-40">Notification Type</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading escalation matrix...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No escalation matrix found matching "${searchTerm}"` : 'No escalation matrix found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first escalation matrix</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((matrix, index) => (
                <TableRow key={matrix.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <button
                        onClick={() => handleEdit(matrix)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </TableCell>
                  )}
                  {visibleColumns.matrixTitle && (
                    <TableCell className="font-medium">
                      {matrix.matrixTitle}
                    </TableCell>
                  )}
                  {visibleColumns.triggerEvent && <TableCell>{matrix.triggerEvent}</TableCell>}
                  {visibleColumns.level1EscalatesTo && <TableCell>{matrix.level1EscalatesTo}</TableCell>}
                  {visibleColumns.level2EscalatesTo && <TableCell>{matrix.level2EscalatesTo}</TableCell>}
                  {visibleColumns.notificationType && (
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {matrix.notificationType}
                      </span>
                    </TableCell>
                  )}
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
    </>
  );
};