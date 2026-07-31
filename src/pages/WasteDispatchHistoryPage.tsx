import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, RefreshCw, Package, Activity, Download, Recycle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { DUMMY_DISPATCH_RECORDS, DispatchRecord } from '@/data/wasteDispatchDummyData';

const columns = [
  { key: 'actions', label: 'Actions' },
  { key: 'dispatchId', label: 'Dispatch ID' },
  { key: 'wasteItem', label: 'Waste Item' },
  { key: 'category', label: 'Category' },
  { key: 'dispatchWeight', label: 'Dispatch Weight' },
  { key: 'destination', label: 'Destination' },
  { key: 'vehicleNumber', label: 'Vehicle No.' },
  { key: 'dispatchedBy', label: 'Dispatched By' },
  { key: 'dispatchDate', label: 'Dispatch Date' },
  { key: 'manifestNumber', label: 'Manifest No.' },
  { key: 'status', label: 'Status' },
];

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
    const headers = ['Dispatch ID', 'Waste Item', 'Category', 'Dispatch Weight', 'Destination', 'Vehicle No.', 'Dispatched By', 'Dispatch Date', 'Manifest No.', 'Status'];
    const csvRows = rows.map((r) => [
      r.dispatchId, r.wasteItem, r.category, r.dispatchWeight, r.destination,
      r.vehicleNumber, r.dispatchedBy, r.dispatchDate, r.manifestNumber, r.status,
    ]);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          return (item as unknown as Record<string, string>)[key] || '-';
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
