import * as React from "react"
import { cn } from "./utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, max = 100, ...props }, ref) => (
  <div ref={ref} className={cn("w-full h-2 bg-gray-200 rounded-full", className)} {...props}>
    <div
      className="h-2 bg-primary-700 rounded-full transition-all"
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
))
Progress.displayName = "Progress"
