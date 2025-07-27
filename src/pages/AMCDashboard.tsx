import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, Download, Settings, Flag, Filter } from 'lucide-react';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { AMCAnalyticsSelector } from '@/components/AMCAnalyticsSelector';
import { AMCAnalyticsCard } from '@/components/AMCAnalyticsCard';
import { amcAnalyticsAPI, AMCStatusData } from '@/services/amcAnalyticsAPI';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Pagination,
    PaginationEllipsis,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';

// Sortable Chart Item Component
const SortableChartItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-move"
        >
            {children}
        </div>
    );
};

interface AMCRecord {
    id: number;
    asset_name: string;
    amc_type: string;
    vendor_name: string;
    amc_start_date: string;
    amc_end_date: string;
    amc_first_service: string;
    created_at: string;
    active: boolean;
    is_flagged?: boolean;
}

const initialAmcData: AMCRecord[] = [];

const columns: ColumnConfig[] = [
    { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
    { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
    { key: 'asset_name', label: 'Asset Name', sortable: true, defaultVisible: true },
    { key: 'amc_type', label: 'AMC Type', sortable: true, defaultVisible: true },
    { key: 'vendor_name', label: 'Vendor Name', sortable: true, defaultVisible: true },
    { key: 'amc_start_date', label: 'Start Date', sortable: true, defaultVisible: true },
    { key: 'amc_end_date', label: 'End Date', sortable: true, defaultVisible: true },
    { key: 'amc_first_service', label: 'First Service', sortable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created On', sortable: true, defaultVisible: true },
    { key: 'active', label: 'Status', sortable: true, defaultVisible: true },
];

export const AMCDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('selectedSiteId');
    const { data: apiData, loading: reduxLoading, error } = useAppSelector((state) => state.amc);
    const [selectedItems, setSelectedItems] = useState < string[] > ([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleSections, setVisibleSections] = useState < string[] > ([
        'statusChart', 'typeChart', 'resourceChart', 'agingMatrix'
    ]);
    const [chartOrder, setChartOrder] = useState < string[] > (['statusChart', 'typeChart', 'resourceChart', 'agingMatrix']);
    const [filter, setFilter] = useState < string | null > (null);
    const [amcTypeFilter, setAmcTypeFilter] = useState < string | null > (null);
    const [startDateFilter, setStartDateFilter] = useState < string | null > (null);
    const [endDateFilter, setEndDateFilter] = useState < string | null > (null);
    const [tempAmcTypeFilter, setTempAmcTypeFilter] = useState < string | null > (null);
    const [tempStartDateFilter, setTempStartDateFilter] = useState < string | null > (null);
    const [tempEndDateFilter, setTempEndDateFilter] = useState < string | null > (null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState < string > ("amclist");
    const [showActionPanel, setShowActionPanel] = useState(false);

    // Analytics states
    const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [amcAnalyticsData, setAmcAnalyticsData] = useState < AMCStatusData | null > (null);
    const [selectedAnalyticsOptions, setSelectedAnalyticsOptions] = useState < string[] > ([
        'status_overview',
        'type_distribution',
        'vendor_performance'
    ]);

    // Set default dates: last year to today for analytics
    const getDefaultDateRange = () => {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);

        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        return {
            startDate: formatDate(lastYear),
            endDate: formatDate(today)
        };
    };

    const [analyticsDateRange, setAnalyticsDateRange] = useState < { startDate: string; endDate: string } > (getDefaultDateRange());

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Initialize temporary filters when modal opens
    useEffect(() => {
        if (isFilterModalOpen) {
            setTempAmcTypeFilter(amcTypeFilter);
            setTempStartDateFilter(startDateFilter);
            setTempEndDateFilter(endDateFilter);
        }
    }, [isFilterModalOpen, amcTypeFilter, startDateFilter, endDateFilter]);

    // Fetch AMC analytics data
    const fetchAMCAnalyticsData = async (startDate: Date, endDate: Date) => {
        setAnalyticsLoading(true);
        try {
            const analyticsData = await amcAnalyticsAPI.getAMCStatusData(startDate, endDate);
            setAmcAnalyticsData(analyticsData);
            toast.success('AMC analytics data updated successfully');
        } catch (error) {
            console.error('Error fetching AMC analytics data:', error);
            toast.error('Failed to fetch AMC analytics data');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // Handle analytics filter apply
    const handleAnalyticsFilterApply = (filters: { startDate: string; endDate: string }) => {
        setAnalyticsDateRange(filters);

        // Convert date strings to Date objects
        const startDate = new Date(filters.startDate.split('/').reverse().join('-'));
        const endDate = new Date(filters.endDate.split('/').reverse().join('-'));

        fetchAMCAnalyticsData(startDate, endDate);
    };

    // Use API data if available, otherwise fallback to initial data
    const amcData = apiData && typeof apiData === 'object' && 'asset_amcs' in apiData && Array.isArray((apiData as any).asset_amcs) ? (apiData as any).asset_amcs : initialAmcData;
    const pagination = (apiData && typeof apiData === 'object' && 'pagination' in apiData) ? (apiData as any).pagination : { current_page: 1, total_count: 0, total_pages: 1 };

    // Extract counts from API response - use analytics data if available
    const totalAMCs = amcAnalyticsData ? (amcAnalyticsData.active_amc + amcAnalyticsData.inactive_amc) :
        ((apiData && typeof apiData === 'object' && 'total_amcs_count' in apiData) ? (apiData as any).total_amcs_count : pagination.total_count || 0);
    const activeAMCs = amcAnalyticsData?.active_amc ||
        ((apiData && typeof apiData === 'object' && 'active_amcs_count' in apiData) ? (apiData as any).active_amcs_count : 0);
    const inactiveAMCs = amcAnalyticsData?.inactive_amc ||
        ((apiData && typeof apiData === 'object' && 'inactive_amcs_count' in apiData) ? (apiData as any).inactive_amcs_count : 0);
    const flaggedAMCs = (apiData && typeof apiData === 'object' && 'flagged_amcs_count' in apiData) ? (apiData as any).flagged_amcs_count : 0;

    // Service and Asset totals from analytics
    const serviceTotalAMCs = amcAnalyticsData?.service_total || 0;
    const assetTotalAMCs = amcAnalyticsData?.assets_total || 0;

    // Filter function to fetch AMC data based on filters
    const fetchFilteredAMCs = async (filterValue: string | null, page: number = 1) => {
        if (!baseUrl || !token || !siteId) {
            toast.error('Missing base URL, token, or site ID');
            return;
        }

        setLoading(true);
        let url = `https://${baseUrl}/pms/asset_amcs.json?site_id=${siteId}&page=${page}`;
        const queryParams: string[] = [];

        if (amcTypeFilter) {
            queryParams.push(`q[amc_type_eq]=${encodeURIComponent(amcTypeFilter)}`);
        }

        if (startDateFilter) {
            queryParams.push(`q[amc_start_date_eq]=${startDateFilter}`);
        }

        if (endDateFilter) {
            queryParams.push(`q[amc_end_date_eq]=${endDateFilter}`);
        }

        if (filterValue === 'active') {
            queryParams.push('q[active_eq]=true');
        } else if (filterValue === 'inactive') {
            queryParams.push('q[active_eq]=false');
        } else if (filterValue === 'flagged') {
            queryParams.push('q[is_flagged_eq]=true');
        }

        if (queryParams.length > 0) {
            url += `&${queryParams.join('&')}`;
        }

        console.log('Request URL:', url);
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fetchedData = response.data;
            dispatch(fetchAMCData.fulfilled(fetchedData, 'fetchAMCData', undefined));
            setCurrentPage(fetchedData.pagination.current_page);
        } catch (error) {
            console.error('Error fetching AMC data:', error);
            dispatch(fetchAMCData.rejected(error as any, 'fetchAMCData', undefined));
            toast.error('Failed to fetch AMC data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount and when dependencies change
    useEffect(() => {
        if (baseUrl && token && siteId) {
            fetchFilteredAMCs(filter, currentPage);
        }
    }, [baseUrl, token, siteId, filter, amcTypeFilter, startDateFilter, endDateFilter, currentPage]);

    // Load analytics data with default date range on component mount
    useEffect(() => {
        const defaultRange = getDefaultDateRange();
        const startDate = new Date(defaultRange.startDate.split('/').reverse().join('-'));
        const endDate = new Date(defaultRange.endDate.split('/').reverse().join('-'));
        fetchAMCAnalyticsData(startDate, endDate);
    }, []);

    return (
        <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="amclist" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                    <TabsTrigger
                        value="amclist"
                        className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current"
                        >
                            <path
                                d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        AMC List
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsAnalyticsFilterOpen(true)}
                                className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
                                disabled={analyticsLoading}
                            >
                                <Filter className="w-4 h-4" />
                                Filter Analytics
                            </Button>
                        </div>
                        <AMCAnalyticsSelector onSelectionChange={(options) => setSelectedAnalyticsOptions(options)} />
                    </div>

                    {analyticsLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-600">Loading analytics data...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {selectedAnalyticsOptions.includes('status_overview') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Status Overview"
                                    data={amcAnalyticsData}
                                    type="statusOverview"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('type_distribution') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Type Distribution"
                                    data={amcAnalyticsData}
                                    type="typeDistribution"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('vendor_performance') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Vendor Performance"
                                    data={amcAnalyticsData}
                                    type="vendorPerformance"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('expiry_analysis') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Expiry Analysis"
                                    data={amcAnalyticsData}
                                    type="expiryAnalysis"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('cost_analysis') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Cost Analysis"
                                    data={amcAnalyticsData}
                                    type="costAnalysis"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('service_tracking') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Service Tracking"
                                    data={amcAnalyticsData}
                                    type="serviceTracking"
                                />
                            )}
                            {selectedAnalyticsOptions.includes('compliance_report') && amcAnalyticsData && (
                                <AMCAnalyticsCard
                                    title="Compliance Report"
                                    data={amcAnalyticsData}
                                    type="complianceReport"
                                />
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="amclist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div
                            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                            onClick={handleTotalAMCClick}
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                    {totalAMCs}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Total AMC</div>
                            </div>
                        </div>

                        <div
                            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                            onClick={handleActiveAMCClick}
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                    {activeAMCs}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Active AMC</div>
                            </div>
                        </div>

                        <div
                            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                            onClick={handleInactiveAMCClick}
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                    {inactiveAMCs}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Inactive AMC</div>
                            </div>
                        </div>

                        <div
                            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                            onClick={handleFlaggedAMCClick}
                        >
                            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                    {flaggedAMCs}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Flagged AMC</div>
                            </div>
                        </div>
                    </div>

                    <AmcBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />


                    {showActionPanel && (
                        <SelectionPanel
                            onAdd={handleAddClick}
                            onClearSelection={() => setShowActionPanel(false)}
                            onImport={handleImportClick}
                        />
                    )}

                    {!(loading || reduxLoading) && (
                        <EnhancedTable
                            handleExport={handleExport}
                            data={amcData}
                            columns={columns}
                            renderCell={renderCell}
                            selectable={true}
                            selectedItems={selectedItems}
                            onSelectAll={handleSelectAll}
                            onSelectItem={handleSelectItem}
                            getItemId={(item) => item.id.toString()}
                            storageKey="amc-dashboard-table"
                            emptyMessage="No AMC records found"
                            searchPlaceholder="Search..."
                            enableExport={true}
                            exportFileName="amc-records"
                            bulkActions={bulkActions}
                            showBulkActions={true}
                            pagination={false}
                            onFilterClick={handleFiltersClick}
                            leftActions={
                                <Button
                                    onClick={handleActionClick}
                                    className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
                                >
                                    <Plus className="w-4 h-4" />
                                    Action
                                </Button>
                            }
                        />
                    )}

                    <div className="flex justify-center mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                        className={pagination.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                                        className={pagination.current_page === pagination.total_pages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </TabsContent>
            </Tabs>

            <AMCAnalyticsFilterDialog
                isOpen={isAnalyticsFilterOpen}
                onClose={() => setIsAnalyticsFilterOpen(false)}
                onApplyFilters={handleAnalyticsFilterApply}
            />
        </div>
    );
};