import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/config/apiConfig";
import { getToken } from "@/utils/auth";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  WasteGenerationTagsFilterDialog,
  type WasteGenerationTagsFilters,
} from "@/components/WasteGenerationTagsFilterDialog";

interface CommodityData {
  id: number;
  category_name: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
}

interface CategoryData {
  id: number;
  category_name: string;
  category_type: string | null;
  parent_id: number | null;
  parent_name: string | null;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
}

interface LandlordData {
  id: number;
  category_name: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  url: string;
}

const emptyFilters: WasteGenerationTagsFilters = {
  name: "",
  status: "",
};

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  backgroundColor: "#fff",
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
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

const isMuiOverlayTarget = (target: EventTarget | null) =>
  !!(target as HTMLElement | null)?.closest?.(
    ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
  );

const commodityColumns: ColumnConfig[] = [
  {
    key: "category_name",
    label: "Commodity",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    defaultVisible: true,
  },
];

const categoryColumns: ColumnConfig[] = [
  {
    key: "parent_name",
    label: "Parent Commodity",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "category_name",
    label: "Category",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "category_type",
    label: "Category Type",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    defaultVisible: true,
  },
];

const landlordColumns: ColumnConfig[] = [
  {
    key: "category_name",
    label: "Operational Name",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    defaultVisible: true,
  },
];

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString("en-GB");
  } catch {
    return value || "-";
  }
};

