
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#C72030] text-white hover:bg-[#C72030]/90 border border-[#C72030]",
        destructive: "bg-red-500 text-white hover:bg-red-600 border border-red-500",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 text-gray-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900 border border-transparent",
        link: "text-[#C72030] underline-offset-4 hover:underline border border-transparent",
        success: "bg-green-500 text-white hover:bg-green-600 border border-green-500",
        warning: "bg-orange-500 text-white hover:bg-orange-600 border border-orange-500",
        info: "bg-blue-500 text-white hover:bg-blue-600 border border-blue-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-3 text-base",
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
