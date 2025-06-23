
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        rejected: "bg-red-100 text-red-800 border border-red-200", 
        accepted: "bg-green-100 text-green-800 border border-green-200",
        // Alternative spellings for flexibility
        yellow: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        red: "bg-red-100 text-red-800 border border-red-200",
        green: "bg-green-100 text-green-800 border border-green-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: "pending" | "rejected" | "accepted" | "yellow" | "red" | "green"
}

function StatusBadge({ className, variant, size, status, children, ...props }: StatusBadgeProps) {
  const statusVariant = status || variant
  
  return (
    <div className={cn(statusBadgeVariants({ variant: statusVariant, size }), className)} {...props}>
      {children}
    </div>
  )
}

export { StatusBadge, statusBadgeVariants }
