import * as React from "react"
import { cn } from "./utils"

export const Tabs: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
)
Tabs.displayName = "Tabs"

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex gap-2 border-b", className)} {...props} />
)
TabsList.displayName = "TabsList"

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cn("px-4 py-2 text-sm font-medium text-primary-900 border-b-2 border-transparent hover:border-primary-700 focus:outline-none", className)} {...props} />
)
TabsTrigger.displayName = "TabsTrigger"

export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("py-4", className)} {...props} />
)
TabsContent.displayName = "TabsContent"
