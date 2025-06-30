
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-[Work_Sans] border",
  {
    variants: {
      variant: {
        default: "bg-[#C8B8A0] text-[#C72030] border-[#C8B8A0] hover:bg-[#B8A890] hover:border-[#B8A890]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive",
        outline:
          "border-[#C72030] bg-white hover:bg-[#C72030] hover:text-white text-[#C72030]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-100",
        ghost: "hover:bg-gray-100 hover:text-gray-900 border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        icon: "bg-[#C8B8A0] text-[#C72030] border-[#C8B8A0] hover:bg-[#B8A890] hover:border-[#B8A890]",
      },
      size: {
        default: "h-10 px-4 py-2 min-w-[120px] text-sm",
        sm: "h-8 px-3 py-1.5 min-w-[100px] text-xs",
        lg: "h-12 px-6 py-3 min-w-[140px] text-base",
        icon: "h-10 w-10 p-2",
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
