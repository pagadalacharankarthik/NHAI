"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

type UserRole = "admin" | "staff" | "supervisor" | "citizen"

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAppStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would call an API
    const mockUserData = {
      admin: {
        id: "admin_001",
        name: "NHAI Administrator",
        role: "admin" as const,
        department: "National Highways Authority of India",
        permissions: ["view_all", "manage_staff", "generate_reports", "system_config"],
      },
      staff: {
        id: "staff_001",
        name: "Rajesh Kumar",
        role: "staff" as const,
        assignedToilets: ["NH1_KM45", "NH1_KM67"],
        shift: "Morning (6 AM - 2 PM)",
        permissions: ["mark_attendance", "update_cleaning_status", "upload_photos"],
      },
      supervisor: {
        id: "supervisor_001",
        name: "Priya Sharma",
        role: "supervisor" as const,
        assignedArea: "NH1 Delhi-Mumbai Corridor",
        permissions: ["inspect_toilets", "verify_staff_work", "approve_reports"],
      },
      citizen: {
        id: "citizen_001",
        name: "Anonymous User",
        role: "citizen" as const,
        permissions: ["submit_feedback", "view_toilet_status"],
      },
    }

    login(selectedRole, mockUserData[selectedRole])
    setIsLoading(false)
  }

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      admin: "NHAI Officials & Government Administrators",
      staff: "Cleaning Staff & Maintenance Workers",
      supervisor: "Field Supervisors & Inspectors",
      citizen: "Public Users & Travelers",
    }
    return descriptions[role]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">NH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">NHAI</h1>
              <p className="text-xs text-muted-foreground">Toilet Monitoring System</p>
            </div>
          </div>
          <CardTitle>Secure Login</CardTitle>
          <CardDescription>Access the Smart Toilet Maintenance Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Admin</Badge>
                      <span>NHAI Administrator</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="staff">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Staff</Badge>
                      <span>Cleaning Staff</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="supervisor">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Supervisor</Badge>
                      <span>Field Supervisor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="citizen">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Citizen</Badge>
                      <span>Public User</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{getRoleDescription(selectedRole)}</p>
            </div>

            {selectedRole !== "citizen" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username / Employee ID</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your credentials"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Signing in..."
                : selectedRole === "citizen"
                  ? "Continue as Public User"
                  : "Login to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">Government of India • Ministry of Road Transport & Highways</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
