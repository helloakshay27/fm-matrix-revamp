
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-[Work_Sans] border-0 rounded-none",
  {
    variants: {
      variant: {
        default: "bg-[#C8B8A0] text-[#C72030] hover:bg-[#B8A890]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#C72030] bg-white hover:bg-[#C72030] hover:text-white text-[#C72030]",
        secondary: "border border-[#C72030] bg-transparent hover:bg-[#C72030] hover:text-white text-[#C72030]",
        ghost: "bg-transparent text-[#C72030] hover:bg-[#C72030]/10",
        link: "text-[#C72030] underline-offset-4 hover:underline bg-transparent",
        primary: "bg-[#C48B9F] text-white hover:opacity-80",
      },
      size: {
        default: "h-9 px-5 text-sm xl:h-9 xl:px-5 xl:text-sm md:h-9 md:px-4 md:text-xs",
        sm: "h-7 px-3 text-xs xl:h-9 xl:px-5 xl:text-sm md:h-9 md:px-4 md:text-xs",
        lg: "h-11 px-8 text-base xl:h-9 xl:px-5 xl:text-sm md:h-9 md:px-4 md:text-xs",
        icon: "h-10 w-10 xl:h-10 xl:w-10 md:h-9 md:w-9",
        desktop: "h-9 px-5 text-sm min-w-[136px]",
        tablet: "h-9 px-4 text-xs min-w-[116px]",
        mobile: "h-7 px-3 text-[10px] min-w-[94px]",
        responsive: "h-7 px-3 text-[10px] min-w-[94px] md:h-9 md:px-4 md:text-xs md:min-w-[116px] xl:h-9 xl:px-5 xl:text-sm xl:min-w-[136px]",
      },
      iconPosition: {
        left: "flex-row gap-2 xl:gap-2.5 md:gap-2.5",
        right: "flex-row-reverse gap-2 xl:gap-2.5 md:gap-2.5",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "responsive",
      iconPosition: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconPosition, asChild = false, icon, loading, fullWidth, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine icon position based on icon prop
    const resolvedIconPosition = icon ? (iconPosition || "left") : "none"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, iconPosition: resolvedIconPosition, className }),
          fullWidth && "w-full",
          loading && "opacity-70 cursor-wait"
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            {children && <span className="ml-2">{children}</span>}
          </>
        ) : (
          <>
            {icon && resolvedIconPosition === "left" && (
              <span className="[&_svg]:h-4 [&_svg]:w-4 md:[&_svg]:h-4 md:[&_svg]:w-4 xl:[&_svg]:h-4 xl:[&_svg]:w-4">
                {icon}
              </span>
            )}
            {children}
            {icon && resolvedIconPosition === "right" && (
              <span className="[&_svg]:h-4 [&_svg]:w-4 md:[&_svg]:h-4 md:[&_svg]:w-4 xl:[&_svg]:h-4 xl:[&_svg]:w-4">
                {icon}
              </span>
            )}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
