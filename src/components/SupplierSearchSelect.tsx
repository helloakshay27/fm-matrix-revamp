import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Children,
} from 'react';
import Select, {
  components,
  type GroupBase,
  type MenuListProps,
  type StylesConfig,
} from 'react-select';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FormControl, FormHelperText, Typography } from '@mui/material';

const PAGE_SIZE = 100;
const ROW_HEIGHT = 38;
const MENU_MAX_HEIGHT = 280;
const SEARCH_DEBOUNCE_MS = 300;
const LOAD_MORE_THRESHOLD = 8;

export type SupplierOption = {
  id: string | number;
  label: string;
};

type ReactSelectOption = {
  value: string | number;
  label: string;
};

const parseSuppliersResponse = (
  data: unknown
): Array<{ id: number | string; company_name?: string; name?: string }> => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.pms_suppliers)) return record.pms_suppliers;
    if (Array.isArray(record.suppliers)) return record.suppliers;
  }
  return [];
};

const toSelectOption = (supplier: {
  id: number | string;
  company_name?: string;
  name?: string;
}): ReactSelectOption => ({
  value: supplier.id,
  label: supplier.company_name || supplier.name || String(supplier.id),
});

const dedupeOptions = (items: ReactSelectOption[]): ReactSelectOption[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getAuthHeaders = () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
};

const fetchSuppliersPage = async (
  page: number,
  searchTerm?: string,
  signal?: AbortSignal
): Promise<{ options: ReactSelectOption[]; hasMore: boolean }> => {
  const auth = getAuthHeaders();
  if (!auth) return { options: [], hasMore: false };

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(PAGE_SIZE),
  });
  const trimmedSearch = searchTerm?.trim();
  if (trimmedSearch) {
    params.set('q[company_name_cont]', trimmedSearch);
  }

  const url = `https://${auth.baseUrl}/pms/suppliers/get_suppliers.json?${params.toString()}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${auth.token}` },
    signal,
  });
  if (!resp.ok) return { options: [], hasMore: false };

  const data = await resp.json();
  let options = parseSuppliersResponse(data).map(toSelectOption);

  if (trimmedSearch) {
    const q = trimmedSearch.toLowerCase();
    options = options.filter((opt) => opt.label.toLowerCase().includes(q));
  }

  let hasMore = options.length >= PAGE_SIZE;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const pagination = (data as Record<string, unknown>).pagination as
      | Record<string, unknown>
      | undefined;
    if (pagination) {
      const current = Number(pagination.current_page ?? page);
      const total = Number(pagination.total_pages ?? current);
      hasMore = current < total;
    }
  }

  return { options, hasMore };
};

const fetchSupplierById = async (
  id: string,
  signal?: AbortSignal
): Promise<SupplierOption | null> => {
  const auth = getAuthHeaders();
  if (!auth) return null;

  const url = `https://${auth.baseUrl}/pms/suppliers/get_suppliers.json?q[id_eq]=${encodeURIComponent(id)}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${auth.token}` },
    signal,
  });
  if (!resp.ok) return null;

  const data = await resp.json();
  const match = parseSuppliersResponse(data).find(
    (item) => String(item.id) === String(id)
  );
  if (!match) return null;
  const opt = toSelectOption(match);
  return { id: opt.value, label: opt.label };
};

const buildSelectStyles = (
  hasError: boolean
): StylesConfig<ReactSelectOption, false> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 56,
    borderRadius: 4,
    borderColor: hasError ? '#d32f2f' : state.isFocused ? '#C72030' : '#c4c4c4',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#C72030',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: MENU_MAX_HEIGHT,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eff6ff' : '#fff',
    color: '#000',
    cursor: 'pointer',
    padding: '8px 12px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#999',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#000',
  }),
});

export interface SupplierSearchSelectProps {
  value: string;
  onChange: (supplierId: string) => void;
  onOptionChange?: (option: SupplierOption | null) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: React.ReactNode;
  required?: boolean;
}

