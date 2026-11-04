import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { parsePage } from "@/features/vi-inspection/master/utils";

/**
 * URL-backed page + filters for the training master lists, plus a debounced server-side search
 * (kept in the URL as `search`). Any filter or search change sends the list back to page 1.
 */
export const useMasterListParams = (totalPages: number | undefined) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput.trim(), 400);

  const updateParams = (updates: Record<string, string | undefined>, resetPage = true) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
        });
        if (resetPage) params.delete("page");
        return params;
      },
      { replace: false }
    );
  };

  // Push the typed search to the URL once the user stops typing.
  const lastSearch = useRef(search);
  useEffect(() => {
    if (debouncedSearch === lastSearch.current) return;
    lastSearch.current = debouncedSearch;
    updateParams({ search: debouncedSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // The URL page can point past the end (stale link, filters shrank the list, last row deleted).
  useEffect(() => {
    if (totalPages && page > totalPages) {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (totalPages <= 1) params.delete("page");
          else params.set("page", String(totalPages));
          return params;
        },
        { replace: true }
      );
    }
  }, [totalPages, page, setSearchParams]);

  const setPage = (next: number) => updateParams({ page: next > 1 ? String(next) : undefined }, false);

  return { searchParams, page, search, searchInput, setSearchInput, updateParams, setPage };
};

/** Toast text for a DELETE whose outcome may be "deactivated" (still in use) instead of "deleted". */
export const deleteOutcomeMessage = (outcome: string | undefined, label: string) =>
  outcome === "deactivated" ? `${label} is in use, so it was deactivated instead of deleted` : `${label} deleted`;
