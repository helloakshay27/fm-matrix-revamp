import { Check, X } from "lucide-react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// App-wide toast look: compact dark pill, bottom-center, white text.
// Colors go through sonner's CSS variables so they win over its default styles.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      offset={24}
      duration={4000}
      className="toaster group"
      style={
        {
          "--normal-bg": "#1a1a1a",
          "--normal-text": "#ffffff",
          "--normal-border": "#1a1a1a",
          "--border-radius": "8px",
          // Max toast width; each toast shrinks to fit its message within this.
          "--width": "min(560px, calc(100vw - 32px))",
        } as React.CSSProperties
      }
      // Plain glyphs instead of sonner's default filled-circle icons.
      icons={{
        success: <Check className="h-4 w-4" strokeWidth={2.5} />,
        error: <X className="h-4 w-4" strokeWidth={2.5} />,
      }}
      toastOptions={{
        classNames: {
          // Fit-to-content width, centered via insets + auto margins (not transform,
          // which sonner uses for its stacking animation).
          toast:
            "group toast !w-fit !max-w-full !left-0 !right-0 !mx-auto !px-5 !py-3 !gap-3 !shadow-lg !font-semibold !text-sm",
          title: "!font-semibold",
          description: "!text-white/70 !font-normal",
          icon: "!text-white",
          error: "[&_[data-icon]]:!text-brand-error",
          warning: "[&_[data-icon]]:!text-brand-warning",
          info: "[&_[data-icon]]:!text-brand-info",
          actionButton: "!bg-white !text-[#1a1a1a]",
          cancelButton: "!bg-white/15 !text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
