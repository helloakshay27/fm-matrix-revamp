
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  spacing?: "default" | "tight" | "loose"
  wrap?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", spacing = "default", wrap = false, children, ...props }, ref) => {
    const spacingClasses = {
      tight: orientation === "horizontal" ? "gap-1 md:gap-2 xl:gap-2" : "gap-1",
      default: orientation === "horizontal" ? "gap-2 md:gap-3 xl:gap-3" : "gap-2", 
      loose: orientation === "horizontal" ? "gap-3 md:gap-4 xl:gap-4" : "gap-3",
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          orientation === "horizontal" && wrap && "flex-wrap",
          spacingClasses[spacing],
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

export { ButtonGroup }
