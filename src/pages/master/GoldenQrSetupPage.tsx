import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Loader2, Download, Upload, FileSpreadsheet, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchFloors,
  fetchRooms,
} from '@/store/slices/locationSlice';
import { getToken, getBaseUrl } from '@/utils/auth';
import { toast } from 'sonner';

interface GoldenQrRecord {
  id?: number;
  building_id?: string | number;
  wing_id?: string | number;
  area_id?: string | number;
  floor?: string | number;
  room?: string | number;
  mark_golden?: string | boolean;
  fields_for?: string;
  [key: string]: any;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
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

export function GoldenQrSetupPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings, areas, floors, rooms } = useAppSelector(
    (state) => state.location
  );

  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [tableData, setTableData] = useState<GoldenQrRecord[]>([]);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const perPage = 20;

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GoldenQrRecord | null>(null);
  const isEditFilling = useRef(false);

  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedWing, setSelectedWing] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [markGolden, setMarkGolden] = useState(false);
  const [showRequester, setShowRequester] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings());
    loadTableData(1);
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      if (!isEditFilling.current) {
        setSelectedWing('');
        setSelectedArea('');
        setSelectedFloor('');
        setSelectedRoom('');
      }
      dispatch(fetchWings(Number(selectedBuilding)));
    }
  }, [dispatch, selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding) {
      if (!isEditFilling.current) {
        setSelectedArea('');
        setSelectedFloor('');
        setSelectedRoom('');
      }
      dispatch(
        fetchAreas({
          buildingId: Number(selectedBuilding),
          wingId: selectedWing ? Number(selectedWing) : undefined,
        })
      );
    }
  }, [dispatch, selectedBuilding, selectedWing]);

  useEffect(() => {
    if (selectedArea) {
      if (!isEditFilling.current) {
        setSelectedFloor('');
        setSelectedRoom('');
      }
      dispatch(
        fetchFloors({
          buildingId: Number(selectedBuilding) || 0,
          wingId: selectedWing ? Number(selectedWing) : 0,
          areaId: Number(selectedArea),
        })
      );
    }
  }, [dispatch, selectedArea]);

  useEffect(() => {
    if (selectedFloor) {
      if (!isEditFilling.current) {
        setSelectedRoom('');
      }
      dispatch(
        fetchRooms({
          buildingId: Number(selectedBuilding) || 0,
          wingId: selectedWing ? Number(selectedWing) : 0,
          areaId: Number(selectedArea) || 0,
          floorId: Number(selectedFloor),
        })
      );
    }
  }, [dispatch, selectedFloor]);

  const loadTableData = async (page = 1) => {
    setIsLoadingTable(true);
    setSelectedIds(new Set());
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const response = await fetch(
        `${baseUrl}/pms/account_setups/get_additional_fields.json?q[fields_for_eq]=complaint_golden_ticket&page=${page}&per_page=${perPage}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      const records = Array.isArray(data)
        ? data
        : data.additional_fields || data.data || data.records || [];
      setTableData(records);
      setCurrentPage(data.current_page ?? page);
      setTotalPages(data.total_pages ?? 1);
      setTotalCount(data.total_count ?? records.length);
    } catch {
      toast.error('Failed to load Golden QR records');
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (selectedIds.size === 0) return;
    setIsDownloading(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const params = Array.from(selectedIds)
        .map((id) => `ids[]=${id}`)
        .join('&');
      const response = await fetch(
        `${baseUrl}/pms/account_setups/download_golden_qr_pdf?${params}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'golden_qr_codes.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download QR PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const allCurrentSelected =
    tableData.length > 0 && tableData.every((r) => r.id != null && selectedIds.has(r.id));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        tableData.forEach((r) => { if (r.id != null) next.add(r.id); });
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        tableData.forEach((r) => { if (r.id != null) next.delete(r.id); });
        return next;
      });
    }
  };

  const toggleRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDownloadSample = async () => {
    setIsDownloadingSample(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const response = await fetch(
        `${baseUrl}/pms/account_setups/import_additional_fields_template`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'golden_qr_sample.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download sample file');
    } finally {
      setIsDownloadingSample(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }
    setIsImporting(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const formData = new FormData();
      formData.append('file', importFile);
      const response = await fetch(
        `${baseUrl}/pms/account_setups/import_additional_fields`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Import failed');
      toast.success('Import successful');
      setShowImportDialog(false);
      setImportFile(null);
      loadTableData(1);
    } catch {
      toast.error('Failed to import file');
    } finally {
      setIsImporting(false);
    }
  };

  const handleEditClick = (record: GoldenQrRecord) => {
    const content = record.content || record;
    const buildingId = String(content.building_id || '');
    const wingId = String(content.wing_id || '');
    const areaId = String(content.area_id || '');
    const floorId = String(content.floor || '');
    const roomId = String(content.room || '');

    isEditFilling.current = true;
    setSelectedBuilding(buildingId);
    setSelectedWing(wingId);
    setSelectedArea(areaId);
    setSelectedFloor(floorId);
    setSelectedRoom(roomId);
    setMarkGolden(record.mark_golden_ticket === true || String(record.mark_golden_ticket) === 'true');
    setShowRequester(record.show_requester === true || String(record.show_requester) === 'true');
    setEditingRecord(record);
    setIsEditMode(true);
    setTimeout(() => { isEditFilling.current = false; }, 200);
    setShowDialog(true);
  };

  const resetForm = () => {
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    setMarkGolden(false);
    setShowRequester(false);
    setEditingRecord(null);
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    if (!selectedBuilding) {
      toast.error('Please select a building');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();

      if (isEditMode && editingRecord?.id) {
        const payload = {
          id: editingRecord.id,
          mark_golden_ticket: markGolden,
          show_requester: showRequester,
          content: {
            building_id: selectedBuilding,
            wing_id: selectedWing,
            area_id: selectedArea,
            floor: selectedFloor,
            room: selectedRoom,
          },
        };
        const response = await fetch(
          `${baseUrl}/pms/account_setups/update_additional_fields`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error('Failed to update');
        toast.success('Golden QR setup updated successfully');
      } else {
        const payload = {
          content: {
            building_id: selectedBuilding,
            wing_id: selectedWing,
            area_id: selectedArea,
            floor: selectedFloor,
            room: selectedRoom,
          },
          fields_for: 'ComplaintGoldenQr',
          mark_golden_ticket: markGolden ? 'true' : 'false',
          show_requester: showRequester ? 'true' : 'false',
        };
        const response = await fetch(
          `${baseUrl}/pms/account_setups/create_additional_fields.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error('Failed to save');
        toast.success('Golden QR setup saved successfully');
      }

      resetForm();
      setShowDialog(false);
      loadTableData();
    } catch {
      toast.error(isEditMode ? 'Failed to update Golden QR setup' : 'Failed to save Golden QR setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBuildingName = (id: string | number) =>
    buildings.data?.find((b) => String(b.id) === String(id))?.name || id;

  const getWingName = (id: string | number) =>
    wings.data?.find((w) => String(w.id) === String(id))?.name || id;

  const getAreaName = (id: string | number) =>
    areas.data?.find((a) => String(a.id) === String(id))?.name || id;

  const getFloorName = (id: string | number) =>
    floors.data?.find((f) => String(f.id) === String(id))?.name || id;

  const getRoomName = (id: string | number) =>
    rooms.data?.find((r) => String(r.id) === String(id))?.name || id;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const columns: ColumnConfig[] = [
     { key: 'action', label: 'Action', sortable: false, hideable: false },
    { key: 'sr_no', label: 'Sr. No.', sortable: false, hideable: false },
    { key: 'building', label: 'Building', sortable: true, defaultVisible: true },
    { key: 'wing', label: 'Wing', sortable: true, defaultVisible: true },
    { key: 'area', label: 'Area', sortable: true, defaultVisible: true },
    { key: 'floor', label: 'Floor', sortable: true, defaultVisible: true },
    { key: 'room', label: 'Room', sortable: true, defaultVisible: true },
    { key: 'mark_golden_ticket', label: 'Golden Ticket', sortable: true, defaultVisible: true },
    { key: 'show_requester', label: 'Show Requester', sortable: true, defaultVisible: true },
    { key: 'qr_code', label: 'QR Code', sortable: false, defaultVisible: true },
   
  ];

  const renderCell = (item: GoldenQrRecord, columnKey: string) => {
    const content = item.content || item;
    const index = tableData.indexOf(item);

    switch (columnKey) {
      case 'sr_no':
        return (
          <span className="text-gray-900">
            {(currentPage - 1) * perPage + index + 1}
          </span>
        );
      case 'building':
        return getBuildingName(content.building_id);
      case 'wing':
        return getWingName(content.wing_id) || '-';
      case 'area':
        return getAreaName(content.area_id) || '-';
      case 'floor':
        return getFloorName(content.floor) || '-';
      case 'room':
        return getRoomName(content.room) || '-';
      case 'mark_golden_ticket':
        return String(item.mark_golden_ticket) === 'true' ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            No
          </span>
        );
      case 'show_requester':
        return String(item.show_requester) === 'true' ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            No
          </span>
        );
      case 'qr_code':
        return item.qr_code_url ? (
          <img
            src={item.qr_code_url}
            alt="QR Code"
            className="w-12 h-12 object-contain cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => setQrModalUrl(item.qr_code_url)}
          />
        ) : (
          <span className="text-gray-400">-</span>
        );
      case 'action':
        return (
          <button
            onClick={() => handleEditClick(item)}
            className="p-1.5 rounded text-gray-900"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
        );
      default:
        return item[columnKey] ?? '--';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Golden QR Setup</h1>
      </div> */}

      {/* Table */}
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        storageKey="golden-qr-table"
        loading={isLoadingTable}
        loadingMessage="Loading records..."
        emptyMessage="No records found"
        enableSearch={true}
        searchTerm={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search Golden QR..."
        selectable={true}
        selectedItems={Array.from(selectedIds).map(id => id.toString())}
        onSelectItem={(id, checked) => toggleRow(Number(id), checked)}
        onSelectAll={(checked) => toggleSelectAll(checked)}
        getItemId={(item) => item.id?.toString() || ''}
        enableExport={true}
        exportFileName="golden_qr_setup"
        handleExport={handleDownloadPdf}
        pagination={false}
        leftActions={
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-brand hover:bg-brand-hover text-white h-9 px-4 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
        filterAdjacentActions={
          <Button
            onClick={() => setShowImportDialog(true)}
            variant="outline"
            size="icon"
            className="!rounded-lg border border-brand text-brand hover:bg-brand-selected"
            title="Import"
          >
            <Upload className="w-4 h-4" />
          </Button>
        }
        // rightActions={
        //   <Button
        //     onClick={handleDownloadPdf}
        //     disabled={selectedIds.size === 0 || isDownloading}
        //     variant="outline"
        //     className="bg-brand hover:bg-brand-hover text-white h-9 px-4 text-sm font-medium"
        //   >
        //     {isDownloading ? (
        //       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        //     ) : (
        //       <Download className="w-4 h-4 mr-2" />
        //     )}
        //     Download QR PDF {selectedIds.size > 0 && `(${selectedIds.size})`}
        //   </Button>
        // }
      />

      {/* Custom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalCount)} of {totalCount} records
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { loadTableData(currentPage - 1); setCurrentPage(currentPage - 1); }}
              disabled={currentPage <= 1 || isLoadingTable}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <Button
                    key={item}
                    variant={item === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { loadTableData(item as number); setCurrentPage(item as number); }}
                    disabled={isLoadingTable}
                    className={`h-8 w-8 p-0 ${item === currentPage ? 'bg-brand hover:bg-brand-hover text-white border-brand' : ''}`}
                  >
                    {item}
                  </Button>
                )
              )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => { loadTableData(currentPage + 1); setCurrentPage(currentPage + 1); }}
              disabled={currentPage >= totalPages || isLoadingTable}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <Dialog open={!!qrModalUrl} onOpenChange={(open) => !open && setQrModalUrl(null)}>
        <DialogContent className="max-w-sm flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">QR Code</DialogTitle>
          </DialogHeader>
          {qrModalUrl && (
            <img
              src={qrModalUrl}
              alt="QR Code"
              className="w-64 h-64 object-contain mt-2"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={showImportDialog}
        onOpenChange={(open) => {
          if (!open) { setImportFile(null); }
          setShowImportDialog(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Import Golden QR
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* File Input */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Select Excel File</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              />
              {importFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-brand bg-brand-light">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{importFile.name}</span>
                  </div>
                  <button
                    onClick={() => { setImportFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="ml-2 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand hover:bg-brand-light transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to browse .xlsx / .xls / .csv</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSample}
                disabled={isDownloadingSample}
                className="border-[#C72030] text-[#C72030] hover:bg-green-50"
              >
                {isDownloadingSample ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Sample
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setImportFile(null); setShowImportDialog(false); }}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="bg-brand hover:bg-brand-hover text-white"
                >
                  {isImporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Import
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => { if (!open) resetForm(); setShowDialog(open); }}
        modal={false}
      >
        <DialogContent
          className="w-full sm:max-w-[500px] bg-white overflow-visible"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {isEditMode ? 'Edit Golden QR Setup' : 'Add Golden QR Setup'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetForm();
                  setShowDialog(false);
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <FormControl fullWidth variant="outlined" className="sm:col-span-2">
              <InputLabel id="building-label">Building *</InputLabel>
              <MuiSelect
                labelId="building-label"
                label="Building *"
                value={selectedBuilding || ""}
                onChange={(e) => setSelectedBuilding(String(e.target.value))}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Building</em>
                </MenuItem>
                {buildings.data?.map((b) => (
                  <MenuItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="wing-label">Wing</InputLabel>
              <MuiSelect
                labelId="wing-label"
                label="Wing"
                value={selectedWing || ""}
                onChange={(e) => setSelectedWing(String(e.target.value))}
                disabled={!selectedBuilding}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Wing</em>
                </MenuItem>
                {wings.data?.map((w) => (
                  <MenuItem key={w.id} value={String(w.id)}>
                    {w.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="area-label">Area</InputLabel>
              <MuiSelect
                labelId="area-label"
                label="Area"
                value={selectedArea || ""}
                onChange={(e) => setSelectedArea(String(e.target.value))}
                disabled={!selectedBuilding}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Area</em>
                </MenuItem>
                {areas.data?.map((a) => (
                  <MenuItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="floor-label">Floor</InputLabel>
              <MuiSelect
                labelId="floor-label"
                label="Floor"
                value={selectedFloor || ""}
                onChange={(e) => setSelectedFloor(String(e.target.value))}
                disabled={!selectedArea}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Floor</em>
                </MenuItem>
                {floors.data?.map((f) => (
                  <MenuItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="room-label">Room</InputLabel>
              <MuiSelect
                labelId="room-label"
                label="Room"
                value={selectedRoom || ""}
                onChange={(e) => setSelectedRoom(String(e.target.value))}
                disabled={!selectedFloor}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Room</em>
                </MenuItem>
                {rooms.data?.map((r) => (
                  <MenuItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <div className="flex items-center gap-3 sm:col-span-2 pt-1">
              <Checkbox
                id="mark-golden"
                checked={markGolden}
                onCheckedChange={(checked) => setMarkGolden(Boolean(checked))}
              />
              <Label
                htmlFor="mark-golden"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Golden Ticket
              </Label>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <Checkbox
                id="show-requester"
                checked={showRequester}
                onCheckedChange={(checked) => setShowRequester(Boolean(checked))}
              />
              <Label
                htmlFor="show-requester"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Show Requester
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto disabled:!opacity-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'SAVE'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowDialog(false);
              }}
              disabled={isSubmitting}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
