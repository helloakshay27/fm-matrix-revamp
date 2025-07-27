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
  const dispatch = useDispatch<AppDispatch>();

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("list");
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Inventory Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your inventory items, track stock levels, and monitor item status
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilter(true)}
                className="h-10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBulkUpload(true)}
                className="h-10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
              <Button onClick={handleCreateItem} className="h-10">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#f6f4ee] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C4B89D54] rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#C72030]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{totalInventories}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#f6f4ee] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C4B89D54] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#C72030]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Items</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f6f4ee] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C4B89D54] rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#C72030]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Items</p>
                  <p className="text-2xl font-bold">{inactiveCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f6f4ee] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C4B89D54] rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#C72030]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Green Products</p>
                  <p className="text-2xl font-bold">{greenInventories}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <EnhancedTable
              data={inventoryItems}
              columns={[
                { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
                { key: "itemCode", label: "Item Code", sortable: true, hideable: true, draggable: true },
                { key: "itemName", label: "Item Name", sortable: true, hideable: true, draggable: true },
                { key: "category", label: "Category", sortable: true, hideable: true, draggable: true },
                { key: "subCategory", label: "Sub Category", sortable: true, hideable: true, draggable: true },
                { key: "brand", label: "Brand", sortable: true, hideable: true, draggable: true },
                { key: "model", label: "Model", sortable: true, hideable: true, draggable: true },
                { key: "supplier", label: "Supplier", sortable: true, hideable: true, draggable: true },
                { key: "unit", label: "Unit", sortable: true, hideable: true, draggable: true },
                { key: "unitCost", label: "Unit Cost", sortable: true, hideable: true, draggable: true },
                { key: "totalStock", label: "Total Stock", sortable: true, hideable: true, draggable: true },
                { key: "consumedStock", label: "Consumed Stock", sortable: true, hideable: true, draggable: true },
                { key: "availableStock", label: "Available Stock", sortable: true, hideable: true, draggable: true },
                { key: "minimumStock", label: "Minimum Stock", sortable: true, hideable: true, draggable: true },
                { key: "greenProduct", label: "Green Product", sortable: true, hideable: true, draggable: true },
                { key: "active", label: "Status", sortable: true, hideable: true, draggable: true }
              ]}
              renderRow={(item) => ({
                actions: (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/maintenance/inventory/${item.id}`)}
                      className="p-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ),
                itemCode: item.code || item.reference_number || "-",
                itemName: item.name,
                category: item.category || "-",
                subCategory: item.sub_group || "-",
                brand: item.manufacturer || "-",
                model: "-",
                supplier: "-",
                unit: item.unit || "-",
                unitCost: item.cost ? `₹${parseFloat(item.cost.toString()).toFixed(2)}` : "-",
                totalStock: item.quantity || 0,
                consumedStock: 0,
                availableStock: item.quantity || 0,
                minimumStock: item.min_stock_level || 0,
                greenProduct: item.green_product ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <Leaf className="w-3 h-3 mr-1" />
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    No
                  </span>
                ),
                active: item.active ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    Inactive
                  </span>
                )
              })}
              enableSearch={true}
              enableSelection={true}
              enableExport={true}
              storageKey="inventory-table"
              searchPlaceholder="Search inventory items..."
            />
          </div>
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