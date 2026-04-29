import { z } from "zod";
import { apiClient } from "@/utils/apiClient";

export const InboxMessageSchema = z.object({
  id: z.string(),
  emailInboxId: z.string(),
  assignedUserId: z.string(),
  fromEmail: z.string(),
  fromName: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  bodyText: z.string().nullable().optional(),
  bodyHtml: z.string().nullable().optional(),
  emailMessageId: z.string().nullable().optional(),
  accountName: z.string().nullable().optional(),
  status: z.enum(["pending", "ticket_created", "no_action", "junk"]),
  ticketId: z.string().nullable().optional(),
  receivedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedUser: z
    .object({ id: z.string(), name: z.string(), email: z.string() })
    .nullable()
    .optional(),
  ticket: z
    .object({ id: z.string(), number: z.number(), subject: z.string() })
    .nullable()
    .optional(),
});

export type InboxMessage = z.infer<typeof InboxMessageSchema>;

export const inboxMessageApi = {
  fetch: async (): Promise<void> => {
    await apiClient.post("/inbox_messages/fetch");
  },

  list: async (params?: {
    assigned_user_id?: string;
    status?: string;
  }): Promise<{ data: InboxMessage[]; meta: { total: number } }> => {
    const res = await apiClient.get("/inbox_messages", { params });
    const messages = z
      .array(InboxMessageSchema)
      .parse(res.data.inbox_messages ?? res.data);
    return {
      data: messages,
      meta: res.data.meta ?? { total: messages.length },
    };
  },

  createTicket: async (id: string): Promise<InboxMessage> => {
    const res = await apiClient.post(`/inbox_messages/${id}/create_ticket`);
    return InboxMessageSchema.parse(res.data.inbox_message ?? res.data);
  },

  noAction: async (id: string): Promise<InboxMessage> => {
    const res = await apiClient.post(`/inbox_messages/${id}/no_action`);
    return InboxMessageSchema.parse(res.data.inbox_message ?? res.data);
  },

  junk: async (id: string): Promise<InboxMessage> => {
    const res = await apiClient.post(`/inbox_messages/${id}/junk`);
    return InboxMessageSchema.parse(res.data.inbox_message ?? res.data);
  },
};
