import React, { useCallback, useMemo, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAuthHeader } from "@/config/apiConfig";
import { ChevronRight, ChevronDown, User as UserIcon } from "lucide-react";

type TreeNode = {
  id: number;
  name: string;
  email: string;
  children: TreeNode[];
};

// UI constants (stable reference)
const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
} as const;

// Helpers
const isTreeEmpty = (n: any): boolean => {
  if (!n || typeof n !== "object") return true;
  const hasChildren = Array.isArray(n.children) && n.children.length > 0;
  const hasNameOrEmail = Boolean(n.name) || Boolean(n.email);
  return !(hasChildren || hasNameOrEmail);
};

const collectAllIds = (node: TreeNode | null): number[] => {
  if (!node) return [];
  const ids: number[] = [node.id];
  for (const child of node.children || []) ids.push(...collectAllIds(child));
  return ids;
};

const countDescendants = (node: TreeNode | null): number => {
  if (!node) return 0;
  let count = 0;
  for (const child of node.children || []) count += 1 + countDescendants(child);
  return count;
};

const CheckHierarchy: React.FC = () => {
  const [treeIdentifier, setTreeIdentifier] = useState<string>("");
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [employeeType, setEmployeeType] = useState<
    "" | "external" | "internal"
  >("");
  const [submitted, setSubmitted] = useState(false); // show hierarchy only after submit

  const descCount = useMemo(() => countDescendants(treeData), [treeData]);

  // Validation helpers
  const isValidEmail = useCallback((val: string) => {
    const email = val.trim();
    // Basic email regex: something@something.tld
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const isValidMobile = useCallback((val: string) => {
    // Allow spaces/dashes/+ in input, but validate digits count
    const digits = (val || "").replace(/\D/g, "");
    return digits.length === 10; // expecting 10-digit mobile number
  }, []);

  const identifierType: "email" | "mobile" | "empty" = useMemo(() => {
    const raw = (treeIdentifier || "").trim();
    if (!raw) return "empty";
    if (raw.includes("@")) return "email";
    // Consider as mobile only when input consists of digits and common separators, and has at least 1 digit
    const mobileLike = /^[\d\s()+-]+$/.test(raw) && /\d/.test(raw);
    return mobileLike ? "mobile" : "email";
  }, [treeIdentifier]);

  const identifierError = useMemo(() => {
    const raw = (treeIdentifier || "").trim();
    if (!raw) return "";
    if (identifierType === "email") {
      return isValidEmail(raw) ? "" : "Please enter a valid email address.";
    }
    // mobile
    return isValidMobile(raw)
      ? ""
      : "Please enter a valid 10-digit mobile number.";
  }, [treeIdentifier, identifierType, isValidEmail, isValidMobile]);

  const fetchHierarchy = useCallback(async () => {
    const raw = (treeIdentifier || "").trim();
    if (!raw || !employeeType) return;
    setSubmitted(true); // mark that user submitted
    // Block submit if identifier is invalid
    if (identifierError) {
      toast.error(identifierError);
      return;
    }
    try {
      setTreeLoading(true);
      setTreeData(null);
      const tokenHeader = getAuthHeader();
      const baseUrl = localStorage.getItem("baseUrl");
      // Ensure baseUrl has https:// protocol
      const cleanBaseUrl = baseUrl.startsWith("http")
        ? baseUrl
        : `https://${baseUrl}`;
      // As requested: always pass the identifier using the 'email' param (for both email and mobile inputs)
      const url = `${cleanBaseUrl}/pms/users/vi_user_hierarchy.json?email=${encodeURIComponent(
        raw
      )}&employee_type=${employeeType}`;
      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenHeader,
        },
      });
      if (!resp.ok) {
        const t = await resp.text();
        let message = "Failed to fetch hierarchy";
        if (t) {
          try {
            const parsed = JSON.parse(t);
            if (typeof parsed === "string") message = parsed;
            else if (parsed?.message) message = parsed.message;
            else if (parsed?.error) message = parsed.error;
            else if (Array.isArray(parsed?.errors))
              message = parsed.errors.join(", ");
            else if (parsed?.errors && typeof parsed.errors === "string")
              message = parsed.errors;
            else message = t;
          } catch {
            message = t;
          }
          message = message
            .toString()
            .replace(/^{"[a-zA-Z_]+":\s*"(.+)"}$/, "$1")
            .trim();
        }
        // Throw a structured error so we can tailor the user-facing toast message
        throw { status: resp.status, message } as {
          status?: number;
          message?: string;
        };
      }
      const data = await resp.json();
      setTreeData(data as TreeNode);
      try {
        const node = data as TreeNode;
        const rootId = node?.id;
        const firstChildId =
          Array.isArray(node?.children) && node.children.length > 0
            ? node.children[0].id
            : undefined;
        const initial = new Set<number>();
        if (typeof rootId === "number") initial.add(rootId);
        if (typeof firstChildId === "number") initial.add(firstChildId);
        setExpandedNodes(initial);
      } catch {
        /* noop */
      }
      toast.success("Hierarchy fetched");
    } catch (e: any) {
      console.error("Hierarchy fetch error", e);
      // Build a clean, user-friendly message based on the identifier type
      const serverMsg =
        e && (e.message || e.msg)
          ? String(e.message || e.msg)
          : typeof e === "string"
          ? e
          : "";
      const status = e && typeof e.status === "number" ? e.status : undefined;
      const idType = identifierType; // capture current type
      const digits = raw.replace(/\D/g, "");

      let uiMessage = "";
      const looksNotFound =
        /not\s*(present|found)/i.test(serverMsg || "") || status === 404;
      const isAuthError = status === 401 || status === 403;

      if (isAuthError) {
        uiMessage = "You are not authorized to view this hierarchy.";
      } else if (idType === "mobile") {
        // Never show a message that labels the number as an email
        uiMessage = looksNotFound
          ? digits
            ? `User not present with mobile number ${digits}`
            : "No user found for the provided mobile number."
          : (serverMsg || "").replace(/email/gi, "mobile number") ||
            "Failed to fetch hierarchy";
      } else if (idType === "email") {
        uiMessage = looksNotFound
          ? raw
            ? `User not present with email ${raw}`
            : "No user found for the provided email."
          : serverMsg || "Failed to fetch hierarchy";
      } else {
        uiMessage = serverMsg || "Failed to fetch hierarchy";
      }

      toast.error(uiMessage);
    } finally {
      setTreeLoading(false);
    }
  }, [treeIdentifier, employeeType, identifierError, identifierType]);

  const onToggleNode = useCallback((id: number) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (treeData) setExpandedNodes(new Set(collectAllIds(treeData)));
  }, [treeData]);

  const collapseAll = useCallback(() => {
    if (treeData) setExpandedNodes(new Set([treeData.id]));
  }, [treeData]);

  return (
    <div className="p-4 sm:p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          CHECK HIERARCHY LEVELS
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Fetch and display user hierarchy using Email or Mobile.
        </p>
      </div>

      {/* Identifier Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center p-4 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <UserIcon className="w-6 h-6 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">IDENTIFIER</h2>
        </div>
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <TextField
              select
              label="Employee Type"
              value={employeeType}
              onChange={(e) =>
                setEmployeeType(
                  (e.target.value as "external" | "internal") || "external"
                )
              }
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } as any }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  const v = selected as "" | "external" | "internal";
                  if (!v) return "Select Type";
                  return v === "external" ? "External" : "Internal";
                },
              }}
              InputProps={{ sx: fieldStyles }}
            >
              <MenuItem value="" disabled>
                Select Type
              </MenuItem>
              <MenuItem value="external">External</MenuItem>
              <MenuItem value="internal">Internal</MenuItem>
            </TextField>
            <TextField
              label="Email or Mobile Number"
              placeholder="Enter Email or Mobile Number"
              value={treeIdentifier}
              onChange={(e) => {
                setTreeIdentifier(e.target.value);
                if (!e.target.value?.trim()) setTreeData(null);
              }}
              fullWidth
              variant="outlined"
              autoComplete="off"
              slotProps={{ inputLabel: { shrink: true } as any }}
              InputProps={{ sx: fieldStyles }}
              error={Boolean(treeIdentifier.trim() && identifierError)}
              helperText={treeIdentifier.trim() ? identifierError || " " : " "}
              inputProps={{
                autoComplete: "off",
                name: "tree-identifier",
                autoCorrect: "off",
                autoCapitalize: "none",
                spellCheck: "false",
              }}
            />
            <div className="flex gap-3 items-start">
              <Button
                onClick={fetchHierarchy}
                disabled={
                  !treeIdentifier.trim() ||
                  !employeeType ||
                  treeLoading ||
                  Boolean(identifierError)
                }
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6"
              >
                {treeLoading ? "Fetching..." : "Submit"}
              </Button>
              {treeIdentifier && !identifierError && (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setTreeIdentifier("");
                    setTreeData(null);
                    setSubmitted(false);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchy Section */}
      {submitted && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center p-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <UserIcon className="w-6 h-6 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">HIERARCHY</h2>
          </div>
          <div className="p-4 pt-0 text-sm">
            {treeLoading && !treeData && (
              <div className="text-gray-600 py-6">Loading hierarchy...</div>
            )}
            {!treeLoading && !treeData && (
              <div className="text-gray-500 py-6">
                No data found for the provided identifier.
              </div>
            )}
            {treeData &&
              (isTreeEmpty(treeData) ? (
                <div className="text-gray-500 py-6">No data</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs text-gray-600">
                      Total nodes: {1 + descCount} • Descendants: {descCount}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs border-gray-300 bg-white hover:bg-gray-50"
                        onClick={expandAll}
                      >
                        Expand All
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs border-gray-300 bg-white hover:bg-gray-50"
                        onClick={collapseAll}
                      >
                        Collapse All
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-auto pr-2">
                    <TreeNodeItem
                      node={treeData}
                      depth={0}
                      expanded={expandedNodes}
                      onToggle={onToggleNode}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckHierarchy;

// Internal: tree item (simple memoized node)
const TreeNodeItem: React.FC<{
  node: TreeNode;
  depth?: number;
  expanded: Set<number>;
  onToggle: (id: number) => void;
}> = React.memo(
  ({ node, depth = 0, expanded, onToggle }) => {
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    return (
      <div className="relative">
        <div
          className="flex items-start gap-2 py-2"
          style={{ paddingLeft: depth * 16 }}
        >
          <button
            type="button"
            onClick={() => hasChildren && onToggle(node.id)}
            disabled={!hasChildren}
            className={`mt-1 w-6 h-6 flex items-center justify-center rounded-md border ${
              hasChildren
                ? "bg-white hover:bg-gray-50"
                : "bg-gray-100 cursor-default"
            } text-xs`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            title={hasChildren ? (isExpanded ? "Collapse" : "Expand") : ""}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : null}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm hover:shadow transition">
              <div className="w-8 h-8 rounded-full bg-[#F6F4EE] flex items-center justify-center text-gray-700 text-sm font-semibold">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={`${
                    hasChildren ? "font-bold" : "font-medium"
                  } text-sm text-gray-900 truncate`}
                >
                  {node.name || "-"}
                </div>
                <a
                  href={`mailto:${node.email || ""}`}
                  className="text-xs text-black hover:underline break-all"
                >
                  {node.email || "-"}
                </a>
              </div>
              {hasChildren && (
                <span
                  className="ml-auto text-[10px] text-gray-700 px-2 py-0.5 rounded-full bg-[#F6F7F7] border"
                  title="Direct reports"
                >
                  {node.children.length}
                </span>
              )}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-8 border-l pl-4">
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    // Re-render if node identity or depth changes
    if (prev.node !== next.node) return false;
    if (prev.depth !== next.depth) return false;
    // Important: when the expanded Set reference changes (Expand/Collapse All),
    // we must re-render to propagate the new expansion state to children.
    if (prev.expanded !== next.expanded) return false;
    // If only local open state is unchanged and the toggle handler is stable, skip.
    const prevOpen = prev.expanded.has(prev.node.id);
    const nextOpen = next.expanded.has(next.node.id);
    return prevOpen === nextOpen && prev.onToggle === next.onToggle;
  }
);
