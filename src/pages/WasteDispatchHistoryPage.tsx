import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Recycle, Truck, Trash2, RefreshCw, Package, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { DUMMY_DISPATCH_RECORDS, DispatchRecord } from '@/data/wasteDispatchDummyData';

// Table 2 — Waste Dispatch List columns. "Checkbox" isn't listed here since
// EnhancedTable renders its own selection column via the `selectable` prop.
const columns = [
  { key: 'actions', label: 'Action' },
  { key: 'id', label: 'Id' },
  { key: 'dispatch_datetime', label: 'Dispatch Date & Time' },
  { key: 'waste_category', label: 'Waste Category' },
  { key: 'waste_type', label: 'Waste Type' },
  { key: 'total_generated_kg', label: 'Total Generated Weight (KG)' },
  { key: 'dispatch_weight_kg', label: 'Dispatch Weight (KG)' },
  { key: 'recycled_weight_kg', label: 'Recycled Weight (KG)' },
  { key: 'total_generated_ltr', label: 'Total Generated Weight (L)' },
  { key: 'dispatch_weight_ltr', label: 'Dispatch Weight (L)' },
  { key: 'recycled_weight_ltr', label: 'Recycled Weight (L)' },
  { key: 'vendor_name', label: 'Vendor Name' },
  { key: 'vehicle_no', label: 'Vehicle No' },
  { key: 'driver_name', label: 'Driver Name' },
  { key: 'contact_no', label: 'Contact No' },
  { key: 'destination_facility', label: 'Destination Facility' },
  { key: 'disposal_method', label: 'Disposal Method' },
  { key: 'supporting_documents', label: 'Supporting Documents' },
  { key: 'vendor_acknowledge', label: 'Vendor Acknowledge' },
  { key: 'status', label: 'Status' },
  { key: 'recycling_status', label: 'Recycling Status' },
];

const renderDispatchCell = (item: DispatchRecord, key: string) => {
  if (key === 'id') return item.dispatchId;
  if (key === 'dispatch_datetime') return `${item.dispatchDate} ${item.dispatchTime}`.trim();
  if (key === 'waste_category') return item.category;
  if (key === 'waste_type') return item.wasteItem;
  if (key === 'total_generated_kg') return item.totalGeneratedWeightKg != null ? `${item.totalGeneratedWeightKg} KG` : '-';
  if (key === 'dispatch_weight_kg') return item.dispatchWeightKg != null ? `${item.dispatchWeightKg} KG` : '-';
  if (key === 'recycled_weight_kg') return item.recycledWeightKg != null ? `${item.recycledWeightKg} KG` : '-';
  if (key === 'total_generated_ltr') return item.totalGeneratedWeightLtr != null ? `${item.totalGeneratedWeightLtr} L` : '-';
  if (key === 'dispatch_weight_ltr') return item.dispatchWeightLtr != null ? `${item.dispatchWeightLtr} L` : '-';
  if (key === 'recycled_weight_ltr') return item.recycledWeightLtr != null ? `${item.recycledWeightLtr} L` : '-';
  if (key === 'vendor_name') return item.destination;
  if (key === 'vehicle_no') return item.vehicleNumber;
  if (key === 'driver_name') return item.driverName;
  if (key === 'contact_no') return item.contactNo;
  if (key === 'destination_facility') return item.destinationFacility;
  if (key === 'disposal_method') return item.disposalMethod;
  if (key === 'supporting_documents') return item.supportingDocumentsCount > 0 ? `${item.supportingDocumentsCount} file(s)` : '-';
  if (key === 'vendor_acknowledge') return item.vendorAcknowledge;
  if (key === 'status') return item.status;
  if (key === 'recycling_status') return item.recycleDetail?.recyclingStatus || 'Not Recycled';
  return '-';
};

const WasteDispatchHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();

  // TODO: replace with a real fetch (e.g. fetchWasteDispatches()) once the
  // backend exposes a dispatch-history endpoint. Using placeholder data until then.
  const [dispatchRecords] = useState<DispatchRecord[]>(DUMMY_DISPATCH_RECORDS);
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredRecords = dispatchRecords.filter((record) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      record.wasteItem.toLowerCase().includes(q) ||
      record.dispatchId.toLowerCase().includes(q) ||
      record.manifestNumber.toLowerCase().includes(q)
    );
  });

  const summaryCards = [
    {
      label: 'Total Dispatch Requests',
      value: dispatchRecords.length,
      icon: <Truck className="w-6 h-6 text-[#C72030]" />,
    },
    {
      label: 'Hazardous Dispatched',
      value: dispatchRecords
        .filter((r) => r.category.toLowerCase().includes('hazard'))
        .length,
      icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
    },
    {
      label: 'E-Waste Dispatched',
      value: dispatchRecords.filter((r) => r.category.toLowerCase().includes('e-waste')).length,
      icon: <RefreshCw className="w-6 h-6 text-[#C72030]" />,
    },
    {
      label: 'Recyclable Dispatched',
      value: dispatchRecords.filter((r) => r.category.toLowerCase().includes('recycl')).length,
      icon: <Package className="w-6 h-6 text-[#C72030]" />,
    },
    {
      label: 'General Dispatched',
      value: dispatchRecords.filter((r) => r.category.toLowerCase().includes('general')).length,
      icon: <Activity className="w-6 h-6 text-[#C72030]" />,
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredRecords.map((r) => r.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)));
  };

  const handleView = (record: DispatchRecord) => {
    navigate(`/maintenance/waste/dispatch/${record.id}`, { state: { record } });
  };

  const handleRecycleEntry = () => {
    const record = dispatchRecords.find((r) => r.id === selectedItems[0]);
    if (!record) return;
    navigate(`/maintenance/waste/dispatch/recycle-entry/${record.id}`, { state: { record } });
  };

  const handleExportSelected = () => {
    const rows = dispatchRecords.filter((r) => selectedItems.includes(r.id));
    const headers = columns.filter((c) => c.key !== 'actions').map((c) => c.label);
    const csvRows = rows.map((r) =>
      columns.filter((c) => c.key !== 'actions').map((c) => renderDispatchCell(r, c.key))
    );
    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste-dispatch-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">WASTE DISPATCH HISTORY</h1>
        <p className="text-sm text-gray-600 mt-1">
          All past waste dispatches across sites, with destination, quantity and manifest details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1A1A1A]">{card.value}</div>
              <div className="text-sm font-medium text-[#1A1A1A]">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <EnhancedTable
        data={filteredRecords}
        loading={isLoading}
        loadingMessage="Loading..."
        columns={columns}
        renderCell={(item: DispatchRecord, key: string) => {
          if (key === 'actions') {
            return shouldShow('Waste Generation', 'show') ? (
              <Button variant="ghost" onClick={() => handleView(item)}>
                <Eye className="h-4 w-4" />
              </Button>
            ) : null;
          }
          return renderDispatchCell(item, key);
        }}
        getItemId={(item) => item.id}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by waste item, dispatch ID, or manifest no..."
        pagination
        pageSize={10}
        emptyMessage="No dispatch history yet"
      />

      {selectedItems.length > 0 && (
        <SelectionPanel
          actions={[
            { label: 'Recycle Entry', icon: Recycle, onClick: handleRecycleEntry },
            { label: 'Export', icon: Download, onClick: handleExportSelected },
          ]}
          onClearSelection={() => setSelectedItems([])}
        />
      )}
    </div>
  );
};

export default WasteDispatchHistoryPage;
