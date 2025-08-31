import * as React from "react"
import { cn } from "./utils"

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, options, value, onValueChange, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
      className
    )}
    value={value}
    onChange={e => onValueChange(e.target.value)}
    {...props}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
))
Select.displayName = "Select"
