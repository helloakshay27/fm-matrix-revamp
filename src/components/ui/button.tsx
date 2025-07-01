import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-[Work_Sans] border-0 rounded-none text-white font-medium tracking-[0.5px] [&_svg]:text-black w-max text-center whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-gray-300 text-white [&_svg]:text-black",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&_svg]:text-black",
        outline:
          "!bg-white !text-[#BF213E] !border !border-[#BF213E] [&_svg]:text-[#BF213E]",
        secondary:
          "!bg-[#F2EEE9] !text-[#BF213E] !border-none [&_svg]:text-[#BF213E]",
        ghost: "text-gray-900 [&_svg]:text-black",
        link: "text-primary underline-offset-4 hover:underline [&_svg]:text-black",
        primary: "!bg-[#F2EEE9] !text-[#BF213E] [&_svg]:text-[#BF213E]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-4 py-1 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10 p-2",
        desktop: "h-10 px-4 py-2",
        tablet: "h-10 px-4 py-2", 
        mobile: "h-8 px-3 py-1 text-xs",
        responsive: "h-10 px-4 py-2",
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
