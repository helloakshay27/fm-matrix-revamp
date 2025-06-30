
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: "horizontal" | "vertical"
  className?: string
  spacing?: "desktop" | "tablet" | "mobile" | "responsive"
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = "horizontal", spacing = "responsive", className, ...props }, ref) => {
    const getSpacingClass = () => {
      if (orientation === "vertical") {
        return "flex-col space-y-2" // 8px vertical spacing for all devices
      }
      
      // Horizontal spacing
      switch (spacing) {
        case "desktop":
          return "flex-row space-x-3" // 12px
        case "tablet":
          return "flex-row space-x-3" // 12px
        case "mobile":
          return "flex-row space-x-2" // 8px
        case "responsive":
        default:
          return "flex-row space-x-2 md:space-x-3 xl:space-x-3" // Responsive: 8px mobile, 12px tablet/desktop
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center",
          getSpacingClass(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"
