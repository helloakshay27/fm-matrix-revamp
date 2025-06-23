
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "text-ds-primary font-medium tracking-normal text-left",
  {
    variants: {
      level: {
        h1: "heading-title font-semibold",
        h2: "title-1 font-medium", 
        h3: "body-text-1 font-medium",
        h4: "body-text-2 font-medium",
        h5: "body-text-3 font-medium",
        h6: "body-text-4 font-medium",
      },
      variant: {
        default: "text-ds-primary",
        primary: "text-ds-accent",
        secondary: "text-ds-secondary",
        muted: "text-grey-text",
        white: "text-ds-white",
      },
      spacing: {
        tight: "mb-2",
        normal: "mb-4", 
        loose: "mb-6",
        none: "mb-0",
      },
    },
    defaultVariants: {
      level: "h1",
      variant: "default", 
      spacing: "normal",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, variant, spacing, as, ...props }, ref) => {
    const Comp = as || level || "h1"
    
    return (
      <Comp
        className={cn(headingVariants({ level: level || as, variant, spacing }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
