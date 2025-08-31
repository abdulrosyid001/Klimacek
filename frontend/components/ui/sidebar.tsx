import * as React from "react"
import { cn } from "./utils"

export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <aside className={cn("w-64 bg-primary-900 text-white flex flex-col py-8 px-4 rounded-2xl shadow-lg", className)} {...props} />
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("mb-10 text-2xl font-bold tracking-wide text-center", className)} {...props} />
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <nav className={cn("flex-1 flex flex-col gap-4", className)} {...props} />
)
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = SidebarContent
export const SidebarGroupLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("text-lg font-semibold mb-2", className)} {...props} />
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = SidebarContent
export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ className, ...props }) => (
  <ul className={cn("flex flex-col gap-2", className)} {...props} />
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => (
  <li className={cn("", className)} {...props} />
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold transition-colors hover:bg-primary-800", className)} {...props} />
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
export const SidebarTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button className={cn("mr-2", className)} {...props} />
)
SidebarTrigger.displayName = "SidebarTrigger"
export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("border-t border-gray-200 p-4", className)} {...props} />
)
SidebarFooter.displayName = "SidebarFooter"
export const SidebarInset: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex-1", className)} {...props} />
)
SidebarInset.displayName = "SidebarInset"
