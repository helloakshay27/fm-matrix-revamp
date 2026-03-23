import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
  Loader2,
  X,
  RefreshCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { toast } from "sonner";
import axios from "axios";
import { TextField } from "@mui/material";
import { string } from "zod";

interface SmsTemplate {
  id: number;
  organization_id: number | null;
  organization_name: string | null;
  module_name: string;
  function_name: string;
  priority: string;
  service_provider: string;
  template_name: string;
  dlt_template_id: string;
  template_url: string;
  is_default: boolean;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const SmsManagementPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgsList, setOrgsList] = useState<any[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    organization_id: "",
    module_name: "",
    function_name: "",
    priority: "",
    service_provider: "",
    template_name: "",
    dlt_template_id: "",
    template_url: "",
    is_default: false,
    active: true,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    organization_id_eq: "",
    module_name_eq: "",
    function_name_cont: "",
    priority_eq: "",
    service_provider_eq: "",
    template_name_cont: "",
    dlt_template_id_eq: "",
    template_url_cont: "",
    is_default_eq: "",
    active_eq: "",
    created_at_gteq: "",
    updated_at_lteq: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      organization_id_eq: "",
      module_name_eq: "",
      function_name_cont: "",
      priority_eq: "",
      service_provider_eq: "",
      template_name_cont: "",
      dlt_template_id_eq: "",
      template_url_cont: "",
      is_default_eq: "",
      active_eq: "",
      created_at_gteq: "",
      updated_at_lteq: "",
    });
  };

  const applyFilters = () => {
    console.warn("Applying filters:", filters);
    setIsFilterOpen(false);
    // Add logic here to refetch data with applied filters if needed
  };

  const BASE_URL = "https://live-api.gophygital.work";
  const TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5MjUwMX0.LkKKfx3ZkV8Fs4LumP6atRBgPVig9oCqTrN0kIa9cQk";

  const fetchSmsTemplates = async (searchTerm?: string) => {
    const isFetchingSearch = !!searchTerm?.trim();
    if (isFetchingSearch) {
      setIsSearching(true);
    } else {
      setIsLoading(true);
    }
    try {
      const url = searchTerm?.trim()
        ? `${BASE_URL}/sms_templates.json?q[combined_search_eq]=${encodeURIComponent(searchTerm)}&token=${TOKEN}`
        : `${BASE_URL}/sms_templates.json?token=${TOKEN}`;
      const response = await axios.get(url);
      const data: SmsTemplate[] = response.data?.data || [];
      setSmsTemplates(data);
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
      toast.error("Failed to fetch SMS templates");
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSmsTemplates(search);
    }
  };

  useEffect(() => {
    fetchSmsTemplates();
    const fetchOrgs = async () => {
      setIsLoadingOrgs(true);
      try {
        const response = await axios.get(
          "https://live-api.gophygital.work/organizations.json?token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5MjUwMX0.LkKKfx3ZkV8Fs4LumP6atRBgPVig9oCqTrN0kIa9cQk"
        );
        setOrgsList(response.data.organizations || []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to load organizations");
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    fetchOrgs();
  }, []);

  const orgOptions = useMemo(
    () =>
      orgsList.map((org: any) => ({
        value: org.id.toString(),
        label: `${org.name} (${org.id})`,
      })),
    [orgsList]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: checked };
      if (name === "is_default" && checked) {
        nextData.organization_id = "";
      }
      return nextData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields: (keyof typeof formData)[] = [
      "module_name",
      "function_name",
      "priority",
      "service_provider",
      "template_name",
      "dlt_template_id",
      "template_url",
    ];

    // If not default, organization is required
    if (!formData.is_default && !formData.organization_id) {
      toast.error("Please select an organization");
      return;
    }

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        sms_template: {
          ...formData,
          organization_id: formData.is_default
            ? null
            : formData.organization_id
              ? parseInt(formData.organization_id)
              : null,
        },
      };

      const url = editingId 
        ? `${BASE_URL}/sms_templates/${editingId}.json?token=${TOKEN}`
        : `${BASE_URL}/sms_templates.json?token=${TOKEN}`;

      if (editingId) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }

      toast.success(
        editingId
          ? "SMS Template updated successfully"
          : "SMS Template created successfully"
      );
      
      // Refresh the list to show the new/updated template
      fetchSmsTemplates();
      
      setIsModalOpen(false);
      setEditingId(null);
      // Reset form
      setFormData({
        organization_id: "",
        module_name: "",
        function_name: "",
        priority: "",
        service_provider: "",
        template_name: "",
        dlt_template_id: "",
        template_url: "",
        is_default: false,
        active: true,
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(editingId ? "Failed to update SMS Template" : "Failed to create SMS Template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnConfig[] = [
    {
      key: "organization_name",
      label: "Organization",
      sortable: true,
      draggable: true,
    },
    {
      key: "module_name",
      label: "Module Name",
      sortable: true,
      draggable: true,
    },
    {
      key: "function_name",
      label: "Function Name",
      sortable: true,
      draggable: true,
    },
    { key: "priority", label: "Priority", sortable: true, draggable: true },
    {
      key: "service_provider",
      label: "Service Provider",
      sortable: true,
      draggable: true,
    },
    {
      key: "template_name",
      label: "Template Name",
      sortable: true,
      draggable: true,
    },
    {
      key: "dlt_template_id",
      label: "DLT Template ID",
      sortable: true,
      draggable: true,
    },
    { key: "is_default", label: "Is Default", sortable: true, draggable: true },
    { key: "active", label: "Active", sortable: true, draggable: true },
    { key: "created_at", label: "Created At", sortable: true, draggable: true },
  ];

  const renderActions = (row: SmsTemplate) => (
    <div className="flex items-center gap-4 justify-center">
      <button
        className="text-gray-400 hover:text-gray-900 transition-colors"
        title="View"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        className="text-black hover:text-gray-700 transition-colors"
        title="Edit"
        onClick={() => {
          setEditingId(row.id);
          setFormData({
            organization_id: row.organization_id?.toString() ?? "",
            module_name: row.module_name,
            function_name: row.function_name,
            priority: row.priority,
            service_provider: row.service_provider,
            template_name: row.template_name,
            dlt_template_id: row.dlt_template_id,
            template_url: row.template_url,
            is_default: row.is_default,
            active: row.active,
          });
          setIsModalOpen(true);
        }}
      >
        <Edit className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const renderCell = (row: SmsTemplate, columnKey: string) => {
    const rowKey = columnKey as keyof SmsTemplate;
    switch (columnKey) {
      case "organization_name":
        return (
          <div className="flex flex-col">
            <span className="font-bold text-[#1a1a1a] text-[15px]">
              {row.organization_name ?? "Default (Global)"}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              ID: {row.id}
            </span>
            {row.created_by && (
              <span className="text-[11px] text-[#3b82f6] font-medium mt-0.5">
                By: {row.created_by}
              </span>
            )}
          </div>
        );
      case "active":
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              row.active
                ? "bg-[#ecfdf5] text-[#10b981]"
                : "bg-[#fef2f2] text-[#ef4444]"
            }`}
          >
            {row.active ? "Active" : "Inactive"}
          </span>
        );
      case "priority":
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              row.priority === "primary"
                ? "bg-blue-50 text-blue-600"
                : "bg-purple-50 text-purple-600"
            }`}
          >
            {row.priority === "primary" ? "Primary" : "Secondary"}
          </span>
        );
      case "is_default":
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              row.is_default
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {row.is_default ? "Yes" : "No"}
          </span>
        );
      case "template_name":
        return (
          <span
            className="text-[#1a1a1a] font-medium text-sm max-w-[180px] truncate block"
            title={row.template_name}
          >
            {row.template_name}
          </span>
        );
      case "dlt_template_id":
        return (
          <span className="text-[#4b5563] font-mono text-xs bg-slate-50 px-2 py-0.5 rounded">
            {row.dlt_template_id}
          </span>
        );
      case "module_name":
      case "function_name":
      case "service_provider":
      case "created_at":
        return (
          <span className="text-[#4b5563] font-medium">
            {row[rowKey] as string}
          </span>
        );
      default:
        return row[rowKey];
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#fafafa]">
      {/* Design Matching Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-6 tracking-tight">
          SMS Management
        </h1>
      </div>

      <div className="mt-8">
        <EnhancedTable
          data={smsTemplates}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          selectable={false}
          getItemId={(item) => item.id.toString()}
          searchTerm={search}
          onSearchChange={setSearch}
          leftActions={
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  organization_id: "",
                  module_name: "",
                  function_name: "",
                  priority: "",
                  service_provider: "",
                  template_name: "",
                  dlt_template_id: "",
                  template_url: "",
                  is_default: false,
                  active: true,
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-[#f6f4ee] text-[#C72030] text-sm font-bold rounded-sm border border-[#e2decb] hover:bg-[#f0ede4] transition-colors leading-relaxed"
            >
              <Plus className="w-4 h-4" />
              Add SMS Template
            </button>
          }
          customSearchInput={
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 w-64 bg-white h-10"
                />
              </div>
              <button
                onClick={() => fetchSmsTemplates(search)}
                disabled={isSearching}
                className="flex items-center gap-1.5 px-4 py-2 h-10 bg-[#C72030] text-white text-sm font-semibold rounded-md hover:bg-[#a81c29] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          }
          hideTableSearch={false}
          hideTableExport={true}
          pagination={true}
          pageSize={10}
          className="font-poppins"
          onFilterClick={() => setIsFilterOpen(true)}
        />
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl rounded-xl bg-white font-poppins">
          <DialogHeader className="p-6 bg-[#f8fafc] border-b border-slate-100 rounded-t-xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C72030] bg-opacity-10 rounded-lg">
                  <Filter className="w-5 h-5 text-[#C72030]" />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Filter SMS Templates
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <EnhancedSelect
                  label="Organization"
                  value={filters.organization_id_eq}
                  onChange={(val) =>
                    handleFilterChange("organization_id_eq", val.toString())
                  }
                  options={orgOptions}
                  placeholder="Select Organization"
                  searchable={true}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Module Name
                </Label>
                <Input
                  placeholder="e.g. auth"
                  value={filters.module_name_eq}
                  onChange={(e) =>
                    handleFilterChange("module_name_eq", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Function Name
                </Label>
                <Input
                  placeholder="e.g. login"
                  value={filters.function_name_cont}
                  onChange={(e) =>
                    handleFilterChange("function_name_cont", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <EnhancedSelect
                  label="Priority"
                  value={filters.priority_eq}
                  onChange={(val) =>
                    handleFilterChange("priority_eq", val.toString())
                  }
                  options={[
                    { value: "primary", label: "Primary" },
                    { value: "secondary", label: "Secondary" },
                  ]}
                  placeholder="Select Priority"
                  searchable={true}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Service Provider
                </Label>
                <Input
                  placeholder="e.g. twilio"
                  value={filters.service_provider_eq}
                  onChange={(e) =>
                    handleFilterChange("service_provider_eq", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Template Name
                </Label>
                <Input
                  placeholder="e.g. welcome"
                  value={filters.template_name_cont}
                  onChange={(e) =>
                    handleFilterChange("template_name_cont", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  DLT Template ID
                </Label>
                <Input
                  placeholder="e.g. 789"
                  value={filters.dlt_template_id_eq}
                  onChange={(e) =>
                    handleFilterChange("dlt_template_id_eq", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Template URL
                </Label>
                <Input
                  placeholder="e.g. https"
                  value={filters.template_url_cont}
                  onChange={(e) =>
                    handleFilterChange("template_url_cont", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <EnhancedSelect
                  label="Is Default"
                  value={filters.is_default_eq}
                  onChange={(val) =>
                    handleFilterChange("is_default_eq", val.toString())
                  }
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  placeholder="Any"
                  searchable={true}
                />
              </div>

              <div className="space-y-2">
                <EnhancedSelect
                  label="Active Status"
                  value={filters.active_eq}
                  onChange={(val) =>
                    handleFilterChange("active_eq", val.toString())
                  }
                  options={[
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ]}
                  placeholder="Any"
                  searchable={true}
                />
              </div>


              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Created At
                </Label>
                <Input
                  type="date"
                  value={filters.created_at_gteq}
                  onChange={(e) =>
                    handleFilterChange("created_at_gteq", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Updated At
                </Label>
                <Input
                  type="date"
                  value={filters.updated_at_lteq}
                  onChange={(e) =>
                    handleFilterChange("updated_at_lteq", e.target.value)
                  }
                  className="h-10 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
            <div className="flex gap-3 w-full sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="flex-1 sm:flex-none border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold h-11 px-6"
              >
                Clear
              </Button>
              <Button
                type="button"
                onClick={applyFilters}
                className="flex-1 sm:flex-none bg-[#C72030] hover:bg-[#a81c29] text-white font-bold h-11 px-8"
              >
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl rounded-xl bg-white">
          <DialogHeader className="p-6 bg-[#f8fafc] border-b border-slate-100 rounded-t-xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C72030] bg-opacity-10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-[#C72030]" />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit SMS Template" : "Add SMS Template"}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex items-center gap-12 pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("is_default", !!checked)
                  }
                />
                <Label
                  htmlFor="is_default"
                  className="text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  Is Default
                </Label>
              </div>
              {!editingId && (
                <div className="flex items-center space-x-3">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("active", !!checked)
                    }
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    Active Status
                  </Label>
                </div>
              )}
            </div>

            {editingId ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className={`space-y-1 transition-all duration-300 ${formData.is_default ? "opacity-30 pointer-events-none" : ""}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Organization <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.organization_id
                      ? (orgOptions.find(
                          (o) => o.value === formData.organization_id
                        )?.label ?? `ID: ${formData.organization_id}`)
                      : "Default (Global)"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Module Name <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.module_name || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Function Name <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.function_name || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Priority <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px] capitalize">
                    {formData.priority || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Service Provider <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.service_provider || "—"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Template Name <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.template_name || "—"}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    DLT Template ID <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-mono text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[40px]">
                    {formData.dlt_template_id || "—"}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Template URL <span className="text-red-500 font-bold">*</span>
                  </p>
                  <p className="text-sm font-mono text-slate-800 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100 min-h-[60px] break-all whitespace-pre-wrap">
                    {formData.template_url || "—"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className={`space-y-2 transition-all duration-300 ${formData.is_default ? "opacity-30 pointer-events-none grayscale-[0.5]" : ""}`}>
                  <EnhancedSelect
                    label={
                      <span>
                        Organization <span className="text-red-500">*</span>
                      </span>
                    }
                    value={formData.is_default ? "" : formData.organization_id}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        organization_id: val.toString(),
                      }))
                    }
                    options={orgOptions}
                    placeholder={
                      formData.is_default
                        ? "Default Template (No Org)"
                        : isLoadingOrgs
                          ? "Loading organizations..."
                          : "Select Organization"
                    }
                    disabled={isLoadingOrgs || formData.is_default}
                    searchable={true}
                    className="w-full"
                    sx={{ backgroundColor: "#F8FAF8" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="module_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Module Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="module_name"
                    name="module_name"
                    placeholder="e.g. Gatekeeper"
                    value={formData.module_name}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="function_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Function Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="function_name"
                    name="function_name"
                    placeholder="e.g. Create"
                    value={formData.function_name}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <EnhancedSelect
                    label={
                      <span>
                        Priority <span className="text-red-500">*</span>
                      </span>
                    }
                    value={formData.priority}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: val.toString(),
                      }))
                    }
                    options={[
                      { value: "primary", label: "Primary" },
                      { value: "secondary", label: "Secondary" },
                    ]}
                    placeholder="Select Priority"
                    searchable={true}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="service_provider"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Service Provider <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="service_provider"
                    name="service_provider"
                    placeholder="e.g. Immence"
                    value={formData.service_provider}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="template_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Template Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="template_name"
                    name="template_name"
                    placeholder="e.g. Global Visitor OTP"
                    value={formData.template_name}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label
                    htmlFor="dlt_template_id"
                    className="text-sm font-semibold text-slate-700"
                  >
                    DLT Template ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dlt_template_id"
                    name="dlt_template_id"
                    placeholder="e.g. 1407161234567890123"
                    value={formData.dlt_template_id}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus:ring-[#C72030] rounded-md transition-all"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label
                    htmlFor="template_url"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Template URL <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="template_url"
                    name="template_url"
                    placeholder="e.g. http://api.provider.com/send?user={#u#}&pass={#p#}&msg={#m#}"
                    value={formData.template_url}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-slate-200 focus:ring-[#C72030] rounded-md transition-all resize-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Use {"{#var#}"} for dynamic variables.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-6 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="px-6 h-11 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 h-11 bg-[#C72030] hover:bg-[#a81c29] text-white font-bold rounded-lg shadow-lg shadow-red-100 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingId ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>{editingId ? "Save Changes" : "Create Template"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { SmsManagementPage };
