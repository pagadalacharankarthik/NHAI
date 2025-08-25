"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface ToastProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  onClose: (id: string) => void
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg shadow-lg animate-in slide-in-from-right-full",
        getToastStyles(),
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <Button variant="ghost" size="sm" onClick={() => onClose(id)} className="h-6 w-6 p-0 hover:bg-transparent">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function ToastContainer() {
  const { notifications, removeNotification } = useAppStore()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}
