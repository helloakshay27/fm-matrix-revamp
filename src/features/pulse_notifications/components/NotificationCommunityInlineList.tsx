import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAudienceCommunitiesQuery } from "../hooks/useAudienceCommunitiesQuery";
import type { NotificationTargetSelection } from "../types/customNotification";

interface NotificationCommunityInlineListProps {
  selectedIds: number[];
  onToggle: (community: NotificationTargetSelection) => void;
}

export function NotificationCommunityInlineList({
  selectedIds,
  onToggle,
}: NotificationCommunityInlineListProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useAudienceCommunitiesQuery();

  const communities = useMemo<NotificationTargetSelection[]>(
    () => (data ?? []).map((c) => ({ id: c.id, name: c.name })),
    [data]
  );

  const filteredCommunities = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return communities;
    return communities.filter((c) => c.name.toLowerCase().includes(term));
  }, [communities, search]);

  if (isError) {
    return <p className="px-4 py-3 text-sm text-brand-error">Failed to load communities</p>;
  }
  if (isLoading) {
    return <p className="px-4 py-3 text-sm text-gray-500">Loading communities...</p>;
  }

  return (
    <div>
      {communities.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <Input
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      )}
      {filteredCommunities.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-500">
          {communities.length === 0 ? "No communities available" : "No communities match your search"}
        </p>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {filteredCommunities.map((community) => (
            <label
              key={community.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(community.id)}
                onChange={() => onToggle(community)}
                className="w-4 h-4 text-brand focus:ring-brand rounded"
              />
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-sm text-gray-900">{community.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
