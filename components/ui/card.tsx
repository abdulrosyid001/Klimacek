import * as React from "react"
import { cn } from "./utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-white text-primary-900 shadow", className)} {...props} />
))
Card.displayName = "Card"

export { Card }

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-4 border-b", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

export const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-bold", className)} {...props} />
)
CardTitle.displayName = "CardTitle"

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-4", className)} {...props} />
)
CardContent.displayName = "CardContent"

export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
)
CardDescription.displayName = "CardDescription"
