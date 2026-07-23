import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, Edit, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';
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
}

// Sub-columns rendered per parking category (2 Wheeler, 4 Wheeler, EV, ...)
const CATEGORY_COLUMN_TYPES: Array<{ suffix: string; label: string }> = [
  { suffix: 'total', label: 'Total\nParkings' },
  { suffix: 'nonstack', label: 'Non Stack\nParkings' },
  { suffix: 'stack', label: 'Stack\nParkings' },
  { suffix: 'reserved', label: 'Reserved\nParkings' }
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    actions: true,
    location: true,
    floor: true,
    qrcode_needed: true
  });

  const fetchParkingCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await fetchParkingCategories();
      setParkingCategories(categoriesData);
      console.log('Fetched parking categories:', categoriesData);
    } catch (error) {
      console.error('Error fetching parking categories:', error);
      toast.error('Failed to fetch parking categories');
    }
  }, []);

  // Ensure every parking category returned by the API has its own set of (togglable) columns,
  // so any number of categories (2 Wheeler, 4 Wheeler, EV, ...) render dynamically.
  useEffect(() => {
    if (parkingCategories.length === 0) return;

    setVisibleColumns(prev => {
      const next = { ...prev };
      let changed = false;
      parkingCategories.forEach(category => {
        CATEGORY_COLUMN_TYPES.forEach(({ suffix }) => {
          const key = `cat_${category.id}_${suffix}`;
          if (next[key] === undefined) {
            next[key] = true;
            changed = true;
          }
        });
      });
      return changed ? next : prev;
    });
  }, [parkingCategories]);

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
  }, []);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchParkingCategoriesData();
    fetchData();
  }, [setCurrentSection, fetchData, fetchParkingCategoriesData]);

  const transformApiDataToTableData = (apiData: GroupedParkingConfiguration[]): SlotConfigurationData[] => {
    const tableData: SlotConfigurationData[] = [];
    console.log('Transform API Data - Input:', apiData);

    apiData.forEach((group) => {
      // Build counts per parking_category_id so any number of categories
      // (2 Wheeler, 4 Wheeler, EV, ...) are captured dynamically.
      const categoriesData: Record<number, CategoryCounts> = {};

      group.parking_configurations.forEach((config) => {
        // Calculate actual counts from parking_numbers array
        const nonStackCount = config.parking_numbers.filter(p => !p.stacked && !p.reserved).length;
        const stackCount = config.parking_numbers.filter(p => p.stacked && !p.reserved).length;
        const reservedCount = config.parking_numbers.filter(p => p.reserved).length;
        const totalCount = config.parking_numbers.length;

        categoriesData[config.parking_category_id] = {
          totalParkings: totalCount,
          nonStackParkings: nonStackCount,
          stackParkings: stackCount,
          reservedParkings: reservedCount
        };
      });

      tableData.push({
        id: `${group.building_id}-${group.floor_id}`, // Use building_id-floor_id as unique identifier for edit navigation
        building_id: parseInt(group.building_id), // Store building_id for API calls
        floor_id: group.floor_id, // Store floor_id for API calls
        location: group.building_name,
        floor: group.floor_name,
        qrcode_needed: group.qrcode_needed === 'true' || group.qrcode_needed === true,
        categories: categoriesData,
        createdOn: new Date().toLocaleDateString() // API doesn't provide this, using current date
      });
    });

    return tableData;
  };

  const filteredData = slotConfigurationData.filter(item =>
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.floor && item.floor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.id && item.id.toString().includes(searchTerm))
  );

  const handleEdit = (item: SlotConfigurationData) => {
    // Navigate with building_id-floor_id format for the EditSlotConfigurationPage
    // This will trigger the API call: /pms/manage/parking_configurations.json?q[building_id_eq]=123&q[floor_id_eq]=123
    console.log('Navigating to edit with building_id:', item.building_id, 'floor_id:', item.floor_id);
    navigate(`/settings/vas/parking-management/slot-configuration/edit/${item.building_id}-${item.floor_id}`);
  };

  const handleAdd = () => {
    navigate('/settings/vas/parking-management/slot-configuration/add');
  };

  const handleBulkUpload = () => {
    setIsBulkUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setIsBulkUploadOpen(false);
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control - base columns plus one group per parking category
  const columns = [
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'location', label: 'Location', visible: visibleColumns.location },
    { key: 'floor', label: 'Floor', visible: visibleColumns.floor },
    { key: 'qrcode_needed', label: 'QR Code Needed', visible: visibleColumns.qrcode_needed },
    ...parkingCategories.flatMap((category) =>
      CATEGORY_COLUMN_TYPES.map(({ suffix, label }) => ({
        key: `cat_${category.id}_${suffix}`,
        label: `${category.name} ${label.replace('\n', ' ')}`,
        visible: visibleColumns[`cat_${category.id}_${suffix}`]
      }))
    )
  ];

  // Total number of leaf columns currently visible - used for the empty-state colSpan
  const totalVisibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        {shouldShow("Slot Configuration", "create") && (
        <Button 
          onClick={handleAdd}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        )}

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
          <Button 
            onClick={handleBulkUpload}
            variant="outline"
            className="px-4 py-2 border-gray-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading parking configurations...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-500">{error}</div>
            <Button 
              onClick={fetchData}
              className="ml-4 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
            >
              Retry
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                {visibleColumns.actions && <TableHead className="text-center" rowSpan={2}>Actions</TableHead>}
                {visibleColumns.location && <TableHead rowSpan={2}>Location</TableHead>}
                {visibleColumns.floor && <TableHead rowSpan={2}>Floor</TableHead>}
                {visibleColumns.qrcode_needed && <TableHead className="text-center" rowSpan={2}>QR<br/>Needed</TableHead>}
                {parkingCategories.map((category) => {
                  const visibleTypeCount = CATEGORY_COLUMN_TYPES.filter(
                    ({ suffix }) => visibleColumns[`cat_${category.id}_${suffix}`]
                  ).length;
                  if (visibleTypeCount === 0) return null;
                  return (
                    <TableHead key={category.id} className="text-center" colSpan={visibleTypeCount}>
                      {category.name}
                    </TableHead>
                  );
                })}
              </TableRow>
              <TableRow className="bg-[#f6f4ee]">
                {parkingCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    {CATEGORY_COLUMN_TYPES.map(({ suffix, label }) =>
                      visibleColumns[`cat_${category.id}_${suffix}`] ? (
                        <TableHead
                          key={suffix}
                          className={suffix === 'reserved' ? 'text-center text-red-600' : 'text-center'}
                        >
                          {label.split('\n').map((part, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <br />}
                              {part}
                            </React.Fragment>
                          ))}
                        </TableHead>
                      ) : null
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={totalVisibleColumnsCount} className="text-center py-8 text-gray-500">
                    No parking configurations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    {visibleColumns.actions && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {shouldShow("Slot Configuration", "update") && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                          </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.location && <TableCell className="font-medium">{item.location}</TableCell>}
                    {visibleColumns.floor && <TableCell>{item.floor}</TableCell>}
                    {visibleColumns.qrcode_needed && (
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={item.qrcode_needed}
                          disabled
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                        />
                      </TableCell>
                    )}
                    {parkingCategories.map((category) => {
                      const counts = item.categories[category.id] || {
                        totalParkings: 0,
                        nonStackParkings: 0,
                        stackParkings: 0,
                        reservedParkings: 0
                      };
                      return (
                        <React.Fragment key={category.id}>
                          {visibleColumns[`cat_${category.id}_total`] && (
                            <TableCell className="text-center">{counts.totalParkings}</TableCell>
                          )}
                          {visibleColumns[`cat_${category.id}_nonstack`] && (
                            <TableCell className="text-center">{counts.nonStackParkings}</TableCell>
                          )}
                          {visibleColumns[`cat_${category.id}_stack`] && (
                            <TableCell className="text-center">{counts.stackParkings}</TableCell>
                          )}
                          {visibleColumns[`cat_${category.id}_reserved`] && (
                            <TableCell className="text-center text-red-600">{counts.reservedParkings}</TableCell>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Bulk Upload Modal */}
      <SlotConfigBulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={handleBulkUploadClose} 
      />
    </div>
  );
};