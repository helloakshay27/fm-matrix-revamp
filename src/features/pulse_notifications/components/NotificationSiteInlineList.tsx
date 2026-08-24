import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAudienceSitesQuery } from "../hooks/useAudienceSitesQuery";
import type { NotificationTargetSelection } from "../types/customNotification";

interface NotificationSiteInlineListProps {
  selectedIds: number[];
  onToggle: (site: NotificationTargetSelection) => void;
}

export function NotificationSiteInlineList({
  selectedIds,
  onToggle,
}: NotificationSiteInlineListProps) {
  const [search, setSearch] = useState("");

  const userIdRaw = localStorage.getItem("userId");
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
  const hasValidUserId = !Number.isNaN(userId);

  const { data, isLoading, isError } = useAudienceSitesQuery(
    hasValidUserId ? userId : null
  );

  const sites = useMemo<NotificationTargetSelection[]>(
    () => (data ?? []).map((s) => ({ id: s.id, name: s.name })),
    [data]
  );

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sites;
    return sites.filter((s) => s.name.toLowerCase().includes(term));
  }, [sites, search]);

  if (!hasValidUserId) {
    return (
      <p className="px-4 py-3 text-sm text-brand-error">
        No logged-in user found — cannot load sites
      </p>
    );
  }
  if (isError) {
    return <p className="px-4 py-3 text-sm text-brand-error">Failed to load sites</p>;
  }
  if (isLoading) {
    return <p className="px-4 py-3 text-sm text-gray-500">Loading sites...</p>;
  }

  return (
    <div>
      {sites.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <Input
            placeholder="Search sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      )}
      {filteredSites.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-500">
          {sites.length === 0 ? "No sites available" : "No sites match your search"}
        </p>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {filteredSites.map((site) => (
            <label
              key={site.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(site.id)}
                onChange={() => onToggle(site)}
                className="w-4 h-4 text-brand focus:ring-brand rounded"
              />
              <span className="text-sm text-gray-900">{site.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
