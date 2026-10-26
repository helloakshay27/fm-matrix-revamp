import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MasterPaginationProps {
  currentPage: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

/** Server-side pager rendered below the table (same structure as MaterialPRDashboard). */
export const MasterPagination = ({
  currentPage,
  totalPages,
  loading = false,
  onPageChange,
}: MasterPaginationProps) => {
  const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages || next === currentPage || loading) {
      return;
    }
    onPageChange(next);
  };

  const renderPageLink = (pageNumber: number) => (
    <PaginationItem key={pageNumber} className="cursor-pointer">
      <PaginationLink
        onClick={() => handlePageChange(pageNumber)}
        isActive={currentPage === pageNumber}
        aria-disabled={loading}
        className={loading ? "pointer-events-none opacity-50" : ""}
      >
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );

  const renderPaginationItems = () => {
    if (!totalPages || totalPages <= 0) {
      return null;
    }
    const items: JSX.Element[] = [];

    // Up to 7 pages: show them all.
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(renderPageLink(i));
      }
      return items;
    }

    // Otherwise always show first + last, and the current page with its neighbours:
    //   near the start → 1 2 3 4 5 … N
    //   in the middle  → 1 … c-1 c c+1 … N
    //   near the end   → 1 … N-4 N-3 N-2 N-1 N
    let start: number;
    let end: number;
    if (currentPage <= 4) {
      start = 2;
      end = 5;
    } else if (currentPage >= totalPages - 3) {
      start = totalPages - 4;
      end = totalPages - 1;
    } else {
      start = currentPage - 1;
      end = currentPage + 1;
    }

    items.push(renderPageLink(1));
    if (start > 2) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    for (let i = start; i <= end; i++) {
      items.push(renderPageLink(i));
    }
    if (end < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    items.push(renderPageLink(totalPages));

    return items;
  };

  return (
    <div className="flex justify-center mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 || loading
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages || loading
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
