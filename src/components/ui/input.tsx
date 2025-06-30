
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-white text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Border radius: 0px as per design specs
          "rounded-none",
          // Border and shadows: None as per design specs  
          "border border-gray-300 shadow-none",
          // Desktop spacing (default) - 12px padding
          "h-10 px-3 py-2",
          // Tablet spacing - 12px padding
          "md:h-10 md:px-3 md:py-2",
          // Mobile spacing - 12px padding
          "sm:h-10 sm:px-3 sm:py-2",
          // Colors as per design specs
          "text-gray-900 placeholder:text-gray-400",
          // Focus states
          "focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
