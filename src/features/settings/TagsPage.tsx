import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "@/api/tags";
import type { Tag } from "@/api/tags";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

const PRESET_COLOURS = [
  "#DA7756",
  "#534AB7",
  "#085041",
  "#185FA5",
  "#BA7517",
  "#A32D2D",
  "#3B6D11",
  "#888780",
];

interface TagModalProps {
  onClose: () => void;
}

const TagModal = ({ onClose }: TagModalProps) => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const [name, setName] = useState("");
  const [colour, setColour] = useState(PRESET_COLOURS[0]);

  const mutation = useMutation({
    mutationFn: () => tagsApi.create(name.trim(), colour),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      addToast("Tag created", "success");
      onClose();
    },
    onError: () => addToast("Failed to create tag", "error"),
  });

  return (
    <Modal title="Create Tag" onClose={onClose}>
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <label className="form-label">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g. billing, urgent, bug"
            autoFocus
          />
        </div>
        <div>
          <label className="form-label">Colour</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLOURS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColour(c)}
                className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: colour === c ? "var(--text)" : "transparent",
                }}
              />
            ))}
            <input
              type="color"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded-full border border-[var(--border)] bg-transparent p-0"
              title="Custom colour"
            />
          </div>
          {/* Preview */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Preview:
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${colour}20`, color: colour }}
            >
              {name || "tag-name"}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) mutation.mutate();
            }}
            disabled={!name.trim() || mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {mutation.isPending && <Spinner className="h-4 w-4" />}
            Create Tag
          </button>
        </div>
      </div>
    </Modal>
  );
};

const TagsPage = () => {
  const qc = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);
  const canManage = useAuthStore((s) => s.canManage);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      addToast("Tag deleted", "success");
    },
    onError: () => addToast("Failed to delete tag", "error"),
  });

  const filtered = tags.filter((t: Tag) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Tags
          </h1>
          <p className="mt-1 text-small" style={{ color: "var(--text-muted)" }}>
            Manage labels used to categorise tickets across your organisation.
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            + New Tag
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags…"
          className="form-input max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <p
            className="py-12 text-center text-small"
            style={{ color: "var(--text-muted)" }}
          >
            {search
              ? "No tags match your search."
              : "No tags yet. Create one to get started."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tag
                </th>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Slug
                </th>
                <th
                  className="px-4 py-3 text-left text-label uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Colour
                </th>
                {canManage && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tag: Tag) => (
                <tr
                  key={tag.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: tag.colour
                          ? `${tag.colour}20`
                          : "var(--violet-10)",
                        color: tag.colour ?? "var(--violet)",
                      }}
                    >
                      {tag.name}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {tag.slug}
                  </td>
                  <td className="px-4 py-3">
                    {tag.colour ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border border-[var(--border)]"
                          style={{ backgroundColor: tag.colour }}
                        />
                        <span
                          className="font-mono text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {tag.colour}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Delete tag "${tag.name}"? It will be removed from all tickets.`
                            )
                          ) {
                            deleteMutation.mutate(tag.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="btn-ghost !text-xs"
                        style={{ color: "var(--crimson)" }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
        {tags.length} tag{tags.length !== 1 ? "s" : ""} total
      </p>

      {showCreate && <TagModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default TagsPage;
