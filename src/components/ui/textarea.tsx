
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, placeholder = "Text Fields", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== '');
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value !== '');
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(props.value !== '' && props.value !== null && props.value !== undefined);
      }
    }, [props.value]);

    const shouldFloatLabel = isFocused || hasValue || (props.value !== undefined && props.value !== '');

    if (label) {
      return (
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded border border-gray-400 bg-white px-3 pt-6 pb-2 text-base transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
              className
            )}
            placeholder={shouldFloatLabel ? placeholder : ''}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1 text-gray-600",
              shouldFloatLabel
                ? "top-0 text-sm transform -translate-y-1/2"
                : "top-6 text-base"
            )}
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded border border-gray-400 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
