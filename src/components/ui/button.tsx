
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-[Work_Sans] border-0",
  {
    variants: {
      variant: {
        default: "bg-[#C72030] text-white hover:bg-[#A01B29]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#C72030] bg-white hover:bg-[#C72030] hover:text-white text-[#C72030]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "bg-[#C72030] text-white hover:bg-[#A01B29]",
      },
      size: {
        default: "h-[40px] px-[24px] py-[8px] min-w-[100px] text-sm leading-[24px]",
        sm: "h-[32px] px-[16px] py-[4px] min-w-[80px] text-xs leading-[20px]",
        lg: "h-[48px] px-[32px] py-[12px] min-w-[120px] text-base leading-[28px]",
        icon: "h-[40px] w-[40px] p-[8px]",
        "icon-sm": "h-[32px] w-[32px] p-[4px]",
        "icon-lg": "h-[48px] w-[48px] p-[12px]",
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
