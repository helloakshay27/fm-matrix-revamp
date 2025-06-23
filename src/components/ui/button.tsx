
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-none text-left",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-grey-text bg-white hover:bg-gray-50 hover:text-gray-900 text-gray-700",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "bg-primary text-text-white hover:bg-primary/90 border-none",
      },
      size: {
        default: "h-btn-mobile w-btn-mobile text-body-4-mobile px-3 md:h-btn-tablet md:w-btn-tablet md:text-body-4-tablet md:px-4 lg:h-btn-desktop lg:w-btn-desktop lg:text-body-4-desktop lg:px-5",
        sm: "h-7 px-3 text-body-5-mobile md:text-body-5-tablet lg:text-body-5-desktop",
        lg: "h-12 px-8 text-body-3-mobile md:text-body-3-tablet lg:text-body-3-desktop",
        icon: "h-btn-mobile w-btn-mobile p-2 md:h-btn-tablet md:w-btn-tablet lg:h-btn-desktop lg:w-btn-desktop",
        "icon-sm": "h-8 w-8 p-1.5",
        "icon-lg": "h-12 w-12 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