export const UtilityWasteGenerationSetupDashboard = () => {
  const { toast } = useToast();
  const { shouldShow } = useDynamicPermissions();
  const [activeTab, setActiveTab] = useState("Commodity");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] =
    useState<WasteGenerationTagsFilters>(emptyFilters);

  const [isAddCommodityModalOpen, setIsAddCommodityModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddLandlordModalOpen, setIsAddLandlordModalOpen] = useState(false);

  const [commodityInput, setCommodityInput] = useState("");
  const [categoryInputs, setCategoryInputs] = useState({
    parent_id: "",
    category_name: "",
    category_type: "",
  });
  const [landlordInput, setLandlordInput] = useState("");

  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [landlords, setLandlords] = useState<LandlordData[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const getApiUrl = (endpoint: string) => {
    const baseUrl = API_CONFIG.BASE_URL;
    return `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}${endpoint}`;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      let endpoint = "";

      switch (activeTab) {
        case "Commodity":
          endpoint = "/pms/generic_tags.json?q[tag_type_eq]=Commodity";
          break;
        case "Category":
          endpoint = "/pms/generic_tags.json?q[tag_type_eq]=Category";
          break;
        case "Operational Name of Landlord/Tenant":
          endpoint =
            "/pms/generic_tags.json?q[tag_type_eq]=operational_name_of_landlord";
          break;
        default:
          return;
      }

      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      switch (activeTab) {
        case "Commodity":
          setCommodities(data);
          break;
        case "Category":
          setCategories(data);
          // Keep commodities available for parent dropdown
          if (commodities.length === 0) {
            const commodityRes = await fetch(
              getApiUrl("/pms/generic_tags.json?q[tag_type_eq]=Commodity"),
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (commodityRes.ok) {
              setCommodities(await commodityRes.json());
            }
          }
          break;
        case "Operational Name of Landlord/Tenant":
          setLandlords(data);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let rows: Array<CommodityData | CategoryData | LandlordData> = [];
    switch (activeTab) {
      case "Commodity":
        rows = commodities;
        break;
      case "Category":
        rows = categories;
        break;
      case "Operational Name of Landlord/Tenant":
        rows = landlords;
        break;
    }

    return rows.filter((item) => {
      const name = String(item.category_name || "").toLowerCase();
      const status = item.active ? "active" : "inactive";
      const parentName =
        "parent_name" in item
          ? String(item.parent_name || "").toLowerCase()
          : "";
      const categoryType =
        "category_type" in item
          ? String(item.category_type || "").toLowerCase()
          : "";
      const createdOn = formatDate(item.created_at).toLowerCase();

      if (filters.name && !name.includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.status && status !== filters.status.toLowerCase()) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          name.includes(q) ||
          parentName.includes(q) ||
          categoryType.includes(q) ||
          status.includes(q) ||
          createdOn.includes(q)
        );
      }

      return true;
    });
  }, [activeTab, commodities, categories, landlords, searchTerm, filters]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm("");
    setFilters(emptyFilters);
  };

  const handleCommoditySubmit = async () => {
    if (!commodityInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commodity name",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "Commodity",
          active: "1",
          category_name: commodityInput,
        },
      };

      const response = await fetch(getApiUrl("/pms/generic_tags.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add commodity");
      }

      setCommodityInput("");
      setIsAddCommodityModalOpen(false);
      toast({
        title: "Success",
        description: "Commodity added successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error adding commodity:", error);
      toast({
        title: "Error",
        description: "Failed to add commodity",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async () => {
    if (
      !categoryInputs.parent_id ||
      !categoryInputs.category_name ||
      !categoryInputs.category_type
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "Category",
          active: "1",
          parent_id: categoryInputs.parent_id,
          category_name: categoryInputs.category_name,
          category_type: categoryInputs.category_type,
        },
      };

      const response = await fetch(getApiUrl("/pms/generic_tags.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setCategoryInputs({
        parent_id: "",
        category_name: "",
        category_type: "",
      });
      setIsAddCategoryModalOpen(false);
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLandlordSubmit = async () => {
    if (!landlordInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter landlord/tenant name",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        pms_generic_tag: {
          tag_type: "operational_name_of_landlord",
          active: "1",
          category_name: landlordInput,
        },
      };

      const response = await fetch(getApiUrl("/pms/generic_tags.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add landlord/tenant");
      }

      setLandlordInput("");
      setIsAddLandlordModalOpen(false);
      toast({
        title: "Success",
        description: "Landlord/Tenant added successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error adding landlord/tenant:", error);
      toast({
        title: "Error",
        description: "Failed to add landlord/tenant",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = (id: number) => {
    switch (activeTab) {
      case "Commodity":
        setCommodities((list) =>
          list.map((item) =>
            item.id === id ? { ...item, active: !item.active } : item
          )
        );
        break;
      case "Category":
        setCategories((list) =>
          list.map((item) =>
            item.id === id ? { ...item, active: !item.active } : item
          )
        );
        break;
      case "Operational Name of Landlord/Tenant":
        setLandlords((list) =>
          list.map((item) =>
            item.id === id ? { ...item, active: !item.active } : item
          )
        );
        break;
    }
  };

  const columns =
    activeTab === "Category"
      ? categoryColumns
      : activeTab === "Operational Name of Landlord/Tenant"
        ? landlordColumns
        : commodityColumns;

  const renderCell = (
    item: CommodityData | CategoryData | LandlordData,
    columnKey: string
  ) => {
    switch (columnKey) {
      case "category_name":
        return <span className="font-medium">{item.category_name}</span>;
      case "parent_name":
        return (item as CategoryData).parent_name || "-";
      case "category_type":
        return (item as CategoryData).category_type || "-";
      case "status":
        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${item.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
            onClick={() => handleStatusToggle(item.id)}
          >
            {item.active ? "Active" : "Inactive"}
          </span>
        );
      case "created_at":
        return (
          <span className="text-sm text-gray-600">
            {formatDate(item.created_at)}
          </span>
        );
      default:
        return "-";
    }
  };

  const leftActions = shouldShow("Waste Generation", "create") ? (
    <Button
      onClick={() => {
        if (activeTab === "Commodity") setIsAddCommodityModalOpen(true);
        else if (activeTab === "Category") setIsAddCategoryModalOpen(true);
        else setIsAddLandlordModalOpen(true);
      }}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      {activeTab === "Commodity"
        ? "Add Commodity"
        : activeTab === "Category"
          ? "Add Category"
          : "Add Landlord/Tenant"}
    </Button>
  ) : null;

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            WASTE GENERATION TAGS
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage waste categories, commodities, and units of measurement
          </p>
        </div>

        <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
          {[
            "Commodity",
            "Category",
            "Operational Name of Landlord/Tenant",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? "border-brand text-brand bg-brand-selected"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          leftActions={leftActions}
          storageKey={`waste-generation-tags-${activeTab}`}
          emptyMessage={
            searchTerm || Object.values(filters).some(Boolean)
              ? "No records found matching your search"
              : "No records found"
          }
          loading={loading}
          loadingMessage="Loading..."
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search..."
          disableClientSearch
          onFilterClick={() => setShowFilters(true)}
          hideTableExport
          pagination
          pageSize={10}
          getItemId={(item) => String(item.id)}
        />

        <WasteGenerationTagsFilterDialog
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApplyFilters={setFilters}
          onResetFilters={() => setFilters(emptyFilters)}
        />
      </div>

      <Dialog
        open={isAddCommodityModalOpen}
        onOpenChange={setIsAddCommodityModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Commodity</DialogTitle>
            <DialogDescription>Enter commodity details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextField
              label="Commodity*"
              placeholder="Enter commodity name"
              value={commodityInput}
              onChange={(e) => setCommodityInput(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddCommodityModalOpen(false)}
              disabled={submitting}
              className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCommoditySubmit}
              className="bg-brand text-white hover:bg-brand-hover"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* modal={false} lets portaled MUI Select menus receive clicks/scroll */}
      <Dialog
        open={isAddCategoryModalOpen}
        onOpenChange={setIsAddCategoryModalOpen}
        modal={false}
      >
        <DialogContent
          className="sm:max-w-[500px]"
          onPointerDownOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Enter category details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="parent-commodity-label" shrink>
                Parent Commodity*
              </InputLabel>
              <MuiSelect
                labelId="parent-commodity-label"
                value={categoryInputs.parent_id}
                onChange={(e) =>
                  setCategoryInputs((prev) => ({
                    ...prev,
                    parent_id: e.target.value as string,
                  }))
                }
                label="Parent Commodity*"
                displayEmpty
                notched
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Parent Commodity</em>
                </MenuItem>
                {commodities.map((commodity) => (
                  <MenuItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.category_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              label="Category Name*"
              placeholder="Enter category name"
              value={categoryInputs.category_name}
              onChange={(e) =>
                setCategoryInputs((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <TextField
              label="Category Type*"
              placeholder="Enter category type"
              value={categoryInputs.category_type}
              onChange={(e) =>
                setCategoryInputs((prev) => ({
                  ...prev,
                  category_type: e.target.value,
                }))
              }
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryModalOpen(false)}
              disabled={submitting}
              className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] hover:text-[#C72030]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCategorySubmit}
              className="bg-brand text-white hover:bg-brand-hover"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddLandlordModalOpen}
        onOpenChange={setIsAddLandlordModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Landlord/Tenant</DialogTitle>
            <DialogDescription>Enter operational name below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextField
              label="Operational Name of Landlord/Tenant*"
              placeholder="Enter operational name"
              value={landlordInput}
              onChange={(e) => setLandlordInput(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddLandlordModalOpen(false)}
              disabled={submitting}
              className="border-brand text-brand hover:bg-brand-selected"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLandlordSubmit}
              className="bg-brand text-white hover:bg-brand-hover"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
