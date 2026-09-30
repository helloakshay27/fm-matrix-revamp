import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Upload, X } from "lucide-react";
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
import { toast as sonnerToast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { getToken } from "@/utils/auth";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  WasteGenerationTagsFilterDialog,
  type WasteGenerationTagsFilters,
} from "@/components/WasteGenerationTagsFilterDialog";

interface GenericTagIconAttachment {
  attachment_url?: string | null;
  url?: string | null;
  document_file_name?: string | null;
  name?: string | null;
}

interface CommodityData {
  id: number;
  category_name: string;
  tag_type: string;
  customer_enabled?: boolean;
  icon?: string | GenericTagIconAttachment | null;
  icon_url?: string | null;
  image?: string | GenericTagIconAttachment | null;
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
  customer_enabled?: boolean;
  icon?: string | GenericTagIconAttachment | null;
  icon_url?: string | null;
  image?: string | GenericTagIconAttachment | null;
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

interface EditableWasteTag {
  id: number;
  tagType: "Commodity" | "Category";
  category_name: string;
  parent_id: number | null;
  category_type: string;
  customer_enabled: boolean;
  iconFile: File | null;
  iconUrl: string | null;
  iconName: string | null;
  removeIcon: boolean;
  loadingIcon: boolean;
}

const getTagIconDetails = (tag: CommodityData | CategoryData) => {
  const icon = tag.icon ?? tag.image;
  const iconObject = icon && typeof icon === "object" ? icon : null;
  const rawUrl =
    (typeof icon === "string" ? icon : null) ||
    iconObject?.attachment_url ||
    iconObject?.url ||
    tag.icon_url ||
    null;
  const url = rawUrl?.startsWith("//") ? `https:${rawUrl}` : rawUrl;
  const name =
    iconObject?.document_file_name ||
    iconObject?.name ||
    (url ? url.split("/").pop()?.split("?")[0] : null) ||
    null;

  return { url, name };
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
  {
    key: "customer_enabled",
    label: "Customer Enabled",
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
  {
    key: "customer_enabled",
    label: "Customer Enabled",
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
  const [commodityCustomerEnabled, setCommodityCustomerEnabled] = useState(false);
  const [commodityIconFile, setCommodityIconFile] = useState<File | null>(null);
  const [categoryInputs, setCategoryInputs] = useState({
    parent_id: "",
    category_name: "",
    category_type: "",
    customer_enabled: false,
    iconFile: null as File | null,
  });
  const [editingTag, setEditingTag] = useState<EditableWasteTag | null>(null);
  const [landlordInput, setLandlordInput] = useState("");

  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [landlords, setLandlords] = useState<LandlordData[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingCustomerEnabled, setUpdatingCustomerEnabled] = useState<Record<number, boolean>>({});

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
      sonnerToast.error("Please enter a commodity name");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = new FormData();
      payload.append("pms_generic_tag[tag_type]", "Commodity");
      payload.append("pms_generic_tag[active]", "1");
      payload.append("pms_generic_tag[category_name]", commodityInput);
      payload.append(
        "pms_generic_tag[customer_enabled]",
        String(commodityCustomerEnabled)
      );
      if (commodityIconFile) {
        payload.append("pms_generic_tag[icon]", commodityIconFile);
      }

      const response = await fetch(getApiUrl("/pms/generic_tags.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to add commodity");
      }

      setCommodityInput("");
      setCommodityCustomerEnabled(false);
      setCommodityIconFile(null);
      setIsAddCommodityModalOpen(false);
      sonnerToast.success("Commodity added successfully");
      loadData();
    } catch (error) {
      console.error("Error adding commodity:", error);
      sonnerToast.error("Failed to add commodity");
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
      sonnerToast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = new FormData();
      payload.append("pms_generic_tag[tag_type]", "Category");
      payload.append("pms_generic_tag[active]", "1");
      payload.append("pms_generic_tag[parent_id]", categoryInputs.parent_id);
      payload.append("pms_generic_tag[category_name]", categoryInputs.category_name);
      payload.append("pms_generic_tag[category_type]", categoryInputs.category_type);
      payload.append(
        "pms_generic_tag[customer_enabled]",
        String(categoryInputs.customer_enabled)
      );
      if (categoryInputs.iconFile) {
        payload.append("pms_generic_tag[icon]", categoryInputs.iconFile);
      }

      const response = await fetch(getApiUrl("/pms/generic_tags.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setCategoryInputs({
        parent_id: "",
        category_name: "",
        category_type: "",
        customer_enabled: false,
        iconFile: null,
      });
      setIsAddCategoryModalOpen(false);
      sonnerToast.success("Category added successfully");
      loadData();
    } catch (error) {
      console.error("Error adding category:", error);
      sonnerToast.error("Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditTag = async (item: CommodityData | CategoryData) => {
    const isCategory = activeTab === "Category";
    const iconDetails = getTagIconDetails(item);
    setEditingTag({
      id: item.id,
      tagType: isCategory ? "Category" : "Commodity",
      category_name: item.category_name,
      parent_id: isCategory ? (item as CategoryData).parent_id : null,
      category_type: isCategory ? (item as CategoryData).category_type || "" : "",
      customer_enabled: Boolean(item.customer_enabled),
      iconFile: null,
      iconUrl: iconDetails.url,
      iconName: iconDetails.name,
      removeIcon: false,
      loadingIcon: true,
    });

    try {
      const response = await fetch(
        getApiUrl(`/pms/generic_tags/${item.id}.json`),
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to load tag details");

      const responseData = await response.json();
      const tagData = responseData?.pms_generic_tag ?? responseData;
      const details = getTagIconDetails({ ...item, ...tagData });
      setEditingTag((previous) =>
        previous?.id === item.id
          ? {
              ...previous,
              iconUrl: details.url,
              iconName: details.name,
              loadingIcon: false,
            }
          : previous
      );
    } catch (error) {
      console.error("Error loading tag icon:", error);
      setEditingTag((previous) =>
        previous?.id === item.id ? { ...previous, loadingIcon: false } : previous
      );
    }
  };

  const handleTagUpdate = async () => {
    if (!editingTag?.category_name.trim()) {
      sonnerToast.error("Please enter a name");
      return;
    }
    if (
      editingTag.tagType === "Category" &&
      (!editingTag.parent_id || !editingTag.category_type.trim())
    ) {
      sonnerToast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = new FormData();
      payload.append("pms_generic_tag[tag_type]", editingTag.tagType);
      payload.append("pms_generic_tag[category_name]", editingTag.category_name);
      payload.append(
        "pms_generic_tag[customer_enabled]",
        String(editingTag.customer_enabled)
      );
      if (editingTag.iconFile) {
        payload.append("pms_generic_tag[icon]", editingTag.iconFile);
      }
      if (editingTag.removeIcon) {
        payload.append("pms_generic_tag[remove_icon]", "true");
      }
      if (editingTag.tagType === "Category") {
        payload.append("pms_generic_tag[parent_id]", String(editingTag.parent_id));
        payload.append("pms_generic_tag[category_type]", editingTag.category_type);
      }

      const response = await fetch(
        getApiUrl(`/pms/generic_tags/${editingTag.id}.json`),
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      setEditingTag(null);
      sonnerToast.success("Tag updated successfully");
      loadData();
    } catch (error) {
      console.error("Error updating tag:", error);
      sonnerToast.error("Failed to update tag");
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

  const handleCustomerEnabledToggle = async (
    item: CommodityData | CategoryData,
    customerEnabled: boolean
  ) => {
    if (updatingCustomerEnabled[item.id]) return;

    setUpdatingCustomerEnabled((previous) => ({ ...previous, [item.id]: true }));
    try {
      const response = await fetch(
        getApiUrl(`/pms/generic_tags/${item.id}.json`),
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pms_generic_tag: { customer_enabled: customerEnabled },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer enabled setting");
      }

      setCommodities((previous) =>
        previous.map((tag) =>
          tag.id === item.id ? { ...tag, customer_enabled: customerEnabled } : tag
        )
      );
      setCategories((previous) =>
        previous.map((tag) =>
          tag.id === item.id ? { ...tag, customer_enabled: customerEnabled } : tag
        )
      );
      sonnerToast.success(
        `Customer access ${customerEnabled ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error updating customer enabled setting:", error);
      sonnerToast.error("Failed to update Customer Enabled");
    } finally {
      setUpdatingCustomerEnabled((previous) => ({ ...previous, [item.id]: false }));
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
      case "customer_enabled": {
        const tag = item as CommodityData | CategoryData;
        return (
          <div className="flex items-center gap-2">
            <Switch
              id={`customer-enabled-${tag.id}`}
              checked={Boolean(tag.customer_enabled)}
              disabled={
                !shouldShow("Waste Generation", "edit") ||
                Boolean(updatingCustomerEnabled[tag.id])
              }
              onCheckedChange={(checked) =>
                handleCustomerEnabledToggle(tag, checked)
              }
              aria-label={`Customer Enabled for ${tag.category_name}`}
            />
            <span className="text-sm text-gray-600">
              {tag.customer_enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        );
      }
      case "status":
        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
              item.active
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

  const renderActions = (item: CommodityData | CategoryData | LandlordData) => {
    if (
      (activeTab !== "Commodity" && activeTab !== "Category") ||
      !shouldShow("Waste Generation", "edit")
    ) {
      return null;
    }
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={`Edit ${activeTab.toLowerCase()}`}
        aria-label={`Edit ${activeTab.toLowerCase()}`}
        onClick={() => openEditTag(item as CommodityData | CategoryData)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    );
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
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
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
          renderActions={renderActions}
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
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-900">
                Upload Icon <span className="text-brand">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="commodity-icon-file"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-brand px-3 text-xs font-medium text-brand hover:bg-brand-selected"
                >
                  <Upload className="h-4 w-4" />
                  Upload Icon
                </label>
                <input
                  id="commodity-icon-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setCommodityIconFile(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              {commodityIconFile && (
                <p className="text-xs text-gray-500">Selected: {commodityIconFile.name}</p>
              )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="commodity-customer-enabled"
                checked={commodityCustomerEnabled}
                onCheckedChange={setCommodityCustomerEnabled}
              />
              <Label htmlFor="commodity-customer-enabled">Customer Enabled</Label>
            </div>
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
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-900">
                Upload Icon <span className="text-brand">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="category-icon-file"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-brand px-3 text-xs font-medium text-brand hover:bg-brand-selected"
                >
                  <Upload className="h-4 w-4" />
                  Upload Icon
                </label>
                <input
                  id="category-icon-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setCategoryInputs((prev) => ({
                      ...prev,
                      iconFile: e.target.files?.[0] ?? null,
                    }));
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                {categoryInputs.iconFile && (
                  <p className="text-xs text-gray-500">Selected: {categoryInputs.iconFile.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="category-customer-enabled"
                checked={categoryInputs.customer_enabled}
                onCheckedChange={(checked) =>
                  setCategoryInputs((prev) => ({
                    ...prev,
                    customer_enabled: checked,
                  }))
                }
              />
              <Label htmlFor="category-customer-enabled">Customer Enabled</Label>
            </div>
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
        open={Boolean(editingTag)}
        onOpenChange={(open) => {
          if (!open) setEditingTag(null);
        }}
        modal={false}
      >
        <DialogContent
          className="sm:max-w-[500px]"
          onPointerDownOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isMuiOverlayTarget(e.target)) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              Edit {editingTag?.tagType === "Category" ? "Category" : "Commodity"}
            </DialogTitle>
            <DialogDescription>Update tag details below</DialogDescription>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4 py-4">
              {editingTag.tagType === "Category" && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="edit-parent-commodity-label" shrink>
                    Parent Commodity*
                  </InputLabel>
                  <MuiSelect
                    labelId="edit-parent-commodity-label"
                    value={editingTag.parent_id?.toString() || ""}
                    onChange={(e) =>
                      setEditingTag((prev) =>
                        prev
                          ? { ...prev, parent_id: Number(e.target.value) || null }
                          : prev
                      )
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
              )}
              <TextField
                label={`${editingTag.tagType}*`}
                value={editingTag.category_name}
                onChange={(e) =>
                  setEditingTag((prev) =>
                    prev ? { ...prev, category_name: e.target.value } : prev
                  )
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
              {editingTag.tagType === "Category" && (
                <TextField
                  label="Category Type*"
                  value={editingTag.category_type}
                  onChange={(e) =>
                    setEditingTag((prev) =>
                      prev ? { ...prev, category_type: e.target.value } : prev
                    )
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              )}
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-900">
                  Upload Icon <span className="text-brand">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="edit-tag-icon-file"
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-brand px-3 text-xs font-medium text-brand hover:bg-brand-selected"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Icon
                  </label>
                  <input
                    id="edit-tag-icon-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const iconFile = e.target.files?.[0] ?? null;
                      setEditingTag((prev) =>
                        prev ? { ...prev, iconFile, removeIcon: false } : prev
                      );
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  {editingTag.iconFile ? (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="max-w-[200px] truncate">{editingTag.iconFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const previewUrl = URL.createObjectURL(editingTag.iconFile as File);
                          window.open(previewUrl, "_blank", "noopener,noreferrer");
                          window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
                        }}
                        className="inline-flex items-center gap-1 text-brand hover:underline"
                        aria-label="View selected icon"
                        title="View selected icon"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTag((prev) =>
                            prev ? { ...prev, iconFile: null } : prev
                          )
                        }
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Remove selected icon"
                        title="Remove selected icon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : editingTag.iconUrl && !editingTag.removeIcon ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={editingTag.iconUrl}
                        alt={editingTag.iconName || "Current icon"}
                        className="h-8 w-8 rounded border border-gray-200 object-contain"
                      />
                      <span className="max-w-[160px] truncate text-xs text-gray-600">
                        {editingTag.iconName || "Current icon"}
                      </span>
                      <a
                        href={editingTag.iconUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTag((prev) =>
                            prev ? { ...prev, removeIcon: true } : prev
                          )
                        }
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Remove current icon"
                        title="Remove current icon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : editingTag.loadingIcon ? (
                    <span className="text-xs text-gray-500">Loading icon...</span>
                  ) : editingTag.removeIcon ? (
                    <span className="text-xs text-gray-500">Icon will be removed</span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="edit-customer-enabled"
                  checked={editingTag.customer_enabled}
                  onCheckedChange={(checked) =>
                    setEditingTag((prev) =>
                      prev ? { ...prev, customer_enabled: checked } : prev
                    )
                  }
                />
                <Label htmlFor="edit-customer-enabled">Customer Enabled</Label>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingTag(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTagUpdate}
              className="bg-brand text-white hover:bg-brand-hover"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
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
