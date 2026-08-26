import { useMemo } from "react";
import { Users } from "lucide-react";
import { useAudiencePreviewQuery } from "../hooks/useAudiencePreviewQuery";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import type { CustomNotificationDetail } from "../types/customNotification";

interface AudiencePreviewPanelProps {
  notification: CustomNotificationDetail;
}

export function AudiencePreviewPanel({ notification }: AudiencePreviewPanelProps) {
  const payload = useMemo(
    () => ({
      audience_scope: notification.audience_scope,
      company_id: notification.company_id,
      ntype: notification.ntype,
      targets: notification.targets.map((t) => ({
        targetable_type: t.targetable_type,
        targetable_id: t.targetable_id,
      })),
    }),
    [notification]
  );

  const { data, isLoading, isError, error } = useAudiencePreviewQuery(payload);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading audience preview...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-brand-error">
        {getApiErrorMessage(error, "Failed to load audience preview")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-brand" />
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">{data.total_recipients}</span> total
          recipients will receive this notification
        </p>
      </div>

      {data.sample.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Sample recipients
          </p>
          <div className="flex flex-wrap gap-2">
            {data.sample.map((person) => (
              <span
                key={person.id}
                className="inline-flex items-center rounded-full border border-brand/30 bg-brand-selected px-2.5 py-0.5 text-xs text-brand"
              >
                {person.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
