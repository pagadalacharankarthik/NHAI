"use client"

import { useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { StaffDashboard } from "@/components/dashboards/staff-dashboard"
import { SupervisorDashboard } from "@/components/dashboards/supervisor-dashboard"
import { CitizenPortal } from "@/components/dashboards/citizen-portal"
import { ToastContainer } from "@/components/ui/toast"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const { user, isAuthenticated, generateMockData } = useAppStore()

  useEffect(() => {
    generateMockData()
  }, [generateMockData])

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <ToastContainer />
      </>
    )
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard user={user} />
      case "staff":
        return <StaffDashboard user={user} />
      case "supervisor":
        return <SupervisorDashboard user={user} />
      case "citizen":
        return <CitizenPortal user={user} />
      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto px-6 py-6">{renderDashboard()}</main>
      <ToastContainer />
    </div>
  )
}
