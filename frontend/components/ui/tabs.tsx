import * as React from "react"
import { cn } from "./utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ className, value, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(value)
  React.useEffect(() => { setInternalValue(value) }, [value])
  const handleChange = (val: string) => {
    setInternalValue(val)
    onValueChange(val)
  }
  // Provide context for triggers/contents
  return (
    <TabsContext.Provider value={{ value: internalValue, onValueChange: handleChange }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = "Tabs"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}
const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex gap-2 border-b", className)} {...props} />
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}
export const TabsTrigger: React.FC<TabsTriggerProps> = ({ className, value, ...props }) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs")
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      className={cn(
        "px-4 py-2 text-sm font-medium text-primary-900 border-b-2 border-transparent focus:outline-none",
        isActive ? "border-primary-700" : "hover:border-primary-700",
        className
      )}
      aria-selected={isActive}
      onClick={() => ctx.onValueChange(value)}
      {...props}
    />
  )
}
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}
export const TabsContent: React.FC<TabsContentProps> = ({ className, value, children, ...props }) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent must be used within Tabs")
  if (ctx.value !== value) return null
  return (
    <div className={cn("py-4", className)} {...props}>{children}</div>
  )
}
TabsContent.displayName = "TabsContent"
