import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, Edit, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SlotConfigBulkUploadModal } from '../components/SlotConfigBulkUploadModal';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { fetchParkingConfigurations, GroupedParkingConfiguration } from '../services/parkingConfigurationsAPI';
import { fetchParkingCategories, ParkingCategory } from '../services/parkingConfigAPI';

interface CategoryCounts {
  totalParkings: number;
  nonStackParkings: number;
  stackParkings: number;
  reservedParkings: number;
}

interface SlotConfigurationData {
  id: string;
  building_id: number;
  floor_id: number;
  location: string;
  floor: string;
  qrcode_needed: boolean;
  categories: Record<number, CategoryCounts>;
  createdOn: string;
  [key: string]: unknown;
}

const CATEGORY_COLUMN_TYPES: Array<{ suffix: string; label: string; countKey: keyof CategoryCounts }> = [
  { suffix: 'total', label: 'Total Parkings', countKey: 'totalParkings' },
  { suffix: 'nonstack', label: 'Non Stack Parkings', countKey: 'nonStackParkings' },
  { suffix: 'stack', label: 'Stack Parkings', countKey: 'stackParkings' },
  { suffix: 'reserved', label: 'Reserved Parkings', countKey: 'reservedParkings' },
];

export const SlotConfigurationPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [slotConfigurationData, setSlotConfigurationData] = useState<SlotConfigurationData[]>([]);
  const [parkingCategories, setParkingCategories] = useState<ParkingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const fetchParkingCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await fetchParkingCategories();
      setParkingCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching parking categories:', err);
      toast.error('Failed to fetch parking categories');
    }
  }, []);

  const transformApiDataToTableData = useCallback(
    (apiData: GroupedParkingConfiguration[]): SlotConfigurationData[] => {
      const tableData: SlotConfigurationData[] = [];

      apiData.forEach((group) => {
        const categoriesData: Record<number, CategoryCounts> = {};

        group.parking_configurations.forEach((config) => {
          const nonStackCount = config.parking_numbers.filter((p) => !p.stacked && !p.reserved).length;
          const stackCount = config.parking_numbers.filter((p) => p.stacked && !p.reserved).length;
          const reservedCount = config.parking_numbers.filter((p) => p.reserved).length;
          const totalCount = config.parking_numbers.length;

          categoriesData[config.parking_category_id] = {
            totalParkings: totalCount,
            nonStackParkings: nonStackCount,
            stackParkings: stackCount,
            reservedParkings: reservedCount,
          };
        });

        const row: SlotConfigurationData = {
          id: `${group.building_id}-${group.floor_id}`,
          building_id: parseInt(group.building_id),
          floor_id: group.floor_id,
          location: group.building_name,
          floor: group.floor_name,
          qrcode_needed: group.qrcode_needed === 'true' || group.qrcode_needed === true,
          categories: categoriesData,
          createdOn: new Date().toLocaleDateString(),
        };

        // Flatten category counts onto the row for EnhancedTable search/sort
        Object.entries(categoriesData).forEach(([categoryId, counts]) => {
          CATEGORY_COLUMN_TYPES.forEach(({ suffix, countKey }) => {
            row[`cat_${categoryId}_${suffix}`] = counts[countKey];
          });
        });

        tableData.push(row);
      });

      return tableData;
    },
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchParkingConfigurations();
      const transformedData = transformApiDataToTableData(response.grouped_parking_configurations);
      setSlotConfigurationData(transformedData);
    } catch (err) {
      console.error('Error fetching parking configurations:', err);
      setError('Failed to fetch parking configurations');
      toast.error('Failed to fetch parking configurations');
    } finally {
      setLoading(false);
    }
  }, [transformApiDataToTableData]);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchParkingCategoriesData();
    fetchData();
  }, [setCurrentSection, fetchData, fetchParkingCategoriesData]);

  const columns: ColumnConfig[] = useMemo(() => {
    const base: ColumnConfig[] = [
      { key: 'location', label: 'Location', sortable: true, hideable: true, defaultVisible: true },
      { key: 'floor', label: 'Floor', sortable: true, hideable: true, defaultVisible: true },
      { key: 'qrcode_needed', label: 'QR Needed', sortable: true, hideable: true, defaultVisible: true },
    ];

    const categoryCols: ColumnConfig[] = parkingCategories.flatMap((category) =>
      CATEGORY_COLUMN_TYPES.map(({ suffix, label }) => ({
        key: `cat_${category.id}_${suffix}`,
        label: `${category.name} - ${label}`,
        sortable: true,
        hideable: true,
        defaultVisible: true,
      }))
    );

    return [...base, ...categoryCols];
  }, [parkingCategories]);

  const handleEdit = (item: SlotConfigurationData) => {
    navigate(
      `/settings/vas/parking-management/slot-configuration/edit/${item.building_id}-${item.floor_id}`
    );
  };

  const handleAdd = () => {
    navigate('/settings/vas/parking-management/slot-configuration/add');
  };

  const renderCell = (item: SlotConfigurationData, columnKey: string) => {
    if (columnKey === 'location') {
      return <span className="font-medium">{item.location}</span>;
    }
    if (columnKey === 'floor') {
      return item.floor;
    }
    if (columnKey === 'qrcode_needed') {
      return (
        <input
          type="checkbox"
          checked={item.qrcode_needed}
          disabled
          className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded cursor-not-allowed"
          aria-label="QR Needed"
        />
      );
    }

    if (columnKey.startsWith('cat_')) {
      const value = (item[columnKey] as number | undefined) ?? 0;
      const isReserved = columnKey.endsWith('_reserved');
      return (
        <span className={isReserved ? 'text-brand font-medium' : undefined}>{value}</span>
      );
    }

    return (item[columnKey] as React.ReactNode) ?? '-';
  };

  const renderActions = (item: SlotConfigurationData) => {
    if (!shouldShow('Slot Configuration', 'update')) return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleEdit(item)}
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  const leftActions = (
    <div className="flex items-center gap-3">
      {shouldShow('Slot Configuration', 'create') && (
        <Button
          onClick={handleAdd}
          className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      )}
      <Button
        onClick={() => setIsBulkUploadOpen(true)}
        variant="outline"
        className="h-9 px-4 border-brand"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex justify-center items-center py-8 gap-4">
          <div className="text-red-500">{error}</div>
          <Button
            onClick={fetchData}
            className="bg-brand hover:bg-brand-hover text-white px-4 py-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <EnhancedTable
        data={slotConfigurationData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="slot-configuration-table"
        emptyMessage={
          searchTerm
            ? 'No slot configurations found matching your search'
            : 'No slot configurations found'
        }
        loading={loading}
        loadingMessage="Loading..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => item.id}
      />

      <SlotConfigBulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </div>
  );
};
