"use client"

import { Toaster } from "sonner"

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl",
        },
      }}
    />
  )
}
