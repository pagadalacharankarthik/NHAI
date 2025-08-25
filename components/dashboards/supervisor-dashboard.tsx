"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertTriangle, Eye, Camera, Users, FileText, TrendingUp, MapPin } from "lucide-react"
import { IoTMonitoring } from "@/components/iot/iot-monitoring"

interface SupervisorDashboardProps {
  user: any
}

export function SupervisorDashboard({ user }: SupervisorDashboardProps) {
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)
  const [inspectionNotes, setInspectionNotes] = useState("")

  const pendingInspections = [
    {
      id: "NH1_KM45",
      location: "NH1 KM 45 - Delhi",
      staffName: "Rajesh Kumar",
      completedAt: "2 hours ago",
      status: "pending_review",
      iotData: { odor: "low", water: "flowing", door: "open" },
      staffReport: "Completed all cleaning tasks, restocked supplies",
    },
    {
      id: "NH8_KM23",
      location: "NH8 KM 23 - Jaipur",
      staffName: "Amit Singh",
      completedAt: "4 hours ago",
      status: "needs_attention",
      iotData: { odor: "high", water: "low", door: "open" },
      staffReport: "Cleaned facility, noted water pressure issue",
    },
  ]

  const staffPerformance = [
    {
      name: "Rajesh Kumar",
      id: "STAFF_001",
      assignedFacilities: 2,
      completionRate: 95,
      avgRating: 4.8,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      name: "Amit Singh",
      id: "STAFF_002",
      assignedFacilities: 2,
      completionRate: 87,
      avgRating: 4.2,
      lastActive: "4 hours ago",
      status: "active",
    },
    {
      name: "Pradeep Sharma",
      id: "STAFF_003",
      assignedFacilities: 1,
      completionRate: 92,
      avgRating: 4.6,
      lastActive: "1 hour ago",
      status: "active",
    },
  ]

  const auditTrail = [
    {
      timestamp: "2024-01-15 14:30",
      action: "Inspection Approved",
      facility: "NH1_KM67",
      staff: "Rajesh Kumar",
      supervisor: "Priya Sharma",
      notes: "Facility meets all hygiene standards",
    },
    {
      timestamp: "2024-01-15 13:15",
      action: "Report Rejected",
      facility: "NH8_KM23",
      staff: "Amit Singh",
      supervisor: "Priya Sharma",
      notes: "Water issue not properly addressed",
    },
    {
      timestamp: "2024-01-15 11:45",
      action: "Inspection Completed",
      facility: "NH2_KM89",
      staff: "Pradeep Sharma",
      supervisor: "Priya Sharma",
      notes: "Excellent cleaning standards maintained",
    },
  ]

  const handleInspectionAction = (inspectionId: string, action: "approve" | "reject") => {
    console.log(`${action} inspection for ${inspectionId}`)
    // In real app, this would update the backend
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_review":
        return "bg-yellow-100 text-yellow-800"
      case "needs_attention":
        return "bg-red-100 text-red-800"
      case "approved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIoTStatusIcon = (value: string, type: string) => {
    if (type === "odor") {
      return value === "low" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      )
    }
    if (type === "water") {
      return value === "flowing" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      )
    }
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">
          Area: {user.assignedArea} • Welcome back, {user.name}
        </p>
      </div>

      <Tabs defaultValue="inspections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inspections">Pending Inspections</TabsTrigger>
          <TabsTrigger value="iot">IoT Monitoring</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="verification">Cross Verification</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingInspections.map((inspection) => (
              <Card key={inspection.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{inspection.location}</CardTitle>
                    <Badge className={getStatusColor(inspection.status)}>{inspection.status.replace("_", " ")}</Badge>
                  </div>
                  <CardDescription>
                    Staff: {inspection.staffName} • Completed: {inspection.completedAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Staff Report</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{inspection.staffReport}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">IoT Sensor Data</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2 text-sm">
                        {getIoTStatusIcon(inspection.iotData.odor, "odor")}
                        <span>Odor: {inspection.iotData.odor}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        {getIoTStatusIcon(inspection.iotData.water, "water")}
                        <span>Water: {inspection.iotData.water}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        {getIoTStatusIcon(inspection.iotData.door, "door")}
                        <span>Door: {inspection.iotData.door}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleInspectionAction(inspection.id, "approve")}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInspectionAction(inspection.id, "reject")}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Inspection Notes</CardTitle>
              <CardDescription>Record your inspection findings and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility to inspect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NH1_KM45">NH1 KM 45 - Delhi</SelectItem>
                  <SelectItem value="NH8_KM23">NH8 KM 23 - Jaipur</SelectItem>
                  <SelectItem value="NH2_KM89">NH2 KM 89 - Agra</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Enter your inspection notes, observations, and recommendations..."
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Inspection
                </Button>
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-4">
          <IoTMonitoring facilityIds={["NH1_KM45", "NH8_KM23"]} showDetailedView={true} />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Staff</CardTitle>
                <CardDescription>Currently on duty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Out of 5 total staff</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg Completion Rate</CardTitle>
                <CardDescription>This week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">91%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Reviews</CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <p className="text-xs text-muted-foreground">Inspection reports</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Overview</CardTitle>
              <CardDescription>Monitor individual staff member performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{staff.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {staff.id} • {staff.assignedFacilities} facilities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{staff.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{staff.avgRating}</div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center">
                        <Badge variant={staff.status === "active" ? "default" : "secondary"}>{staff.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{staff.lastActive}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IoT Data vs Staff Reports</CardTitle>
              <CardDescription>Cross-verify sensor data with staff cleaning reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInspections.map((inspection) => (
                  <div key={inspection.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{inspection.location}</h3>
                      <Badge variant="outline">{inspection.staffName}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">IoT Sensor Reading</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Odor Level:</span>
                            <span className={inspection.iotData.odor === "low" ? "text-green-600" : "text-red-600"}>
                              {inspection.iotData.odor}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Water Flow:</span>
                            <span
                              className={inspection.iotData.water === "flowing" ? "text-green-600" : "text-yellow-600"}
                            >
                              {inspection.iotData.water}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Door Status:</span>
                            <span className="text-green-600">{inspection.iotData.door}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Staff Report</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{inspection.staffReport}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {inspection.iotData.odor === "low" && inspection.iotData.water === "flowing" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm">
                          {inspection.iotData.odor === "low" && inspection.iotData.water === "flowing"
                            ? "Data matches staff report"
                            : "Discrepancy detected"}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete history of inspections and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditTrail.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{entry.action}</h4>
                        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {entry.facility} • Staff: {entry.staff}
                      </p>
                      <p className="text-sm mt-1">{entry.notes}</p>
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
