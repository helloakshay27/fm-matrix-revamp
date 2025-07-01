
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
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
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 rounded-none border-0 shadow-none",
      "bg-transparent text-[#C72030] opacity-100",
      "hover:border hover:border-dashed hover:border-purple-500 lg:hover:border-dashed lg:hover:border-purple-500",
      isActive 
        ? "bg-[#C72030] text-white" 
        : "bg-transparent text-[#C72030]",
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
      "gap-1 pl-2.5 pr-2.5 w-auto h-9 rounded-none bg-transparent text-[#C72030] opacity-100 border-0 shadow-none",
      "hover:bg-transparent hover:text-[#C72030] hover:border hover:border-dashed hover:border-purple-500 lg:hover:border-dashed lg:hover:border-purple-500",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 text-[#C72030]" />
    <span className="hidden sm:inline">Previous</span>
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
      "gap-1 pl-2.5 pr-2.5 w-auto h-9 rounded-none bg-transparent text-[#C72030] opacity-100 border-0 shadow-none",
      "hover:bg-transparent hover:text-[#C72030] hover:border hover:border-dashed hover:border-purple-500 lg:hover:border-dashed lg:hover:border-purple-500",
      className
    )}
    {...props}
  >
    <span className="hidden sm:inline">Next</span>
    <ChevronRight className="h-4 w-4 text-[#C72030]" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center rounded-none text-[#C72030]", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4 text-[#C72030]" />
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
