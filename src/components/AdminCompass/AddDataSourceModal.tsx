import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { T, inputStyle } from "@/components/AdminCompass/ruleEngineTheme";

/** Payload shape expected by POST /datasources.json */
export interface DataSourcePayload {
  datasource_name: string;
  connecter: string;
  /** "internal" | "external" — see DATASOURCE_TYPES. */
  type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
  active: boolean;
  project_code: string;
}

type FormState = Omit<DataSourcePayload, "port"> & { port: string };

const EMPTY_FORM: FormState = {
  datasource_name: "",
  connecter: "mysql",
  type: "external",
  host: "",
  port: "",
  database_name: "",
  username: "",
  password: "",
  active: true,
  project_code: "",
};

const CONNECTERS = [
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
];

/**
 * Labels are title-case for the UI; the values are what the API stores and what
 * RuleEngine::AvailableModel::TYPES validates against, so they stay lowercase.
 * This value rides along into the pull_schema payload's "type" — every model
 * catalogued from this source is tagged with it.
 */
export const DATASOURCE_TYPES = [
  { value: "external", label: "External" },
  { value: "internal", label: "Internal" },
];

interface ProjectOption {
  /** Unique select value — titles and codes both repeat in the response. */
  key: string;
  /** Display text; carries the code too when a title maps to several. */
  label: string;
  /** Raw project title — submitted as datasource_name. */
  title: string;
  code: string;
}

/** Existing record fields needed to prefill the form in edit mode. */
export interface EditableDataSource {
  id: number;
  datasource_name?: string | null;
  connecter?: string | null;
  type?: string | null;
  host?: string | null;
  port?: number | string | null;
  database_name?: string | null;
  username?: string | null;
  active?: boolean | null;
  project_code?: string | null;
}

interface AddDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful create or update. */
  onSaved?: () => void;
  /** Pass a record to edit it; omit to create a new one. */
  dataSource?: EditableDataSource | null;
}

