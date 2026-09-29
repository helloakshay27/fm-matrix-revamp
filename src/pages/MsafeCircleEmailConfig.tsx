import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

interface ClusterOption {
  id: string;
  name: string;
}

interface CircleEmailConfig {
  id: number | string;
  cluster_id: number | string;
  email_id: string;
  active: boolean;
  created_at?: string;
}

const columns: ColumnConfig[] = [
  { key: "circle", label: "Circle", sortable: true, draggable: true, defaultVisible: true },
  { key: "email_id", label: "Email ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "active", label: "Active", sortable: true, draggable: true, defaultVisible: true },
  { key: "created_at", label: "Created At", sortable: true, draggable: true, defaultVisible: true },
];

const getApiRoot = () => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const host = baseUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return host ? `https://${host}` : "";
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication is required. Please sign in again.");
  return { Authorization: `Bearer ${token}` };
};

const unwrapConfigs = (data: unknown): CircleEmailConfig[] => {
  if (Array.isArray(data)) return data as CircleEmailConfig[];
  if (!data || typeof data !== "object") return [];
  const response = data as Record<string, unknown>;
  const records = response.smt_cluster_email_configs ?? response.data;
  return Array.isArray(records) ? records as CircleEmailConfig[] : [];
};

const unwrapClusters = (data: unknown): ClusterOption[] => {
  if (!data || typeof data !== "object") return [];
  const response = data as Record<string, unknown>;
  const records = response.clusters ?? response.data;
  if (!Array.isArray(records)) return [];
  return records
    .map((value: unknown) => {
      if (!value || typeof value !== "object") return { id: "", name: "" };
      const cluster = value as Record<string, unknown>;
      const companyCluster = cluster.company_cluster;
      const nestedId = companyCluster && typeof companyCluster === "object"
        ? (companyCluster as Record<string, unknown>).id
        : undefined;
      return {
        id: String(cluster.company_cluster_id ?? cluster.id ?? nestedId ?? ""),
        name: String(cluster.cluster_name ?? cluster.name ?? cluster.label ?? ""),
      };
    })
    .filter((cluster: ClusterOption) => cluster.id && cluster.name);
};

