import * as React from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Input } from "./input";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    React.useEffect(() => {
      if (value !== undefined && !isNaN(value)) {
        setDisplayValue(formatCurrency(value));
      } else {
        setDisplayValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
      onChange(numericValue);
      setDisplayValue(formatCurrency(numericValue));
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={cn("font-mono font-medium", className)}
        placeholder="Rp0"
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
