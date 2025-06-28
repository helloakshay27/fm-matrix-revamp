
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 shadow-none font-[Work_Sans] border-0",
  {
    variants: {
      variant: {
        default: "bg-[#C72030] text-white hover:bg-[#A01B29]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-[#C72030] text-white hover:bg-[#A01B29] border-0",
        secondary:
          "bg-[#C72030] text-white hover:bg-[#A01B29]",
        ghost: "bg-[#C72030] text-white hover:bg-[#A01B29]",
        link: "bg-[#C72030] text-white hover:bg-[#A01B29] underline-offset-4 hover:underline",
        icon: "bg-[#C72030] text-white hover:bg-[#A01B29] border-0",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4 py-2",
        lg: "h-11 px-8 py-3",
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
