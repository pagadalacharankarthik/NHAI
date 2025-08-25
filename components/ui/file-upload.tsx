"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
  children?: React.ReactNode
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  acceptedTypes = ["image/*"],
  className,
  children,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const newFiles = [...selectedFiles, ...files].slice(0, maxFiles)
    setSelectedFiles(newFiles)

    // Generate previews for images
    const newPreviews = [...previews]
    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews[selectedFiles.length + index] = e.target?.result as string
          setPreviews([...newPreviews])
        }
        reader.readAsDataURL(file)
      }
    })

    onFilesSelected(newFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
    onFilesSelected(newFiles)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {children ? (
        <div onClick={triggerFileSelect} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={triggerFileSelect} className="w-full bg-transparent">
          <Camera className="h-4 w-4 mr-2" />
          Add Photos ({selectedFiles.length}/{maxFiles})
        </Button>
      )}

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              {previews[index] ? (
                <img
                  src={previews[index] || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-20 bg-muted rounded-lg border flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
