
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "text-gray-900 font-medium tracking-tight",
  {
    variants: {
      level: {
        h1: "font-['Work_Sans'] font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal",
        h2: "text-3xl lg:text-4xl font-semibold", 
        h3: "text-2xl lg:text-3xl font-semibold",
        h4: "text-xl lg:text-2xl font-medium",
        h5: "text-lg lg:text-xl font-medium",
        h6: "text-base lg:text-lg font-medium",
      },
      variant: {
        default: "text-gray-900",
        primary: "text-[#C72030]",
        secondary: "text-gray-700",
        muted: "text-gray-600",
      },
      spacing: {
        tight: "mb-2",
        normal: "mb-4", 
        loose: "mb-6",
        none: "mb-0",
      },
      responsive: {
        true: "",
        false: "",
      }
    },
    compoundVariants: [
      // Desktop specific styles for h1
      {
        responsive: true,
        level: "h1",
        class: "font-['Work_Sans'] font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal"
      },
      {
        responsive: true,
        level: "h2", 
        class: "text-xl sm:text-2xl lg:text-3xl xl:text-4xl"
      },
      {
        responsive: true,
        level: "h3",
        class: "text-lg sm:text-xl lg:text-2xl xl:text-3xl"
      },
      {
        responsive: true,
        level: "h4",
        class: "text-base sm:text-lg lg:text-xl xl:text-2xl"
      },
      {
        responsive: true,
        level: "h5", 
        class: "text-sm sm:text-base lg:text-lg xl:text-xl"
      },
      {
        responsive: true,
        level: "h6",
        class: "text-xs sm:text-sm lg:text-base xl:text-lg"
      }
    ],
    defaultVariants: {
      level: "h1",
      variant: "default", 
      spacing: "normal",
      responsive: true,
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, variant, spacing, responsive, as, ...props }, ref) => {
    const Comp = as || level || "h1"
    
    return (
      <Comp
        className={cn(headingVariants({ level: level || as, variant, spacing, responsive }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
