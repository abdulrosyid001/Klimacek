import * as React from "react"
import { cn } from "./utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary"
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
      variant === "default"
        ? "bg-primary-700 text-white"
        : "bg-gray-200 text-primary-900",
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"
