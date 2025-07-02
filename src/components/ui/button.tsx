import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-[Work_Sans] border-0 rounded-none tracking-[0.5px] w-max text-center whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "!bg-[#F2EEE9] !text-[#BF213E] [&_svg]:text-[#BF213E]",
        destructive: "!bg-[#F2EEE9] !text-[#BF213E] [&_svg]:text-[#BF213E]",
        outline: "!bg-white !text-[#BF213E] !border !border-[#BF213E] [&_svg]:text-[#BF213E]",
        secondary: "!bg-[#F2EEE9] !text-[#BF213E] !border-none [&_svg]:text-[#BF213E]",
        ghost: "bg-transparent text-black [&_svg]:text-black",
        link: "!text-[#BF213E] underline-offset-4 hover:underline [&_svg]:text-[#BF213E]",
        primary: "!bg-[#F2EEE9] !text-[#BF213E] [&_svg]:text-[#BF213E]",
        icon: "bg-transparent text-white [&_svg]:text-white",
      },
      size: {
        default: "h-[28px] sm:h-[36px] px-4 py-1.5",
        sm: "h-[28px] sm:h-[36px] px-3 py-1 text-xs",
        lg: "h-[28px] sm:h-[36px] px-6 py-2 text-base",
        icon: "h-[28px] sm:h-[36px] w-[28px] sm:w-[36px] p-1.5",
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
