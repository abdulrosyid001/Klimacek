import * as React from "react"
import { cn } from "./utils"

export const DropdownMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("relative", className)} {...props} />
)
DropdownMenu.displayName = "DropdownMenu"

export const DropdownMenuTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cn("", className)} {...props} />
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", className)} {...props} />
)
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("px-4 py-2 text-sm font-semibold text-gray-700", className)} {...props} />
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export const DropdownMenuSeparator: React.FC = () => (
  <div className="border-t border-gray-200 my-1" />
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export const DropdownMenuItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer", className)} {...props} />
)
DropdownMenuItem.displayName = "DropdownMenuItem"
