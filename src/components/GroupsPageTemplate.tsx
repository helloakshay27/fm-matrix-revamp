import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload, X, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { SelectionPanel } from "./water-asset-details/PannelTab";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  GroupsFilterDialog,
  type GroupsFilters,
} from "@/components/GroupsFilterDialog";
import { TableCell, TableRow } from "@/components/ui/table";

interface SubGroupRow {
  id: number;
  groupId: number;
  groupName: string;
  subGroupName: string;
  status: boolean;
}

interface GroupRow {
  id: number;
  srNo: number;
  groupName: string;
  status: boolean;
  children: SubGroupRow[];
}

interface GroupsPageTemplateProps {
  title: string;
  breadcrumb: string;
  apiEndpoint: string;
  subGroupApiEndpoint: string;
  groupType: string;
  importApiEndpoint?: string;
  downloadSampleUrl?: string;
  permissionKey?: string;
}

const columns: ColumnConfig[] = [
  { key: "srNo", label: "Sr.No", sortable: true, defaultVisible: true },
  {
    key: "groupName",
    label: "Group Name",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "subGroupName",
    label: "Sub Group Name",
    sortable: false,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

const emptyFilters: GroupsFilters = {
  groupName: "",
  subGroupName: "",
  status: "",
};

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export const GroupsPageTemplate = ({
  title,
  breadcrumb,
  apiEndpoint,
  subGroupApiEndpoint,
  groupType,
  importApiEndpoint,
  downloadSampleUrl,
  permissionKey = "Asset Group & Sub Group",
}: GroupsPageTemplateProps) => {
  const { shouldShow } = useDynamicPermissions();
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addSubGroupOpen, setAddSubGroupOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [subGroupName, setSubGroupName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [groupLoading, setGroupLoading] = useState(false);
  const [subGroupLoading, setSubGroupLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<GroupsFilters>(emptyFilters);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGroupsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiEndpoint}?type=${groupType}`);

      if (response.data && Array.isArray(response.data)) {
        const transformedGroups: GroupRow[] = response.data.map(
          (group: any, index: number) => ({
            id: group.id,
            srNo: index + 1,
            groupName: group.name,
            status: group.status === "active",
            children: Array.isArray(group.sub_groups)
              ? group.sub_groups.map((subGroup: any) => ({
                  id: subGroup.id,
                  groupId: group.id,
                  groupName: group.name,
                  subGroupName: subGroup.name,
                  status: subGroup.status === "active",
                }))
              : [],
          })
        );

        setGroups(transformedGroups);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, [apiEndpoint, groupType]);

  const toggleGroupStatus = async (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (!group) return;

    const newStatus = !group.status;
    const statusString = newStatus ? "active" : "inactive";

    try {
      const updateUrl = apiEndpoint.replace(".json", `/${id}.json`);
      await apiClient.put(updateUrl, {
        pms_asset_group: { status: statusString },
      });

      setGroups((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
      );
      toast.success(
        `Group ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating group status:", error);
      toast.error("Failed to update group status");
    }
  };

  const toggleSubGroupStatus = async (id: number, groupId: number) => {
    const group = groups.find((g) => g.id === groupId);
    const subGroup = group?.children.find((sg) => sg.id === id);
    if (!subGroup) return;

    const newStatus = !subGroup.status;
    const statusString = newStatus ? "active" : "inactive";

    try {
      const updateUrl = subGroupApiEndpoint.replace(".json", `/${id}.json`);
      await apiClient.put(updateUrl, {
        pms_asset_sub_group: { status: statusString },
      });

      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                children: g.children.map((sg) =>
                  sg.id === id ? { ...sg, status: newStatus } : sg
                ),
              }
            : g
        )
      );
      toast.success(
        `Sub group ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating subgroup status:", error);
      toast.error("Failed to update subgroup status");
    }
  };

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setGroupLoading(true);
    try {
      const response = await apiClient.post("/pms/asset_groups.json", {
        pms_asset_group: {
          name: groupName.trim(),
          group_type: groupType,
        },
      });

      if (response.data) {
        await fetchGroupsData();
        setGroupName("");
        setAddGroupOpen(false);
        toast.success("Group created successfully");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setGroupLoading(false);
    }
  };

  const handleAddSubGroup = async () => {
    if (!selectedGroupId) {
      toast.error("Please select a group");
      return;
    }

    if (!subGroupName.trim()) {
      toast.error("Please enter a sub group name");
      return;
    }

    setSubGroupLoading(true);
    try {
      const params = new URLSearchParams({
        "pms_asset_sub_group[name]": subGroupName.trim(),
        "pms_asset_sub_group[group_id]": selectedGroupId.toString(),
      });

      const response = await apiClient.post(
        `/pms/asset_sub_groups.json?${params.toString()}`
      );

      if (response.data) {
        await fetchGroupsData();
        setSelectedGroupId("");
        setSubGroupName("");
        setAddSubGroupOpen(false);
        toast.success("Sub group created successfully");
      }
    } catch (error) {
      console.error("Error creating sub group:", error);
      toast.error("Failed to create sub group");
    } finally {
      setSubGroupLoading(false);
    }
  };

  const handleDownloadSample = async () => {
    if (!downloadSampleUrl) {
      toast.error("Download URL is not configured.");
      return;
    }
    try {
      const response = await apiClient.get(downloadSampleUrl, {
        responseType: "blob",
      });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadSampleUrl.split("/").pop() || "sample.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Sample format downloaded successfully");
    } catch (error) {
      console.error("Error downloading sample file:", error);
      toast.error("Failed to download sample file.");
    }
  };

  const handleBulkUpload = async (file?: File) => {
    const fileToUpload = file || selectedFile;
    if (!fileToUpload) {
      toast.error("Please select a file to upload");
      return;
    }

    const endpoint = importApiEndpoint || "/pms/assets/subgroup_import.json";
    const fileKey = importApiEndpoint ? "file" : "asset_group_file";

    setBulkUploadLoading(true);
    try {
      const uploadFile = new FormData();
      uploadFile.append(fileKey, fileToUpload);

      const response = await apiClient.post(endpoint, uploadFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        await fetchGroupsData();
        setSelectedFile(null);
        setBulkUploadOpen(false);
        toast.success("Bulk upload completed successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return groups
      .map((group) => {
        const groupNameLower = group.groupName.toLowerCase();
        const groupStatus = group.status ? "active" : "inactive";
        const groupMatchesSearch =
          !q ||
          groupNameLower.includes(q) ||
          groupStatus.includes(q);

        let children = group.children;

        if (filters.subGroupName) {
          const subQ = filters.subGroupName.toLowerCase();
          children = children.filter((sg) =>
            sg.subGroupName.toLowerCase().includes(subQ)
          );
        }

        if (filters.status) {
          const statusQ = filters.status.toLowerCase();
          children = children.filter(
            (sg) => (sg.status ? "active" : "inactive") === statusQ
          );
        }

        if (q && !groupMatchesSearch) {
          children = children.filter(
            (sg) =>
              sg.subGroupName.toLowerCase().includes(q) ||
              sg.groupName.toLowerCase().includes(q)
          );
        }

        return { ...group, children, groupMatchesSearch, groupStatus };
      })
      .filter((group) => {
        if (
          filters.groupName &&
          !group.groupName
            .toLowerCase()
            .includes(filters.groupName.toLowerCase())
        ) {
          return false;
        }

        if (filters.subGroupName && group.children.length === 0) {
          return false;
        }

        if (filters.status) {
          const statusQ = filters.status.toLowerCase();
          if (group.groupStatus !== statusQ && group.children.length === 0) {
            return false;
          }
        }

        if (q && !group.groupMatchesSearch && group.children.length === 0) {
          return false;
        }

        return true;
      })
      .map((group, index) => ({
        id: group.id,
        srNo: index + 1,
        groupName: group.groupName,
        status: group.status,
        children: group.children,
      }));
  }, [groups, filters, searchTerm]);

  const renderCell = (item: GroupRow, columnKey: string) => {
    switch (columnKey) {
      case "srNo":
        return item.srNo;
      case "groupName":
        return (
          <span className="font-medium text-gray-900">{item.groupName}</span>
        );
      case "subGroupName":
        return (
          <span className="text-gray-900">
            {item.children.length > 0
              ? `${item.children.length} sub group${item.children.length === 1 ? "" : "s"}`
              : "—"}
          </span>
        );
      case "status":
        return (
          <div
            className="flex justify-start"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={item.status}
              onCheckedChange={() => toggleGroupStatus(item.id)}
            />
          </div>
        );
      default:
        return "—";
    }
  };

  const renderChildrenRows = (children: SubGroupRow[], parentId: string) => {
    return (
      <>
        {children.map((subGroup) => (
          <TableRow
            key={`${parentId}-sub-${subGroup.id}`}
            className="bg-[#faf9f6] hover:bg-[#f5f3ed] border-b border-gray-200"
          >
            <TableCell className="p-4 text-center w-12 min-w-12" />
            <TableCell className="p-4 text-left min-w-32 text-gray-400">
              —
            </TableCell>
            <TableCell className="p-4 text-left min-w-32 pl-8 text-gray-600">
              {subGroup.groupName}
            </TableCell>
            <TableCell className="p-4 text-left min-w-32 font-medium">
              {subGroup.subGroupName}
            </TableCell>
            <TableCell className="p-4 text-left min-w-32">
              <Switch
                checked={subGroup.status}
                onCheckedChange={() =>
                  toggleSubGroupStatus(subGroup.id, subGroup.groupId)
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  const selectionActions = [
    ...(shouldShow(permissionKey, "create")
      ? [
          {
            label: "Add Subgroup",
            icon: Plus,
            onClick: () => setAddSubGroupOpen(true),
          },
        ]
      : []),
    ...(downloadSampleUrl
      ? [
          {
            label: "Download Sample",
            icon: Download,
            onClick: handleDownloadSample,
          },
        ]
      : []),
  ];

  const leftActions = (
    <Button
      onClick={() => setShowActionPanel(true)}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Action
    </Button>
  );

  const filterAdjacentActions = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedFile(file);
            handleBulkUpload(file);
          }
          e.target.value = "";
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className="!rounded-lg border border-brand text-brand hover:bg-brand-selected"
        title={bulkUploadLoading ? "Uploading..." : "Import Excel"}
        disabled={bulkUploadLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4" />
      </Button>
    </>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-1">{breadcrumb}</div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {showActionPanel && (
        <SelectionPanel
          onAdd={() => setAddGroupOpen(true)}
          onImport={() => setBulkUploadOpen(true)}
          actions={selectionActions}
          onClearSelection={() => setShowActionPanel(false)}
          permissionKey={permissionKey}
        />
      )}

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        leftActions={leftActions}
        storageKey={`groups-table-${groupType}`}
        emptyMessage={
          searchTerm || Object.values(filters).some(Boolean)
            ? "No groups found matching your search"
            : "No groups found"
        }
        loading={loading}
        loadingMessage="Loading groups..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        disableClientSearch
        onFilterClick={() => setShowFilters(true)}
        filterAdjacentActions={filterAdjacentActions}
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
        collapsible
        getChildrenKey={() => "children"}
        renderChildrenRows={renderChildrenRows}
      />

      <GroupsFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(emptyFilters)}
      />

      <ThemeProvider theme={theme}>
        <Dialog
          open={addGroupOpen}
          onClose={() => setAddGroupOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <div className="flex items-center justify-between py-2 px-4 border-b">
            <DialogTitle className="text-xl font-bold p-0">
              ADD Group
            </DialogTitle>
            <IconButton onClick={() => setAddGroupOpen(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          <DialogContent className="p-6">
            <div className="space-y-6">
              <TextField
                label="Group Name *"
                placeholder="Enter Group Name"
                variant="outlined"
                fullWidth
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleAddGroup}
                  disabled={groupLoading}
                  className="bg-brand text-white hover:bg-brand-hover px-4 py-2"
                >
                  {groupLoading ? "Creating..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={addSubGroupOpen}
          onClose={() => setAddSubGroupOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <div className="flex items-center justify-between p-4 border-b">
            <DialogTitle className="text-xl font-bold p-0">
              ADD Sub Group
            </DialogTitle>
            <IconButton onClick={() => setAddSubGroupOpen(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          <DialogContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Group Name *</InputLabel>
                <Select
                  value={selectedGroupId}
                  onChange={(e) =>
                    setSelectedGroupId(e.target.value as string)
                  }
                  label="Group Name *"
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: { backgroundColor: "white", zIndex: 9999 },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Group
                  </MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.groupName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Sub Group Name *"
                placeholder="Enter Sub Group Name"
                variant="outlined"
                fullWidth
                value={subGroupName}
                onChange={(e) => setSubGroupName(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="flex justify-end pt-6">
              <Button
                onClick={handleAddSubGroup}
                disabled={subGroupLoading}
                className="bg-brand text-white hover:bg-brand-hover px-8 py-2"
              >
                {subGroupLoading ? "Creating..." : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <div className="flex items-center justify-between p-6 border-b">
            <DialogTitle className="text-xl font-bold p-0">
              Bulk Upload
            </DialogTitle>
            <IconButton onClick={() => setBulkUploadOpen(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          <DialogContent className="p-6">
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-brand rounded-lg p-8 text-center bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-lg text-gray-700">
                    Drag & Drop or{" "}
                    <span className="text-brand font-medium cursor-pointer hover:underline">
                      Choose file
                    </span>
                  </p>
                  <p className="text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                />
              </div>

              {selectedFile && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    File Preview
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Name:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Size:</span>
                      <span className="text-gray-900">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="mt-3 text-brand-error hover:text-brand-error border-brand-error"
                  >
                    Remove File
                  </Button>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleBulkUpload()}
                  disabled={bulkUploadLoading || !selectedFile}
                  className="bg-brand text-white hover:bg-brand-hover px-8 py-2"
                >
                  {bulkUploadLoading ? "Uploading..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};
