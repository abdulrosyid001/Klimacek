// Dummy useToast hook for shadcn/ui compatibility
export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description?: string }) => {
      if (typeof window !== 'undefined') {
        window.alert(`${title}${description ? ': ' + description : ''}`)
      }
    }
  }
}
