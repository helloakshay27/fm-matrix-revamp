import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Database,
  Plug,
  Loader2,
  RefreshCw,
  Zap,
  Pencil,
  Trash2,
  Eye,
  Table2,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddDataSourceModal from "@/components/AdminCompass/AddDataSourceModal";
import DataSourceConfigurationTab from "@/components/AdminCompass/DataSourceConfigurationTab";
import DataSourceDetailsSheet from "@/components/AdminCompass/DataSourceDetailsSheet";
import ConfigureActionTab from "@/components/AdminCompass/ConfigureActionTab";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { T, inputStyle } from "@/components/AdminCompass/ruleEngineTheme";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";

/**
 * The fields this screen renders, plus the connection fields the edit form
 * needs to prefill. The API returns more than this.
 */
export interface DataSource {
  id: number;
  datasource_name: string | null;
  connecter: string | null;
  active: boolean;
  project_code: string | null;
  created_by_name: string | null;
  created_at: string | null;
  // Not shown in the table — prefill only.
  host: string | null;
  port: number | null;
  database_name: string | null;
  username: string | null;
  /**
   * "internal" | "external". Set on the data source form and fed straight into
   * the pull_schema payload's "type" by the Configuration tab. Records created
   * before the field existed come back null and are treated as external.
   */
  type: string | null;
}

const cardStyle = {
  background: T.cardBg,
  borderColor: T.primaryBord,
  boxShadow: "0 10px 24px rgba(26,26,26,0.05)",
};

/**
 * EnhancedTable columns. "Actions" yahan nahi hai — wo column EnhancedTable
 * khud renderActions se banata hai.
 */
const COLUMNS: ColumnConfig[] = [
  { key: "datasource_name", label: "Data Source Name", sortable: true, defaultVisible: true, hideable: true },
  { key: "connecter", label: "Connecter", sortable: true, defaultVisible: true, hideable: true },
  { key: "type", label: "Type", sortable: true, defaultVisible: true, hideable: true },
  { key: "active", label: "Status", sortable: true, defaultVisible: true, hideable: true },
  { key: "project_code", label: "Project Code", sortable: true, defaultVisible: true, hideable: true },
  { key: "created_by_name", label: "Created By", sortable: true, defaultVisible: true, hideable: true },
  { key: "created_at", label: "Created At", sortable: true, defaultVisible: true, hideable: true },
  { key: "test_connection", label: "Test Connection", defaultVisible: true, hideable: true },
];

