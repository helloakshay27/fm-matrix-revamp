import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { ticketApi, type TicketFilters } from "@/api/tickets";
import { ticketStatusApi } from "@/api/ticketStatuses";
import { userApi } from "@/api/users";
import { customerApi } from "@/api/customers";
import { categoryApi } from "@/api/categories";
import PriorityBadge from "@/components/tickets/PriorityBadge";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import NewTicketModal from "./NewTicketModal";
import type { Category } from "@/types/schemas/ticket";

const statusDotColor: Record<string, string> = {
  open: "var(--forest)",
  pending: "var(--amber)",
  resolved: "var(--sky)",
  closed: "var(--stone)",
};

function categoryLabel(
  cat: Category | null | undefined,
  allCats: Category[]
): string {
  if (!cat) return "—";
  if (cat.parentId) {
    const parent = allCats.find((c) => c.id === cat.parentId);
    return parent ? `${parent.name} › ${cat.name}` : cat.name;
  }
  return cat.name;
}

const PRIORITIES = ["critical", "high", "medium", "low"];
const CHANNELS = ["email", "whatsapp", "voice", "web", "api"];

const TicketsPage = () => {
  const location = useLocation();
  const [showNew, setShowNew] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Omit<TicketFilters, "page" | "q">>(
    () => (location.state as any)?.filters ?? {}
  );
  const [showFilters, setShowFilters] = useState(() =>
    Object.values((location.state as any)?.filters ?? {}).some(Boolean)
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const queryParams: TicketFilters = {
    page,
    q: search || undefined,
    priority: filters.priority || undefined,
    status_id: filters.status_id || undefined,
    assigned_agent_id: filters.assigned_agent_id || undefined,
    customer_id: filters.customer_id || undefined,
    category_id: filters.category_id || undefined,
    source_channel: filters.source_channel || undefined,
    unassigned: filters.unassigned || undefined,
    sla_breached: (filters as any).sla_breached || undefined,
    escalated: (filters as any).escalated || undefined,
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["tickets", queryParams],
    queryFn: () => ticketApi.list(queryParams),
    placeholderData: (prev) => prev,
  });

  const { data: statuses = [] } = useQuery({
    queryKey: ["ticketStatuses"],
    queryFn: ticketStatusApi.listAll,
  });
  const { data: agents = [] } = useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.listAll,
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: customerApi.listAll,
  });
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoryApi.listAll,
  });

  const topCategories = allCategories.filter((c: Category) => !c.parentId);

  const setFilter = useCallback((key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1);
  }, []);

  const clearFilters = () => {
    setFilters({});
    setSearch("");
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2" style={{ color: "var(--text)" }}>
            Tickets
          </h1>
          {data && (
            <p
              className="mt-0.5 text-small"
              style={{ color: "var(--text-muted)" }}
            >
              {data.meta.total} total
            </p>
          )}
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          + New Ticket
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by subject or description…"
            className="form-input !pl-8"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-secondary flex items-center gap-1.5 !text-xs relative"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M7 8h10M11 12h2M11 16h2"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "var(--coral)", color: "#fff" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {(activeFilterCount > 0 || search) && (
          <button
            onClick={clearFilters}
            className="btn-ghost !text-xs"
            style={{ color: "var(--crimson)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="mb-4 rounded-xl p-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          style={{
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Priority */}
          <div>
            <label className="form-label">Priority</label>
            <select
              value={filters.priority ?? ""}
              onChange={(e) => setFilter("priority", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select
              value={filters.status_id ?? ""}
              onChange={(e) => setFilter("status_id", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Agent */}
          <div>
            <label className="form-label">Assigned Agent</label>
            <select
              value={filters.assigned_agent_id ?? ""}
              onChange={(e) => setFilter("assigned_agent_id", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              <option value="__unassigned__">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || a.email}
                </option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div>
            <label className="form-label">Client</label>
            <select
              value={filters.customer_id ?? ""}
              onChange={(e) => setFilter("customer_id", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select
              value={filters.category_id ?? ""}
              onChange={(e) => setFilter("category_id", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              {topCategories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="form-label">Channel</label>
            <select
              value={filters.source_channel ?? ""}
              onChange={(e) => setFilter("source_channel", e.target.value)}
              className="form-select"
            >
              <option value="">All</option>
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {filters.priority && (
            <Chip
              label={`Priority: ${filters.priority}`}
              onRemove={() => setFilter("priority", "")}
            />
          )}
          {filters.status_id && (
            <Chip
              label={`Status: ${statuses.find((s) => s.id === filters.status_id)?.name ?? filters.status_id}`}
              onRemove={() => setFilter("status_id", "")}
            />
          )}
          {filters.assigned_agent_id && (
            <Chip
              label={
                filters.assigned_agent_id === "__unassigned__"
                  ? "Unassigned"
                  : `Agent: ${agents.find((a) => a.id === filters.assigned_agent_id)?.name ?? "Unknown"}`
              }
              onRemove={() => setFilter("assigned_agent_id", "")}
            />
          )}
          {filters.customer_id && (
            <Chip
              label={`Client: ${customers.find((c) => c.id === filters.customer_id)?.name ?? filters.customer_id}`}
              onRemove={() => setFilter("customer_id", "")}
            />
          )}
          {filters.category_id && (
            <Chip
              label={`Category: ${topCategories.find((c: Category) => c.id === filters.category_id)?.name ?? filters.category_id}`}
              onRemove={() => setFilter("category_id", "")}
            />
          )}
          {filters.source_channel && (
            <Chip
              label={`Channel: ${filters.source_channel}`}
              onRemove={() => setFilter("source_channel", "")}
            />
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {data && (
        <>
          <div
            className={`card overflow-hidden transition-opacity duration-150 ${isFetching ? "opacity-60" : ""}`}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Client</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        #{ticket.number}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-medium transition-colors"
                        style={{ color: "var(--text)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--coral)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--text)")
                        }
                      >
                        {ticket.subject}
                      </Link>
                      {ticket.issueType && (
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ticket.issueType.name}
                        </p>
                      )}
                    </td>
                    <td>
                      <span
                        className="font-medium text-small"
                        style={{ color: "var(--text)" }}
                      >
                        {ticket.customer.name}
                      </span>
                      {ticket.customer.account?.name && (
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ticket.customer.account.name}
                        </p>
                      )}
                    </td>
                    <td
                      className="text-small"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ticket.category ? (
                        categoryLabel(ticket.category, allCategories)
                      ) : (
                        <span style={{ opacity: 0.35 }}>—</span>
                      )}
                    </td>
                    <td>
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              statusDotColor[ticket.status.stateType] ??
                              "var(--stone)",
                          }}
                        />
                        <span
                          className="text-small"
                          style={{ color: "var(--text)" }}
                        >
                          {ticket.status.name}
                        </span>
                      </span>
                    </td>
                    <td
                      className="text-small"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ticket.assignedAgent?.name ?? (
                        <span className="italic" style={{ opacity: 0.5 }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td
                      className="text-small whitespace-nowrap"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.data.length === 0 && (
              <p
                className="py-14 text-center text-small"
                style={{ color: "var(--text-muted)" }}
              >
                {activeFilterCount > 0 || search
                  ? "No tickets match your filters."
                  : "No tickets yet."}
              </p>
            )}
          </div>

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
            <div
              className="mt-4 flex items-center justify-between text-small"
              style={{ color: "var(--text-muted)" }}
            >
              <span>
                Page {data.meta.page} of {data.meta.totalPages} (
                {data.meta.total} tickets)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.meta.totalPages}
                  className="btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showNew && <NewTicketModal onClose={() => setShowNew(false)} />}
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    style={{ backgroundColor: "var(--coral-10)", color: "var(--coral)" }}
  >
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 hover:opacity-70 leading-none"
      style={{ fontSize: "0.75rem" }}
    >
      ×
    </button>
  </span>
);

export default TicketsPage;
