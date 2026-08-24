import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useNotificationRecipientsQuery } from "../hooks/useNotificationRecipientsQuery";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { formatNotificationDate } from "../utils/notificationFormatters";

const PAGE_SIZE = 50;

const RECIPIENT_STATUS_STYLES: Record<string, string> = {
  sent: "bg-brand-success/15 text-brand-success",
  delivered: "bg-brand-success/15 text-brand-success",
  read: "bg-brand-success/15 text-brand-success",
  failed: "bg-brand-error/15 text-brand-error",
  pending: "bg-brand-warning/15 text-brand-warning",
};

interface NotificationRecipientsPanelProps {
  notificationId: number;
}

export function NotificationRecipientsPanel({
  notificationId,
}: NotificationRecipientsPanelProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error } = useNotificationRecipientsQuery(
    notificationId,
    page,
    PAGE_SIZE
  );

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading recipients...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-brand-error">
        {getApiErrorMessage(error, "Failed to load recipients")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {data.meta.total_count} total recipient{data.meta.total_count === 1 ? "" : "s"}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Delivered At</TableHead>
            <TableHead>Read At</TableHead>
            <TableHead>Failure Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.recipients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                No recipients found
              </TableCell>
            </TableRow>
          ) : (
            data.recipients.map((recipient) => (
              <TableRow key={recipient.id}>
                <TableCell className="font-medium text-gray-900">
                  {recipient.user_name}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      RECIPIENT_STATUS_STYLES[recipient.status] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {recipient.status}
                  </span>
                </TableCell>
                <TableCell>{formatNotificationDate(recipient.sent_at)}</TableCell>
                <TableCell>{formatNotificationDate(recipient.delivered_at)}</TableCell>
                <TableCell>{formatNotificationDate(recipient.read_at)}</TableCell>
                <TableCell>{recipient.failure_reason ?? "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {data.meta.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {data.meta.current_page} of {data.meta.total_pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.total_pages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
