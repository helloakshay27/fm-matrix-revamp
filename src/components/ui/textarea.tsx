
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, placeholder = "", ...props }, ref) => {
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
        <div className="field-group relative" style={{ margin: '20px 0' }}>
          <textarea
            className={cn(
              "floating-label flex min-h-[80px] w-full pt-4 pb-2 px-[15px] text-base border border-[#ccc] rounded transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
              className
            )}
            placeholder=""
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          <label
            className={cn(
              "absolute left-[15px] transition-all duration-150 ease-in text-[#676767] pointer-events-none",
              shouldFloatLabel
                ? "field-active -translate-y-[25px] text-[0.9em] text-black"
                : "top-4 text-base"
            )}
            style={{
              textShadow: shouldFloatLabel ? '1px 0 0 #fff, -1px 0 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff' : 'none'
            }}
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
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
