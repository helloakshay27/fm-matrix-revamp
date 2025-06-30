
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Plus, Download, Filter, Edit, Share, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C48B9F] disabled:pointer-events-none disabled:opacity-50 font-[Work_Sans]",
  {
    variants: {
      variant: {
        primary: "bg-[#C48B9F] text-white hover:opacity-80 active:scale-98",
        secondary: "bg-transparent text-[#C48B9F] border border-[#C48B9F] hover:opacity-80 active:scale-98",
        ghost: "bg-transparent text-[#C48B9F] hover:opacity-80 active:scale-98",
        // Legacy variants for backward compatibility
        default: "bg-[#C48B9F] text-white hover:opacity-80 active:scale-98",
        outline: "bg-transparent text-[#C48B9F] border border-[#C48B9F] hover:opacity-80 active:scale-98",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: "text-[#C48B9F] underline-offset-4 hover:underline",
      },
      size: {
        desktop: "h-9 min-w-[136px] px-5 py-2.5 text-sm gap-2.5", // height: 36px, padding: 10px 20px, font-size: 14px
        tablet: "h-9 min-w-[116px] px-4 py-2.5 text-xs gap-2.5", // height: 36px, padding: 10px 16px, font-size: 12px
        mobile: "h-7 min-w-[94px] px-3 py-1.5 text-[10px] gap-2", // height: 28px, padding: 6px 12px, font-size: 10px
        responsive: "h-9 min-w-[136px] px-5 py-2.5 text-sm gap-2.5 md:min-w-[116px] md:px-4 xl:min-w-[136px] xl:px-5", // Responsive sizing
        // Legacy sizes for backward compatibility
        default: "h-9 min-w-[136px] px-5 py-2.5 text-sm gap-2.5",
        sm: "h-7 min-w-[94px] px-3 py-1.5 text-[10px] gap-2",
        lg: "h-9 min-w-[136px] px-5 py-2.5 text-sm gap-2.5",
        icon: "h-9 w-9 p-0",
      },
      iconSize: {
        desktop: "[&_svg]:size-4", // 16px
        tablet: "[&_svg]:size-4", // 16px
        mobile: "[&_svg]:size-3.5", // 14px
        responsive: "[&_svg]:size-4 xl:[&_svg]:size-4", // Responsive icon sizing
        // Legacy for backward compatibility
        default: "[&_svg]:size-4",
        sm: "[&_svg]:size-3.5",
        lg: "[&_svg]:size-4",
        icon: "[&_svg]:size-4",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "responsive",
      iconSize: "responsive",
      fullWidth: false,
    },
  }
)

const iconMap = {
  plus: Plus,
  download: Download,
  filter: Filter,
  edit: Edit,
  share: Share,
} as const

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: keyof typeof iconMap
  iconPosition?: "left" | "right"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    iconSize, 
    fullWidth, 
    asChild = false, 
    icon, 
    iconPosition = "left", 
    loading = false, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const IconComponent = icon ? iconMap[icon] : null
    const isDisabled = disabled || loading

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="animate-spin" />
      }
      if (IconComponent) {
        return <IconComponent />
      }
      return null
    }

    const renderContent = () => {
      const iconElement = renderIcon()
      
      if (!children && iconElement) {
        // Icon-only button
        return iconElement
      }

      if (iconPosition === "left") {
        return (
          <>
            {iconElement}
            {children}
          </>
        )
      } else {
        return (
          <>
            {children}
            {iconElement}
          </>
        )
      }
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconSize, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        style={{ 
          borderRadius: 0, // Sharp corners as specified
          letterSpacing: '0.5px',
          fontWeight: 500
        }}
        {...props}
      >
        {renderContent()}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