export default function MsafeCircleEmailConfig() {
  const { shouldShow } = useDynamicPermissions();
  const [configs, setConfigs] = useState<CircleEmailConfig[]>([]);
  const [clusters, setClusters] = useState<ClusterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CircleEmailConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CircleEmailConfig | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [clusterId, setClusterId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [active, setActive] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const apiRoot = getApiRoot();
  const companyId = localStorage.getItem("selectedCompanyId") || "";

  const fetchData = useCallback(async () => {
    if (!apiRoot) {
      toast.error("API host is not configured");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [configResponse, clusterResponse] = await Promise.all([
        axios.get(`${apiRoot}/smt_cluster_email_configs.json`, { headers }),
        axios.get(`${apiRoot}/pms/users/get_clusters.json`, {
          headers,
          params: companyId ? { company_id: companyId } : undefined,
        }),
      ]);
      setConfigs(unwrapConfigs(configResponse.data));
      setClusters(unwrapClusters(clusterResponse.data));
    } catch (error) {
      console.error("Failed to load circle email configs:", error);
      toast.error("Failed to load circle email configurations");
    } finally {
      setLoading(false);
    }
  }, [apiRoot, companyId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const clusterNames = useMemo(
    () => new Map(clusters.map((cluster) => [cluster.id, cluster.name])),
    [clusters]
  );

  const rows = useMemo(
    () => configs
      .map((config) => ({
        ...config,
        circle: clusterNames.get(String(config.cluster_id)) || String(config.cluster_id),
      })),
    [configs, clusterNames]
  );

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingConfig(null);
    setClusterId("");
    setEmailId("");
    setActive(true);
  };

  const openCreateDialog = () => {
    setEditingConfig(null);
    setClusterId("");
    setEmailId("");
    setActive(true);
    setDialogOpen(true);
  };

  const openEditDialog = (config: CircleEmailConfig) => {
    setEditingConfig(config);
    setClusterId(String(config.cluster_id));
    setEmailId(config.email_id);
    setActive(config.active);
    setDialogOpen(true);
  };

  const submitConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clusterId || !emailId.trim()) {
      toast.error("Select a circle and enter an email ID");
      return;
    }
    setSaving(true);
    try {
      const headers = getAuthHeaders();
      const payload = {
        smt_cluster_email_config: {
          cluster_id: Number.isNaN(Number(clusterId)) ? clusterId : Number(clusterId),
          email_id: emailId.trim(),
          active,
        },
      };
      if (editingConfig) {
        await axios.put(
          `${apiRoot}/smt_cluster_email_configs/${editingConfig.id}.json`,
          payload,
          { headers }
        );
        toast.success("Circle email config updated");
      } else {
        await axios.post(`${apiRoot}/smt_cluster_email_configs.json`, payload, { headers });
        toast.success("Circle email config created");
      }
      resetDialog();
      await fetchData();
    } catch (error) {
      console.error("Failed to save circle email config:", error);
      toast.error("Failed to save circle email configuration");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (config: CircleEmailConfig) => {
    const id = String(config.id);
    if (updatingIds.has(id)) return;
    setUpdatingIds((previous) => new Set(previous).add(id));
    try {
      await axios.put(
        `${apiRoot}/smt_cluster_email_configs/${config.id}.json`,
        { smt_cluster_email_config: { active: !config.active } },
        { headers: getAuthHeaders() }
      );
      setConfigs((previous) => previous.map((item) =>
        item.id === config.id ? { ...item, active: !item.active } : item
      ));
      toast.success(`Configuration ${config.active ? "deactivated" : "activated"}`);
    } catch (error) {
      console.error("Failed to update config status:", error);
      toast.error("Failed to update active status");
    } finally {
      setUpdatingIds((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
  };

  const deleteConfig = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`${apiRoot}/smt_cluster_email_configs/${deleteTarget.id}.json`, {
        headers: getAuthHeaders(),
      });
      setConfigs((previous) => previous.filter((item) => item.id !== deleteTarget.id));
      toast.success("Circle email config deleted");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete circle email config:", error);
      toast.error("Failed to delete circle email configuration");
    } finally {
      setDeleting(false);
    }
  };

  const renderCell = (config: CircleEmailConfig & { circle: string }, columnKey: string) => {
    if (columnKey === "active") {
      return (
        <Switch
          checked={Boolean(config.active)}
          onCheckedChange={() => void toggleActive(config)}
          disabled={updatingIds.has(String(config.id))}
          aria-label={`${config.active ? "Deactivate" : "Activate"} ${config.email_id}`}
        />
      );
    }
    if (columnKey === "created_at") {
      return config.created_at ? new Date(config.created_at).toLocaleString() : "-";
    }
    return config[columnKey as keyof typeof config] ?? "-";
  };

  const renderActions = (config: CircleEmailConfig) => (
    <div className="flex items-center gap-1">
      {shouldShow("M Safe", "update") && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Edit configuration"
          aria-label="Edit configuration"
          onClick={() => openEditDialog(config)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {shouldShow("M Safe", "destroy") && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Delete configuration"
          aria-label="Delete configuration"
          onClick={() => setDeleteTarget(config)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const leftActions = shouldShow("M Safe", "create") ? (
    <Button
      onClick={openCreateDialog}
      className="bg-brand text-white hover:bg-brand-hover"
    >
      <Plus className="mr-2 h-4 w-4" /> Add
    </Button>
  ) : null;

  return (
    <div className="p-6">
      <EnhancedTable
        data={rows}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="msafe-circle-email-config-table"
        loading={loading}
        enableSearch
        searchPlaceholder="Search circle or email ID..."
        emptyMessage="No circle email configurations found"
      />

      <Dialog open={dialogOpen} onClose={resetDialog} maxWidth="sm" fullWidth>
        <DialogContent>
          <h1 className="mb-6 mt-2 text-xl font-semibold">
            {editingConfig ? "Edit Circle Email Config" : "Add Circle Email Config"}
          </h1>
          <form onSubmit={submitConfig} className="space-y-4">
            <FormControl fullWidth required>
              <InputLabel id="config-cluster-label">Circle</InputLabel>
              <Select
                labelId="config-cluster-label"
                value={clusterId}
                label="Circle"
                onChange={(event) => setClusterId(String(event.target.value))}
                sx={fieldStyles}
              >
                {clusters.map((cluster) => (
                  <MenuItem key={cluster.id} value={cluster.id}>{cluster.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Email ID"
              type="email"
              value={emailId}
              onChange={(event) => setEmailId(event.target.value)}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <div className="flex items-center justify-between rounded border px-3 py-2">
              <span className="text-sm font-medium">Active</span>
              <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="submit"
                variant="outline"
                className="fm-button-fix fm-button-brand w-full"
                disabled={saving}
              >
                {saving ? "Saving..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <h2 className="mb-2 mt-1 text-lg font-semibold text-gray-900">
            Delete Circle Email Config?
          </h2>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the configuration for{" "}
            <span className="font-medium text-gray-900">{deleteTarget?.email_id}</span>?
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void deleteConfig()}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}