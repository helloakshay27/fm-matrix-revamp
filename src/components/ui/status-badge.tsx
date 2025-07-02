
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        pending: "bg-[#F2EBC9] text-black border border-[#F2EBC9]",
        rejected: "bg-[#F2C8C4] text-black border border-[#F2C8C4]",
        accepted: "bg-[#C7EDDA] text-black border border-[#C7EDDA]",

        // Optional: map older keys too
        yellow: "bg-[#F2EBC9] text-black border border-[#F2EBC9]",
        red: "bg-[#F2C8C4] text-black border border-[#F2C8C4]",
        green: "bg-[#C7EDDA] text-black border border-[#C7EDDA]",
        
        // Leave other statuses unchanged or update similarly
        open: "bg-[#C7EDDA] text-black border border-[#C7EDDA]",
        closed: "bg-[#F2C8C4] text-black border border-[#F2C8C4]",
        "in-progress": "bg-[#F2EBC9] text-black border border-[#F2EBC9]",
        active: "bg-[#C7EDDA] text-black border border-[#C7EDDA]",
        inactive: "bg-[#F2C8C4] text-black border border-[#F2C8C4]",
        breakdown: "bg-[#F2C8C4] text-black border border-[#F2C8C4]",
        "in-use": "bg-[#C7EDDA] text-black border border-[#C7EDDA]",
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
);

type StatusVariant = "pending" | "rejected" | "accepted" | "yellow" | "red" | "green" | "open" | "closed" | "in-progress" | "active" | "inactive" | "breakdown" | "in-use"

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string
}

function StatusBadge({ className, variant, size, status, children, ...props }: StatusBadgeProps) {
  // Convert status string to valid variant key
  const getVariantFromStatus = (statusValue?: string): StatusVariant => {
    if (!statusValue) return "pending"
    
    const normalizedStatus = statusValue.toLowerCase().replace(/\s+/g, '-')
    const validVariants: StatusVariant[] = [
      "pending", "rejected", "accepted", "yellow", "red", "green", 
      "open", "closed", "in-progress", "active", "inactive", "breakdown", "in-use"
    ]
    
    if (validVariants.includes(normalizedStatus as StatusVariant)) {
      return normalizedStatus as StatusVariant
    }
    
    // Map common status values
    if (statusValue.toLowerCase().includes('pending')) return "pending"
    if (statusValue.toLowerCase().includes('reject')) return "rejected"
    if (statusValue.toLowerCase().includes('accept') || statusValue.toLowerCase().includes('confirm')) return "accepted"
    if (statusValue.toLowerCase().includes('active') || statusValue.toLowerCase().includes('use')) return "active"
    if (statusValue.toLowerCase().includes('inactive') || statusValue.toLowerCase().includes('breakdown')) return "inactive"
    
    return "pending"
  }

  const statusVariant = status ? getVariantFromStatus(status) : variant || "pending"

  return (
    <div className={cn(statusBadgeVariants({ variant: statusVariant, size }), className)} {...props}>
      {children}
    </div>
  )
}

export { StatusBadge, statusBadgeVariants }
