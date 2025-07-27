import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchInventoryData } from "@/store/slices/inventorySlice";
import { Button } from "@/components/ui/button";
import { DateFilterModal } from "@/components/DateFilterModal";
import {
    Upload,
    FileText,
    Filter,
    Eye,
    Plus,
    Package,
    AlertTriangle,
    CheckCircle,
    Leaf,
} from "lucide-react";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { InventoryFilterDialog } from "@/components/InventoryFilterDialog";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InventoryItem } from "@/store/slices/inventorySlice";

export const InventoryDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch < AppDispatch > ();

    // Redux state
    const {
        items: inventoryItems,
        loading,
        error,
        totalPages: reduxTotalPages,
        totalCount,
    } = useSelector((state: RootState) => state.inventory);

    // Calculate derived data from inventory items
    const totalInventories = totalCount;
    const activeCount = inventoryItems.filter(item => item.active).length;
    const inactiveCount = inventoryItems.filter(item => !item.active).length;
    const greenInventories = inventoryItems.filter(item => item.green_product).length;

    // Local state
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState < string[] > ([]);
    const [activeTab, setActiveTab] = useState < string > ("list");
    const [showDateFilter, setShowDateFilter] = useState(false);

    // Pagination
    const pageSize = 50;
    const totalPages = Math.ceil(totalInventories / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = inventoryItems.slice(startIndex, pageSize); // Show current page data

    // Load inventory data on component mount
    useEffect(() => {
        dispatch(fetchInventoryData({}));
    }, [dispatch]);

    const handleCreateItem = () => {
        navigate("/maintenance/inventory/add");
    };

    return (
        <div className="p-2 sm:p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 bg-white border border-gray-200">
                    <TabsTrigger
                        value="list"
                        className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Inventory List</span>
                        <span className="sm:hidden">List</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4 sm:space-y-6">
                    {/* Error handling */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            Error loading inventory data: {error}
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 my-6">
                            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                                dispatch(fetchInventoryData({}))
                            }
                            >
                                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                    <Settings
                                        className="w-4 h-4 sm:w-6 sm:h-6"
                                        style={{ color: "#C72030" }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                        {totalInventories}
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                                        Total Inventories
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                                dispatch(fetchInventoryData({ filters: { 'q[active_eq]': true } }))
                            }
                            >
                                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                    <Settings
                                        className="w-4 h-4 sm:w-6 sm:h-6"
                                        style={{ color: "#C72030" }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                        {activeCount}
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                                        Active Inventory
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer" onClick={() =>
                                dispatch(fetchInventoryData({ filters: { 'q[active_eq]': false } }))
                            }
                            >
                                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                    <Settings
                                        className="w-4 h-4 sm:w-6 sm:h-6"
                                        style={{ color: "#C72030" }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                        {inactiveCount}
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                                        Inactive
                                    </div>
                                </div>
                            </div>
                            <div
                                className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer"
                                onClick={() =>
                                    dispatch(
                                        fetchInventoryData({
                                            filters: { "q[green_product_eq]": true },
                                        })
                                    )
                                }
                            >
                                <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                                    <Settings
                                        className="w-4 h-4 sm:w-6 sm:h-6"
                                        style={{ color: "#C72030" }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                        {greenInventories || 0}
                                    </div>
                                    <div className="text-xs text-green-600 sm:text-sm text-muted-foreground font-medium leading-tight">
                                        Ecofriendly
                                    </div>
                                </div>
                            </div>
                            {/* <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]">
                       <div className="w-8 h-8 sm:w-12 sm:h-12  flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                         <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                       </div>
                       <div className="flex flex-col min-w-0">
                         <div className="text-lg sm:text-2xl font-bold leading-tight truncate" >
                           {2}
                         </div>
                         <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Closed</div>
                       </div>
                     </div> */}
                        </div>
                        {showActionPanel && (
                            <SelectionPanel
                                onAdd={handleAddInventory}
                                onImport={handleImportClick}
                                onClearSelection={() => setShowActionPanel(false)}
                            />
                        )}
                        <EnhancedTable
                            handleExport={handleExport}
                            data={paginatedData}
                            columns={columns}
                            renderCell={renderCell}
                            bulkActions={bulkActions}
                            showBulkActions={true}
                            selectable={true}
                            selectedItems={selectedItems}
                            onSelectItem={handleSelectItem}
                            onSelectAll={handleSelectAll}
                            pagination={false}
                            enableExport={true}
                            exportFileName="inventory"
                            onRowClick={handleViewItem}
                            storageKey="inventory-table"
                            loading={loading}
                            emptyMessage={
                                loading
                                    ? "Loading inventory data..."
                                    : "No inventory items found"
                            }
                            leftActions={renderCustomActions()}
                            onFilterClick={handleFiltersClick}
                        />
                    </div>
                    {/* Custom Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentPage(Math.max(1, currentPage - 1))
                                            }
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                    {renderPaginationItems()}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage(Math.min(totalPages, currentPage + 1))
                                            }
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
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <BulkUploadDialog
                open={showBulkUpload}
                onOpenChange={setShowBulkUpload}
                title="Upload Inventory Items"
            />

            <InventoryFilterDialog
                open={showFilter}
                onOpenChange={setShowFilter}
                onApply={(filters) => {
                    dispatch(fetchInventoryData({ filters }));
                }}
            />

            <DateFilterModal
                open={showDateFilter}
                onOpenChange={setShowDateFilter}
                onApply={(range) => {
                    dispatch(fetchInventoryData({ filters: { startDate: range.startDate, endDate: range.endDate } }));
                }}
            />
        </div>
    );
};