const TABS = [
  { key: "sources", label: "Data Source", icon: Server },
  { key: "configuration", label: "Configuration", icon: Table2 },
  // What a rule can DO, as opposed to what it can read.
  { key: "actions", label: "Configure Action", icon: Zap },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const dash = (value: string | null | undefined) => {
  const text = (value ?? "").toString().trim();
  return text.length > 0 ? text : "-";
};

/** "2026-08-24T15:02:40.692+05:30" -> "24 Aug 2026, 3:02 pm" */
const formatCreatedAt = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const RuleEngineDataSource = () => {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("sources");
  const [editing, setEditing] = useState<DataSource | null>(null);
  // Read-only detail view: which data source's structure is on screen.
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DataSource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getFullUrl("/datasources.json"), {
        headers: {
          Authorization: getAuthHeader(),
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load data sources (${response.status})`);
      }

      // The endpoint returns a bare array; the fallbacks guard against it
      // being wrapped in future.
      const body = await response.json();
      const list: any[] = Array.isArray(body)
        ? body
        : (body?.datasources ?? body?.data ?? []);

      setSources(
        list.map((item: any) => ({
          id: item?.id,
          datasource_name: item?.datasource_name ?? null,
          connecter: item?.connecter ?? null,
          active: Boolean(item?.active),
          project_code: item?.project_code ?? null,
          created_by_name: item?.created_by_name ?? null,
          created_at: item?.created_at ?? null,
          host: item?.host ?? null,
          port: item?.port ?? null,
          database_name: item?.database_name ?? null,
          username: item?.username ?? null,
          type: item?.type ?? null,
        }))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load data sources");
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  // GET /datasources/:id/test_connection.json — the body carries its own
  // success flag, so a 200 with success:false is still reported as a failure.
  const testConnection = async (id: number) => {
    setTestingId(id);
    try {
      const response = await fetch(
        getFullUrl(`/datasources/${id}/test_connection.json`),
        {
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      const body = await response.json().catch(() => null);

      if (response.ok && body?.success) {
        // Built locally rather than using body.message, which names the actual
        // database ("Connected to staging_database - ...").
        const count = body?.table_count;
        toast.success(
          typeof count === "number"
            ? `Connected to datasource - ${count} table(s) found.`
            : "Connected to datasource."
        );
      } else {
        toast.error(
          body?.message ||
            body?.error ||
            `Connection test failed (${response.status})`
        );
      }
    } catch (e: any) {
      toast.error(e?.message || "Connection test failed");
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(
        getFullUrl(`/datasources/${pendingDelete.id}.json`),
        {
          method: "DELETE",
          headers: {
            Authorization: getAuthHeader(),
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        let message = `Failed to delete data source (${response.status})`;
        try {
          const body = await response.json();
          if (body?.message || body?.error)
            message = body.message || body.error;
        } catch {
          // Not JSON — keep the status-based message.
        }
        throw new Error(message);
      }

      toast.success("Data source deleted");
      setPendingDelete(null);
      loadSources();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete data source");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return sources;
    return sources.filter((s) =>
      [s.datasource_name, s.connecter, s.project_code, s.created_by_name].some(
        (f) => (f ?? "").toLowerCase().includes(q)
      )
    );
  }, [sources, searchTerm]);

  // Cells wahi hain jo pehle raw <table> me the — sirf ab EnhancedTable ke
  // renderCell contract se aate hain.
  const renderCell = (source: DataSource, columnKey: string) => {
    switch (columnKey) {
      case "datasource_name":
        return (
          <span
            className="break-words text-sm font-medium"
            style={{ color: T.textMain }}
          >
            {dash(source.datasource_name)}
          </span>
        );
      case "connecter":
        return (
          <span className="break-words text-sm" style={{ color: T.textMuted }}>
            {dash(source.connecter)}
          </span>
        );
      case "type":
        // Legacy rows predate the field — they are external.
        return (
          <span
            className="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium capitalize"
            style={{ background: T.primaryBg, color: T.primary }}
          >
            {source.type || "external"}
          </span>
        );
      case "active":
        return (
          <span
            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              source.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {source.active ? "Active" : "Inactive"}
          </span>
        );
      case "project_code":
        return (
          <span className="break-words text-sm" style={{ color: T.textMuted }}>
            {dash(source.project_code)}
          </span>
        );
      case "created_by_name":
        return (
          <span className="break-words text-sm" style={{ color: T.textMuted }}>
            {dash(source.created_by_name)}
          </span>
        );
      case "created_at":
        return (
          <span className="text-sm" style={{ color: T.textMuted }}>
            {formatCreatedAt(source.created_at)}
          </span>
        );
      case "test_connection":
        return (
          <button
            onClick={() => testConnection(source.id)}
            disabled={testingId === source.id}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60"
            style={{ borderColor: T.primary, color: T.primary }}
            title="Test connection"
          >
            {testingId === source.id ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Test Connection
              </>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  const newDataSourceButton = (
    <button
      onClick={() => {
        setEditing(null);
        setIsAddOpen(true);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors sm:w-fit"
      style={{ background: T.primary }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = T.primaryHov;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = T.primary;
      }}
    >
      <Plus className="h-4 w-4" />
      New Data Source
    </button>
  );

  const searchInput = (
    <div className="relative w-full sm:w-64">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: T.textMuted }}
      />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search data sources..."
        className="w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
        style={inputStyle}
      />
    </div>
  );

  const refreshButton = (
    <button
      onClick={loadSources}
      disabled={loading}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors disabled:opacity-60"
      style={{ borderColor: T.primary, color: T.primary }}
      title="Refresh"
      aria-label="Refresh data sources"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
    </button>
  );

  const renderActions = (source: DataSource) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setViewingId(source.id)}
        className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
        title="View data source"
        aria-label={`View ${source.datasource_name ?? "data source"}`}
      >
        <Eye className="h-4 w-4" style={{ color: T.textMuted }} />
      </button>
      <button
        onClick={() => {
          setEditing(source);
          setIsAddOpen(true);
        }}
        className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
        title="Edit data source"
        aria-label={`Edit ${source.datasource_name ?? "data source"}`}
      >
        <Pencil className="h-4 w-4" style={{ color: T.textMuted }} />
      </button>
      <button
        onClick={() => setPendingDelete(source)}
        className="rounded-lg p-1.5 transition-colors hover:bg-[#f6f4ee]"
        title="Delete data source"
        aria-label={`Delete ${source.datasource_name ?? "data source"}`}
      >
        <Trash2 className="h-4 w-4" style={{ color: T.primary }} />
      </button>
    </div>
  );

  return (
    <div
      className="min-h-[calc(100vh-5rem)] w-full px-3 py-4 sm:px-6 sm:py-6"
      style={{ background: T.pageBg, fontFamily: T.font }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'); .rule-ds-wrap, .rule-ds-wrap * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="rule-ds-wrap mx-auto max-w-7xl space-y-4">
        {/* Header card */}
        <div
          className="flex flex-col gap-3 rounded-[20px] border p-4 shadow-sm sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between"
          style={cardStyle}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:h-12 sm:w-12"
              style={{ borderColor: T.primaryBord, background: T.primaryBg }}
            >
              <Database
                className="h-5 w-5 sm:h-6 sm:w-6"
                style={{ color: T.primary }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ color: T.textMain }}
              >
                Data Source
              </h1>
              <p
                className="mt-1 text-xs font-normal sm:text-sm"
                style={{ color: T.textMuted }}
              >
                Connect the data your rules read from and act on
              </p>
            </div>
          </div>

          <div
            className="w-full rounded-xl border px-3 py-2 text-center text-xs font-medium sm:w-fit sm:px-4 sm:py-2.5 sm:text-sm"
            style={{
              borderColor: T.primaryBord,
              background: T.primaryBg,
              color: T.textMuted,
            }}
          >
            {sources.length} {sources.length === 1 ? "source" : "sources"}
          </div>
        </div>

        {/* Tabs — same pill pattern as the Rule Engine page */}
        <div
          className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border p-1 sm:w-fit"
          style={{ background: T.pageBg, borderColor: T.primaryBord }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:flex-none sm:text-[13px]"
                style={{
                  background: active ? T.primary : "transparent",
                  color: active ? "#ffffff" : T.textMuted,
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Configuration tab ── */}
        {activeTab === "configuration" && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <DataSourceConfigurationTab
              sources={sources}
              sourcesLoading={loading}
            />
          </div>
        )}

        {/* ── Configure Action tab ── */}
        {activeTab === "actions" && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            <ConfigureActionTab sources={sources} sourcesLoading={loading} />
          </div>
        )}

        {/* ── Data Source tab: toolbar + list ── */}
        {activeTab === "sources" && (
          <div
            className="rounded-[20px] border p-4 shadow-sm sm:p-6"
            style={cardStyle}
          >
            {/* Table dikhne par ye teeno controls EnhancedTable ke header row
                me chale jaate hain (New Data Source left, search + refresh +
                Columns right). Ye toolbar sirf un states ke liye hai jahan
                table render hi nahi hota — warna user na naya source bana
                paata, na search clear kar paata. */}
            {(loading || error || filteredSources.length === 0) && (
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {newDataSourceButton}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  {searchInput}
                  {refreshButton}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: T.primary }}
                />
                <p className="text-xs" style={{ color: T.textMuted }}>
                  Loading data sources...
                </p>
              </div>
            ) : error ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
                style={{ borderColor: T.primaryBord }}
              >
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  onClick={loadSources}
                  className="mt-1 rounded-xl px-4 py-2 text-sm font-medium text-white"
                  style={{ background: T.primary }}
                >
                  Try again
                </button>
              </div>
            ) : filteredSources.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center"
                style={{ borderColor: T.primaryBord }}
              >
                <Plug className="h-8 w-8" style={{ color: T.primaryBord }} />
                <p
                  className="text-sm font-medium"
                  style={{ color: T.textMain }}
                >
                  {sources.length === 0
                    ? "No data sources yet"
                    : "No matching data sources"}
                </p>
                <p className="text-xs" style={{ color: T.textMuted }}>
                  {sources.length === 0
                    ? 'Connect your first source with "New Data Source".'
                    : "Try a different search term."}
                </p>
              </div>
            ) : (
              <EnhancedTable
                data={filteredSources}
                columns={COLUMNS}
                renderCell={renderCell}
                renderActions={renderActions}
                getItemId={(source) => String(source.id)}
                storageKey="rule-engine-data-sources"
                emptyMessage="No data sources found"
                pagination
                pageSize={10}
                hideTableSearch
                hideTableExport
                leftActions={newDataSourceButton}
                rightActions={
                  <div className="flex items-center gap-2">
                    {searchInput}
                    {refreshButton}
                  </div>
                }
              />
            )}
          </div>
        )}
      </div>

      <AddDataSourceModal
        open={isAddOpen}
        onOpenChange={(next) => {
          setIsAddOpen(next);
          if (!next) setEditing(null);
        }}
        onSaved={loadSources}
        dataSource={editing}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(next) => {
          if (!next && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent style={{ fontFamily: T.font }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete data source?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.datasource_name
                ? `"${pendingDelete.datasource_name}" will be removed permanently. Rules using it will stop resolving.`
                : "This data source will be removed permanently. Rules using it will stop resolving."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              style={{ background: T.primary }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataSourceDetailsSheet
        datasourceId={viewingId}
        onClose={() => setViewingId(null)}
      />
    </div>
  );
};

export default RuleEngineDataSource;
