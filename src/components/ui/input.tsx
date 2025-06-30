
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, placeholder = "Text Fields", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== '');
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <input
            type={type}
            className={cn(
              "flex h-14 w-full rounded border border-gray-400 bg-white px-3 py-4 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50",
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
                : "top-1/2 text-base transform -translate-y-1/2"
            )}
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded border border-gray-400 bg-white px-3 py-4 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
