import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-[Work_Sans] border-0 rounded-none bg-[#C4B8D0] bg-opacity-35 text-white font-medium tracking-[0.5px] [&_svg]:text-black w-max text-center whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#C4B8D0] bg-opacity-35 text-white [&_svg]:text-black",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&_svg]:text-black",
        outline:
          "border border-[#C72030] bg-white text-[#C72030] [&_svg]:text-black",
        secondary:
          "bg-gray-100 text-gray-900 [&_svg]:text-black",
        ghost: "text-gray-900 [&_svg]:text-black",
        link: "text-primary underline-offset-4 hover:underline [&_svg]:text-black",
        primary: "bg-[#C72030] text-white [&_svg]:text-black",
      },
      size: {
        default: "responsive-button",
        sm: "h-8 px-4 py-1 min-w-[80px] text-xs",
        lg: "h-12 px-8 py-3 min-w-[120px] text-base",
        icon: "h-10 w-10 p-2",
        desktop: "responsive-button",
        tablet: "responsive-button", 
        mobile: "responsive-button",
        responsive: "responsive-button",
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
