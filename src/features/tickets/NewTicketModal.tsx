import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/api/tickets";
import { customerApi } from "@/api/customers";
import { accountsApi } from "@/api/accounts";
import { issueTypeApi } from "@/api/issueTypes";
import { categoryApi } from "@/api/categories";
import { userApi } from "@/api/users";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import FileUploader from "@/components/common/FileUploader";
import type { Category } from "@/types/schemas/ticket";

const schema = z.object({
  subject: z.string().min(1, "Subject is required").max(500),
  description: z.string().optional(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  source_channel: z.enum(["email", "whatsapp", "voice", "web", "api"]),
  customer_id: z.string().min(1, "Client is required"),
  issue_type_id: z.string().optional(),
  category_id: z.string().optional(),
  assigned_agent_id: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface NewTicketModalProps {
  onClose: () => void;
}

const NewTicketModal = ({ onClose }: NewTicketModalProps) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts", "all"],
    queryFn: accountsApi.list,
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["customers", "byAccount", selectedAccountId],
    queryFn: () =>
      selectedAccountId
        ? customerApi.listByAccount(selectedAccountId)
        : customerApi.listAll(),
  });
  const { data: issueTypes = [] } = useQuery({
    queryKey: ["issueTypes", "all"],
    queryFn: issueTypeApi.listAll,
  });
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });
  const { data: agents = [] } = useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.listAll,
  });

  const topCategories = allCategories.filter((c: Category) => !c.parentId);
  const subCategories = allCategories.filter(
    (c: Category) => c.parentId === selectedParentId
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "medium", source_channel: "web" },
  });

  const mutation = useMutation({
    mutationFn: (d: FormData) =>
      ticketApi.create({ ...d, attachment_ids: attachmentIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      addToast("Ticket created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create ticket", "error"),
  });

  const handleParentCategoryChange = (parentId: string) => {
    setSelectedParentId(parentId);
    const hasSubs = allCategories.some(
      (c: Category) => c.parentId === parentId
    );
    setValue("category_id", hasSubs ? "" : parentId);
  };

  return (
    <Modal title="New Ticket" onClose={onClose}>
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4 px-6 py-5"
      >
        <div>
          <label className="form-label">Subject *</label>
          <input {...register("subject")} className="form-input" />
          {errors.subject && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label">Account</label>
          <select
            value={selectedAccountId}
            onChange={(e) => {
              setSelectedAccountId(e.target.value);
              setValue("customer_id", "");
            }}
            className="form-select"
          >
            <option value="">— All accounts —</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Client *</label>
          <select {...register("customer_id")} className="form-select">
            <option value="">— Select client —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-xs" style={{ color: "var(--crimson)" }}>
              {errors.customer_id.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Ticket Type</label>
            <select {...register("issue_type_id")} className="form-select">
              <option value="">— None —</option>
              {issueTypes.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Assign Agent</label>
            <select {...register("assigned_agent_id")} className="form-select">
              <option value="">— Unassigned —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || a.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Category</label>
            <select
              value={selectedParentId}
              onChange={(e) => handleParentCategoryChange(e.target.value)}
              className="form-select"
            >
              <option value="">— Select category —</option>
              {topCategories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedParentId && subCategories.length > 0 && (
            <div className="flex-1">
              <label className="form-label">Sub-category</label>
              <select {...register("category_id")} className="form-select">
                <option value="">— Select sub-category —</option>
                {subCategories.map((c: Category) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="form-label">Priority</label>
            <select {...register("priority")} className="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Channel</label>
            <select {...register("source_channel")} className="form-select">
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="voice">Voice</option>
              <option value="api">API</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="form-textarea"
          />
        </div>

        <div>
          <label className="form-label">Attachments</label>
          <FileUploader onAttachmentsChange={setAttachmentIds} />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {mutation.isPending && <Spinner className="h-4 w-4" />}
            Create Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTicketModal;
