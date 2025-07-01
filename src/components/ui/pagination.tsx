"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(
      "mx-auto flex w-full justify-center overflow-x-auto sm:overflow-visible",
      className
    )}
    {...props}
  />
)
Pagination.displayName = "Pagination"

type PaginationContentProps = React.ComponentProps<"ul"> & {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const PaginationContent = ({
  className,
  totalPages,
  currentPage,
  onPageChange,
  ...props
}: PaginationContentProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 640)
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  let visiblePages = pages
  if (isMobile && !isExpanded) {
    if (totalPages <= 3) {
      visiblePages = pages
    } else {
      visiblePages = [1, currentPage, totalPages].filter(
        (v, i, self) => self.indexOf(v) === i
      )
      visiblePages.sort((a, b) => a - b)
    }
  }

  const showEllipsis = isMobile && !isExpanded && totalPages > 3

  return (
    <ul
      className={cn("flex flex-row items-center gap-1 min-w-max", className)}
      {...props}
    >
      <PaginationItem>
        <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
      </PaginationItem>

      {visiblePages.map((page, index) => (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}

      {showEllipsis && (
        <PaginationItem>
          <PaginationEllipsis onClick={() => setIsExpanded(true)} />
        </PaginationItem>
      )}

      {isExpanded &&
        isMobile &&
        pages
          .filter((page) => !visiblePages.includes(page))
          .map((page) => (
            <PaginationItem key={`expanded-${page}`}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

      <PaginationItem>
        <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
      </PaginationItem>
    </ul>
  )
}
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "min-w-[32px] h-8 px-2 border-0 shadow-none rounded-none",
      isActive
        ? "bg-[#C72030] text-white font-semibold"
        : "bg-transparent text-black hover:bg-gray-100",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn(
      "gap-1 pl-2 pr-2 h-8 rounded-none bg-transparent text-black hover:bg-gray-100 border-0 shadow-none",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 text-black" />
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn(
      "gap-1 pl-2 pr-2 h-8 rounded-none bg-transparent text-black hover:bg-gray-100 border-0 shadow-none",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4 text-black" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="button"
    tabIndex={0}
    aria-hidden
    className={cn(
      "flex h-8 min-w-[32px] items-center justify-center rounded-none text-black px-2 cursor-pointer",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4 text-black" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