export const SupplierSearchSelect: React.FC<SupplierSearchSelectProps> = ({
  value,
  onChange,
  onOptionChange,
  disabled = false,
  error = false,
  helperText,
  label = 'Supplier',
}) => {
  const [options, setOptions] = useState<ReactSelectOption[]>([]);
  const [selected, setSelected] = useState<ReactSelectOption | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const isSearchModeRef = useRef(false);
  const browseBufferRef = useRef<ReactSelectOption[]>([]);
  const searchTermRef = useRef('');
  const clientFullListRef = useRef<ReactSelectOption[] | null>(null);

  const loadAbortRef = useRef<AbortController | null>(null);
  const selectedRef = useRef<ReactSelectOption | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const resolveAbortRef = useRef<AbortController | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onOptionChangeRef = useRef(onOptionChange);
  const loadMoreRef = useRef<() => void>(() => undefined);

  onOptionChangeRef.current = onOptionChange;

  const setSelectedOption = useCallback((option: ReactSelectOption | null) => {
    selectedRef.current = option;
    setSelected(option);
  }, []);

  const filterOptionsByTerm = (
    items: ReactSelectOption[],
    term: string
  ): ReactSelectOption[] => {
    const q = term.trim().toLowerCase();
    if (!q) return items;
    return items.filter((opt) => opt.label.toLowerCase().includes(q));
  };

  const loadPage = useCallback(
    async (page: number, replace: boolean, searchTerm?: string) => {
      if (loadingRef.current && !replace) return;
      if (!replace && !hasMoreRef.current) return;

      const trimmedSearch = searchTerm?.trim();

      if (trimmedSearch && clientFullListRef.current) {
        const filtered = filterOptionsByTerm(
          clientFullListRef.current,
          trimmedSearch
        );
        const start = (page - 1) * PAGE_SIZE;
        const pageOptionsFinal = filtered.slice(start, start + PAGE_SIZE);
        const hasMoreFinal = start + PAGE_SIZE < filtered.length;

        setOptions((prev) => {
          const merged = dedupeOptions(
            replace ? pageOptionsFinal : [...prev, ...pageOptionsFinal]
          );
          return merged;
        });
        pageRef.current = page;
        hasMoreRef.current = hasMoreFinal;
        setMenuLoading(false);
        setInitialLoading(false);
        loadingRef.current = false;
        return;
      }

      loadAbortRef.current?.abort();
      const controller = new AbortController();
      loadAbortRef.current = controller;
      loadingRef.current = true;
      setMenuLoading(true);

      try {
        if (!searchTerm?.trim() && clientFullListRef.current && page > 1) {
          const start = (page - 1) * PAGE_SIZE;
          const pageOptionsFinal = clientFullListRef.current.slice(
            start,
            start + PAGE_SIZE
          );
          const hasMoreFinal =
            start + PAGE_SIZE < clientFullListRef.current.length;

          setOptions((prev) => {
            const merged = dedupeOptions([...prev, ...pageOptionsFinal]);
            browseBufferRef.current = merged;
            return merged;
          });
          pageRef.current = page;
          hasMoreRef.current = hasMoreFinal;
          return;
        }

        const { options: pageOptions, hasMore } = await fetchSuppliersPage(
          page,
          searchTerm,
          controller.signal
        );
        if (controller.signal.aborted) return;

        let pageOptionsFinal = pageOptions;
        let hasMoreFinal = hasMore;

        if (!searchTerm?.trim() && pageOptions.length > PAGE_SIZE) {
          clientFullListRef.current = pageOptions;
          const start = (page - 1) * PAGE_SIZE;
          pageOptionsFinal = clientFullListRef.current.slice(
            start,
            start + PAGE_SIZE
          );
          hasMoreFinal = start + PAGE_SIZE < clientFullListRef.current.length;
        } else if (searchTerm?.trim()) {
          clientFullListRef.current = null;
        }

        setOptions((prev) => {
          const merged = dedupeOptions(
            replace ? pageOptionsFinal : [...prev, ...pageOptionsFinal]
          );
          if (!searchTerm?.trim()) {
            browseBufferRef.current = merged;
          }
          return merged;
        });
        pageRef.current = page;
        hasMoreRef.current = hasMoreFinal;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to load suppliers', err);
        }
      } finally {
        loadingRef.current = false;
        if (!controller.signal.aborted) {
          setMenuLoading(false);
          setInitialLoading(false);
        }
      }
    },
    []
  );

  loadMoreRef.current = () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    void loadPage(
      pageRef.current + 1,
      false,
      isSearchModeRef.current ? searchTermRef.current : undefined
    );
  };

  const runSearch = useCallback(
    (term: string) => {
      loadAbortRef.current?.abort();
      loadingRef.current = false;
      isSearchModeRef.current = true;
      searchTermRef.current = term;
      hasMoreRef.current = true;
      pageRef.current = 0;
      void loadPage(1, true, term);
    },
    [loadPage]
  );

  useEffect(() => {
    void loadPage(1, true);
    return () => {
      loadAbortRef.current?.abort();
      searchAbortRef.current?.abort();
      resolveAbortRef.current?.abort();
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [loadPage]);

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }

    if (
      selectedRef.current &&
      String(selectedRef.current.value) === String(value)
    ) {
      return;
    }

    const match = options.find((item) => String(item.value) === String(value));
    if (match) {
      setSelectedOption(match);
      onOptionChangeRef.current?.({ id: match.value, label: match.label });
      return;
    }

    resolveAbortRef.current?.abort();
    const controller = new AbortController();
    resolveAbortRef.current = controller;

    (async () => {
      try {
        const resolved = await fetchSupplierById(value, controller.signal);
        if (controller.signal.aborted) return;
        const opt = resolved
          ? { value: resolved.id, label: resolved.label }
          : { value, label: `Supplier #${value}` };
        setSelectedOption(opt);
        onOptionChangeRef.current?.(
          resolved ?? { id: value, label: opt.label }
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setSelectedOption({ value, label: `Supplier #${value}` });
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resolve when value changes only
  }, [value]);

  const handleSelectChange = (option: ReactSelectOption | null) => {
    setSelectedOption(option);
    onChange(option ? String(option.value) : '');
    if (option) {
      onOptionChangeRef.current?.({ id: option.value, label: option.label });
    } else {
      onOptionChangeRef.current?.(null);
    }
  };

  const handleInputChange = useCallback(
    (inputValue: string, meta: { action: string }) => {
      const isTyping =
        meta.action === 'input-change' || meta.action === 'input';
      if (!isTyping) return;

      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      const trimmed = inputValue.trim();

      if (!trimmed) {
        loadAbortRef.current?.abort();
        loadingRef.current = false;
        isSearchModeRef.current = false;
        searchTermRef.current = '';
        hasMoreRef.current = true;
        setMenuLoading(false);
        if (browseBufferRef.current.length > 0) {
          setOptions(browseBufferRef.current);
          pageRef.current = Math.max(
            1,
            Math.ceil(browseBufferRef.current.length / PAGE_SIZE)
          );
        } else {
          void loadPage(1, true);
        }
        return;
      }

      if (clientFullListRef.current) {
        isSearchModeRef.current = true;
        searchTermRef.current = trimmed;
        hasMoreRef.current = true;
        pageRef.current = 1;
        const filtered = filterOptionsByTerm(clientFullListRef.current, trimmed);
        setOptions(filtered.slice(0, PAGE_SIZE));
        hasMoreRef.current = filtered.length > PAGE_SIZE;
        return;
      }

      searchDebounceRef.current = setTimeout(() => {
        runSearch(trimmed);
      }, SEARCH_DEBOUNCE_MS);
    },
    [loadPage, runSearch]
  );

  const VirtualizedMenuList = useMemo(() => {
    const List = (
      props: MenuListProps<ReactSelectOption, false, GroupBase<ReactSelectOption>>
    ) => {
      const { children, maxHeight } = props;
      const scrollRef = useRef<HTMLDivElement>(null);
      const childrenArray = useMemo(
        () => Children.toArray(children),
        [children]
      );
      const listHeight = Math.min(
        Number(maxHeight) || MENU_MAX_HEIGHT,
        MENU_MAX_HEIGHT
      );

      const virtualizer = useVirtualizer({
        count: childrenArray.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 8,
      });

      const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const nearBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight <
          ROW_HEIGHT * LOAD_MORE_THRESHOLD;
        if (nearBottom) {
          loadMoreRef.current();
        }
      };

      if (childrenArray.length === 0) {
        return <components.MenuList {...props} />;
      }

      return (
        <components.MenuList
          {...props}
          innerProps={{
            ...props.innerProps,
            style: { padding: 0 },
          }}
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              maxHeight: listHeight,
              overflow: 'auto',
              width: '100%',
            }}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: ROW_HEIGHT,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {childrenArray[virtualRow.index]}
                </div>
              ))}
            </div>
          </div>
        </components.MenuList>
      );
    };
    List.displayName = 'VirtualizedMenuList';
    return List;
  }, []);

  const selectComponents = useMemo(
    () => ({ MenuList: VirtualizedMenuList }),
    [VirtualizedMenuList]
  );

  const isLoading = initialLoading || menuLoading;

  return (
    <FormControl fullWidth error={error}>
      {label ? (
        <Typography
          sx={{
            fontSize: '14px',
            mb: 1,
            fontWeight: 500,
            color: '#444',
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Select
        options={options}
        value={selected}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        components={selectComponents}
        isDisabled={disabled || initialLoading}
        isLoading={isLoading}
        isClearable
        placeholder={
          initialLoading ? 'Loading suppliers...' : 'Select Supplier'
        }
        isSearchable
        filterOption={() => true}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
        menuPosition="fixed"
        styles={buildSelectStyles(error)}
        noOptionsMessage={() =>
          isLoading ? 'Loading suppliers...' : 'No suppliers found'
        }
        loadingMessage={() => 'Loading suppliers...'}
      />

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
