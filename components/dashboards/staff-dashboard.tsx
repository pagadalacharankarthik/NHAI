"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, CheckCircle, Camera, Fingerprint, Award, AlertTriangle, Calendar, Star } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface StaffDashboardProps {
  user: any
}

export function StaffDashboard({ user }: StaffDashboardProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentShift, setCurrentShift] = useState("Morning (6 AM - 2 PM)")
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [activeToilet, setActiveToilet] = useState<string | null>(null)

  const { facilities, updateFacility, createTask, addNotification } = useAppStore()

  const assignedToilets = facilities.filter((facility) => user.assignedToilets?.includes(facility.id))

  const cleaningChecklist = [
    { id: "sweep", task: "Swept floors and entrance area", completed: false },
    { id: "water", task: "Refilled water tanks and checked flow", completed: false },
    { id: "disinfect", task: "Disinfected toilets and surfaces", completed: false },
    { id: "supplies", task: "Restocked toilet paper and soap", completed: false },
    { id: "waste", task: "Emptied waste bins", completed: false },
    { id: "inspect", task: "Checked for maintenance issues", completed: false },
  ]

  const performanceHistory = [
    { date: "2024-01-15", tasksCompleted: 8, rating: 4.8, onTime: true },
    { date: "2024-01-14", tasksCompleted: 7, rating: 4.6, onTime: true },
    { date: "2024-01-13", tasksCompleted: 8, rating: 4.9, onTime: true },
    { date: "2024-01-12", tasksCompleted: 6, rating: 4.2, onTime: false },
    { date: "2024-01-11", tasksCompleted: 8, rating: 4.7, onTime: true },
  ]

  const handleBiometricLogin = () => {
    setIsCheckedIn(true)
    addNotification({
      type: "success",
      message: `Welcome ${user.name}! You have successfully checked in for ${currentShift}`,
    })
  }

  const handleTaskComplete = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId))
    } else {
      setCompletedTasks([...completedTasks, taskId])
      addNotification({
        type: "success",
        message: "Task marked as completed!",
      })
    }
  }

  const handleStartCleaning = (toiletId: string) => {
    if (!isCheckedIn) {
      addNotification({
        type: "warning",
        message: "Please check in first before starting cleaning tasks",
      })
      return
    }

    setActiveToilet(toiletId)
    updateFacility(toiletId, {
      status: "maintenance",
      lastCleaned: "In progress",
    })

    createTask({
      facilityId: toiletId,
      staffId: user.id,
      type: "cleaning",
      status: "in_progress",
      checklist: cleaningChecklist.map((item) => ({
        id: item.id,
        task: item.task,
        completed: false,
      })),
    })

    addNotification({
      type: "info",
      message: `Started cleaning task for ${toiletId}`,
    })
  }

  const handlePhotoUpload = (toiletId: string) => {
    if (!isCheckedIn) {
      addNotification({
        type: "warning",
        message: "Please check in first before uploading photos",
      })
      return
    }

    // Simulate photo upload
    addNotification({
      type: "success",
      message: "Photo uploaded successfully for verification",
    })
  }

  const handleSubmitReport = () => {
    if (activeToilet) {
      updateFacility(activeToilet, {
        status: "clean",
        lastCleaned: "Just now",
      })

      setActiveToilet(null)
      setCompletedTasks([])

      addNotification({
        type: "success",
        message: "Cleaning report submitted successfully! Great work!",
      })
    }
  }

  const getCompletionPercentage = () => {
    return Math.round((completedTasks.length / cleaningChecklist.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Badge variant={isCheckedIn ? "default" : "secondary"}>{isCheckedIn ? "Checked In" : "Not Checked In"}</Badge>
      </div>

      {/* Attendance Section */}
      {!isCheckedIn && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fingerprint className="h-5 w-5" />
              <span>Biometric Attendance</span>
            </CardTitle>
            <CardDescription>Please mark your attendance to start your shift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Current Shift: {currentShift}</p>
                <p className="text-xs text-muted-foreground">Tap the fingerprint scanner to check in</p>
              </div>
              <Button onClick={handleBiometricLogin} className="flex items-center space-x-2">
                <Fingerprint className="h-4 w-4" />
                <span>Scan Fingerprint</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
          <TabsTrigger value="checklist">Cleaning Checklist</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedToilets.map((toilet) => (
              <Card key={toilet.id} className={toilet.priority === "high" ? "border-red-200 bg-red-50" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{toilet.name}</CardTitle>
                    <Badge variant={toilet.status === "clean" ? "default" : "secondary"}>
                      {toilet.status === "clean"
                        ? "Completed"
                        : toilet.status === "maintenance"
                          ? "In Progress"
                          : "Pending"}
                    </Badge>
                  </div>
                  <CardDescription>ID: {toilet.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last cleaned: {toilet.lastCleaned}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Priority: {toilet.priority}</span>
                      {toilet.priority === "high" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        disabled={!isCheckedIn || toilet.status === "clean"}
                        className="flex-1"
                        onClick={() => handleStartCleaning(toilet.id)}
                      >
                        {toilet.status === "clean"
                          ? "Completed"
                          : toilet.status === "maintenance"
                            ? "In Progress"
                            : "Start Cleaning"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePhotoUpload(toilet.id)}
                        disabled={!isCheckedIn}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cleaning Checklist</CardTitle>
                  <CardDescription>Complete all tasks for thorough cleaning</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <Progress value={getCompletionPercentage()} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cleaningChecklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={item.id}
                      checked={completedTasks.includes(item.id)}
                      onCheckedChange={() => handleTaskComplete(item.id)}
                      disabled={!isCheckedIn}
                    />
                    <label
                      htmlFor={item.id}
                      className={`flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        completedTasks.includes(item.id) ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.task}
                    </label>
                    {completedTasks.includes(item.id) && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                ))}
              </div>

              {getCompletionPercentage() === 100 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">All tasks completed!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Great work! You can now submit your cleaning report.</p>
                  <Button className="mt-2" size="sm" onClick={handleSubmitReport}>
                    Submit Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
                <CardDescription>Performance summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="font-bold">37</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.6</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">On-Time Rate</span>
                    <span className="font-bold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rewards Points</CardTitle>
                <CardDescription>Earn points for good performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1,240</div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <Badge variant="secondary" className="mt-2">
                    <Award className="h-3 w-3 mr-1" />
                    Silver Level
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Goal</CardTitle>
                <CardDescription>Progress to next level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Gold</span>
                    <span>760/1000</span>
                  </div>
                  <Progress value={76} />
                  <p className="text-xs text-muted-foreground">240 points to go</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Your work history over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceHistory.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{day.tasksCompleted} tasks completed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{day.rating}</span>
                      </div>
                      <Badge variant={day.onTime ? "default" : "secondary"}>{day.onTime ? "On Time" : "Late"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
