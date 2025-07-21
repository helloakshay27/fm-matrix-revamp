
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, placeholder = "", ...props }, ref) => {
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
        setHasValue(
          props.value !== '' && props.value !== null && props.value !== undefined
        );
      }
    }, [props.value]);

    const shouldFloatLabel =
      isFocused || hasValue || (props.value !== undefined && props.value !== '');

    if (label) {
      return (
        <div className="field-group relative" style={{ margin: "20px 0" }}>
          <input
            type={type}
            className={cn(
              "floating-label w-full px-[15px] text-base border rounded-md transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 bg-white",
              isFocused ? "border-[#4A90E2] border-2" : "border-[#4A90E2] border-1",
              props.disabled && "bg-[#F9F9F9] border-[#E0E0E0]",
              "h-[40px]",
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
              "absolute left-[15px] transition-all duration-150 ease-in pointer-events-none",
              shouldFloatLabel
                ? "field-active -translate-y-[25px] text-[0.9em] text-[#4A90E2] font-medium"
                : "top-[10px] text-base text-[#676767]"
            )}
            style={{
              textShadow: shouldFloatLabel
                ? "1px 0 0 #fff, -1px 0 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff"
                : "none",
            }}
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
          "flex w-full rounded-md border bg-white px-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          isFocused ? "border-[#4A90E2] border-2" : "border-[#4A90E2] border-1",
          props.disabled && "bg-[#F9F9F9] border-[#E0E0E0]",
          "h-[40px]",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