const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium" style={{ color: T.textMain }}>
      {label}
      {required && <span style={{ color: T.primary }}> *</span>}
    </label>
    {children}
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export const AddDataSourceModal = ({
  open,
  onOpenChange,
  onSaved,
  dataSource,
}: AddDataSourceModalProps) => {
  const isEdit = Boolean(dataSource?.id);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Reset (or prefill) whenever the modal is reopened so a previous attempt
  // never leaks in. Password is never prefilled — the API returns it masked.
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setShowPassword(false);
    setForm(
      dataSource
        ? {
            datasource_name: dataSource.datasource_name ?? "",
            connecter: dataSource.connecter ?? "mysql",
            // Records created before this field existed come back with no type;
            // they are external connections, which is the default here too.
            type: dataSource.type || "external",
            host: dataSource.host ?? "",
            port:
              dataSource.port === null || dataSource.port === undefined
                ? ""
                : String(dataSource.port),
            database_name: dataSource.database_name ?? "",
            username: dataSource.username ?? "",
            password: "",
            active: dataSource.active ?? true,
            project_code: dataSource.project_code ?? "",
          }
        : EMPTY_FORM
    );
  }, [open, dataSource]);

  // Projects come from GET /datasources/project_codes.json. Loaded on open (not
  // on mount) so a modal that is never opened costs nothing.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const response = await fetch(
          getFullUrl("/datasources/project_codes.json"),
          {
            headers: {
              Authorization: getAuthHeader(),
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Could not load projects (${response.status})`);
        }

        const body = await response.json();
        const list: any[] = Array.isArray(body) ? body : (body?.data ?? []);
        if (cancelled) return;

        // Rows repeat: the same title can appear several times, sometimes with
        // the same code (pure duplicates) and sometimes with different codes
        // (e.g. "Vantage Tower A" maps to both IT-VT1TA and IT-VT1TK). So
        // collapse exact title+code pairs, then append the code to any title
        // still mapping to more than one code — without that, those rows are
        // indistinguishable in the list.
        const codesPerTitle = new Map<string, Set<string>>();
        for (const item of list) {
          const title = String(item?.title ?? "").trim();
          const code = String(item?.project_code ?? "").trim();
          if (!title || !code) continue;
          if (!codesPerTitle.has(title)) codesPerTitle.set(title, new Set());
          codesPerTitle.get(title)?.add(code);
        }

        const seen = new Set<string>();
        const options: ProjectOption[] = [];
        for (const item of list) {
          const title = String(item?.title ?? "").trim();
          const code = String(item?.project_code ?? "").trim();
          if (!title || !code) continue;

          const pairKey = `${title}||${code}`;
          if (seen.has(pairKey)) continue;
          seen.add(pairKey);

          const ambiguous = (codesPerTitle.get(title)?.size ?? 0) > 1;
          options.push({
            key: pairKey,
            label: ambiguous ? `${title} (${code})` : title,
            title,
            code,
          });
        }

        options.sort((a, b) => a.label.localeCompare(b.label));
        setProjects(options);
      } catch (error: any) {
        if (!cancelled) {
          setProjectsError(error?.message || "Could not load projects");
        }
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Derived from the saved code so edit mode preselects itself once the options
  // arrive, with no extra state to keep in sync.
  const selectedProjectKey = useMemo(() => {
    if (!form.project_code) return "";
    return projects.find((p) => p.code === form.project_code)?.key ?? "";
  }, [projects, form.project_code]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.connecter.trim()) next.connecter = "Connecter is required";
    if (!form.host.trim()) next.host = "Host is required";
    if (!form.database_name.trim())
      next.database_name = "Database name is required";
    if (!form.username.trim()) next.username = "Username is required";
    if (!isEdit && !form.password) next.password = "Password is required";
    // One selection fills both datasource_name and project_code, so a missing
    // either way is reported on that single field.
    if (!form.project_code.trim() || !form.datasource_name.trim())
      next.project_code = "Data source name is required";

    const port = Number(form.port);
    if (!form.port.trim()) {
      next.port = "Port is required";
    } else if (!Number.isInteger(port) || port < 1 || port > 65535) {
      next.port = "Enter a port between 1 and 65535";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: Partial<DataSourcePayload> = {
      datasource_name: form.datasource_name.trim(),
      connecter: form.connecter.trim(),
      type: form.type,
      host: form.host.trim(),
      port: Number(form.port),
      database_name: form.database_name.trim(),
      username: form.username.trim(),
      active: form.active,
      project_code: form.project_code.trim(),
    };

    // On edit an untouched password field means "keep the current one", so the
    // key is omitted rather than sent blank.
    if (!isEdit || form.password) {
      payload.password = form.password;
    }

    setSubmitting(true);
    try {
      const endpoint = isEdit
        ? `/datasources/${dataSource!.id}.json`
        : "/datasources.json";

      const response = await fetch(getFullUrl(endpoint), {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ datasource: payload }),
      });

      if (!response.ok) {
        // Surface the server's own message when it sends one.
        let message = `Failed to ${isEdit ? "update" : "create"} data source (${response.status})`;
        try {
          const errorBody = await response.json();
          const detail =
            errorBody?.message ||
            errorBody?.error ||
            (Array.isArray(errorBody?.errors)
              ? errorBody.errors.join(", ")
              : null);
          if (detail) message = detail;
        } catch {
          // Response was not JSON — keep the status-based message.
        }
        throw new Error(message);
      }

      await response.json().catch(() => null);
      toast.success(isEdit ? "Data source updated" : "Data source created");
      onSaved?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.message ||
          `Failed to ${isEdit ? "update" : "create"} data source`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        style={{ fontFamily: T.font }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: T.textMain }}>
            {isEdit ? "Edit Data Source" : "New Data Source"}
          </DialogTitle>
          <DialogDescription style={{ color: T.textMuted }}>
            {isEdit
              ? "Update this connection. Leave the password blank to keep the current one."
              : "Pick a data source and give the rule engine its connection details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Data Source Name"
              required
              error={errors.project_code || projectsError || undefined}
            >
              <select
                autoFocus
                value={selectedProjectKey}
                onChange={(e) => {
                  const picked = projects.find((x) => x.key === e.target.value);
                  // One pick drives both submitted values: the project title
                  // becomes datasource_name, its code becomes project_code.
                  // The code is never surfaced in the UI — it only rides along
                  // in the POST/PUT payload.
                  setField("datasource_name", picked?.title ?? "");
                  setField("project_code", picked?.code ?? "");
                }}
                disabled={projectsLoading}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30 disabled:opacity-60"
                style={inputStyle}
              >
                <option value="">
                  {projectsLoading
                    ? "Loading data sources..."
                    : projects.length === 0
                      ? "No data sources available"
                      : "Select data source"}
                </option>
                {projects.map((project) => (
                  <option key={project.key} value={project.key}>
                    {project.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Connecter" required error={errors.connecter}>
            <select
              value={form.connecter}
              onChange={(e) => setField("connecter", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
              style={inputStyle}
            >
              {CONNECTERS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Type" required error={errors.type}>
            <select
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
              style={inputStyle}
            >
              {DATASOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Host" required error={errors.host}>
            <input
              value={form.host}
              onChange={(e) => setField("host", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
              style={inputStyle}
            />
          </Field>

          <Field label="Port" required error={errors.port}>
            <input
              type="number"
              min={1}
              max={65535}
              value={form.port}
              onChange={(e) => setField("port", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
              style={inputStyle}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Database name" required error={errors.database_name}>
              <input
                value={form.database_name}
                onChange={(e) => setField("database_name", e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Username" required error={errors.username}>
            <input
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              autoComplete="off"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
              style={inputStyle}
            />
          </Field>

          <Field label="Password" required={!isEdit} error={errors.password}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#DA7756]/30"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ color: T.textMuted }}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>
        </div>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
            style={{ borderColor: T.primaryBord, color: T.textMuted }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
            style={{ background: T.primary }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.background = T.primaryHov;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.primary;
            }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting
              ? "Saving..."
              : isEdit
                ? "Update Data Source"
                : "Save Data Source"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataSourceModal;
