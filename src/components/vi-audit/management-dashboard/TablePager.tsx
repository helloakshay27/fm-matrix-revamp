interface TablePagerProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}

export function TablePager({ page, totalPages, total, pageSize, onPage }: TablePagerProps) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="tbl-pager">
      <span className="tbl-pager-meta">
        {from}–{to} of {total}
      </span>
      <div className="tbl-pager-actions">
        <button type="button" className="tbl-pager-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        <span className="tbl-pager-page">
          Page {page} / {totalPages}
        </span>
        <button type="button" className="tbl-pager-btn" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
