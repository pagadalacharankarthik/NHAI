"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Droplets,
  Wind,
  DoorOpen,
  Users,
  Thermometer,
  Battery,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
} from "lucide-react"

interface IoTData {
  facilityId: string
  facilityName: string
  sensors: {
    odorLevel: number // 0-100 (0 = fresh, 100 = very bad)
    waterFlow: boolean
    doorStatus: "open" | "locked" | "maintenance"
    occupancyCount: number
    temperature: number
    humidity: number
    batteryLevel: number
    signalStrength: number
    lastUpdate: string
  }
  alerts: Array<{
    type: "warning" | "critical" | "info"
    message: string
    timestamp: string
  }>
}

interface IoTMonitoringProps {
  facilityIds?: string[]
  showDetailedView?: boolean
}

export function IoTMonitoring({ facilityIds, showDetailedView = true }: IoTMonitoringProps) {
  const [iotData, setIoTData] = useState<IoTData[]>([])
  const [isLive, setIsLive] = useState(true)

  // Simulate IoT data
  const generateMockData = (): IoTData[] => {
    const facilities = [
      { id: "NH1_KM45", name: "NH1 KM 45 - Delhi" },
      { id: "NH1_KM67", name: "NH1 KM 67 - Gurgaon" },
      { id: "NH8_KM23", name: "NH8 KM 23 - Jaipur" },
      { id: "NH2_KM89", name: "NH2 KM 89 - Agra" },
      { id: "NH4_KM12", name: "NH4 KM 12 - Mumbai" },
    ]

    return facilities
      .filter((facility) => !facilityIds || facilityIds.includes(facility.id))
      .map((facility) => {
        const now = new Date()
        const odorLevel = Math.floor(Math.random() * 100)
        const waterFlow = Math.random() > 0.1 // 90% chance of water flowing
        const doorStatus = Math.random() > 0.05 ? "open" : Math.random() > 0.5 ? "locked" : "maintenance"
        const occupancyCount = Math.floor(Math.random() * 50)
        const temperature = 20 + Math.floor(Math.random() * 15) // 20-35°C
        const humidity = 40 + Math.floor(Math.random() * 40) // 40-80%
        const batteryLevel = 60 + Math.floor(Math.random() * 40) // 60-100%
        const signalStrength = 70 + Math.floor(Math.random() * 30) // 70-100%

        const alerts = []
        if (odorLevel > 70) {
          alerts.push({
            type: "critical" as const,
            message: "High odor level detected - immediate cleaning required",
            timestamp: now.toISOString(),
          })
        }
        if (!waterFlow) {
          alerts.push({
            type: "warning" as const,
            message: "Water flow interrupted - check plumbing",
            timestamp: now.toISOString(),
          })
        }
        if (batteryLevel < 20) {
          alerts.push({
            type: "warning" as const,
            message: "Low battery level - maintenance required",
            timestamp: now.toISOString(),
          })
        }

        return {
          facilityId: facility.id,
          facilityName: facility.name,
          sensors: {
            odorLevel,
            waterFlow,
            doorStatus,
            occupancyCount,
            temperature,
            humidity,
            batteryLevel,
            signalStrength,
            lastUpdate: now.toISOString(),
          },
          alerts,
        }
      })
  }

  useEffect(() => {
    // Initial data load
    setIoTData(generateMockData())

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        setIoTData(generateMockData())
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [facilityIds, isLive])

  const getOdorStatus = (level: number) => {
    if (level < 30) return { status: "Fresh", color: "text-green-600", bgColor: "bg-green-100" }
    if (level < 60) return { status: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { status: "Poor", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const getDoorStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <DoorOpen className="h-4 w-4 text-green-600" />
      case "locked":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <DoorOpen className="h-4 w-4 text-gray-600" />
    }
  }

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return <Wifi className="h-4 w-4 text-green-600" />
    if (strength > 50) return <Wifi className="h-4 w-4 text-yellow-600" />
    return <Wifi className="h-4 w-4 text-red-600" />
  }

  if (!showDetailedView) {
    // Compact view for embedding in other dashboards
    return (
      <div className="space-y-3">
        {iotData.map((facility) => {
          const odorStatus = getOdorStatus(facility.sensors.odorLevel)
          return (
            <div key={facility.facilityId} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-4 w-4 text-primary" />
                <div>
                  <h4 className="font-medium text-sm">{facility.facilityName}</h4>
                  <p className="text-xs text-muted-foreground">
                    Last update: {new Date(facility.sensors.lastUpdate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Wind className="h-3 w-3" />
                  <Badge className={odorStatus.bgColor + " " + odorStatus.color} variant="outline">
                    {odorStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Droplets className={`h-3 w-3 ${facility.sensors.waterFlow ? "text-blue-600" : "text-red-600"}`} />
                  <span className="text-xs">{facility.sensors.waterFlow ? "Flow OK" : "No Flow"}</span>
                </div>
                {getDoorStatusIcon(facility.sensors.doorStatus)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">IoT Sensor Monitoring</h2>
          <p className="text-muted-foreground">Real-time facility monitoring and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={isLive ? "default" : "outline"} size="sm" onClick={() => setIsLive(!isLive)}>
            <Activity className={`h-4 w-4 mr-2 ${isLive ? "animate-pulse" : ""}`} />
            {isLive ? "Live" : "Paused"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {iotData.map((facility) => {
              const odorStatus = getOdorStatus(facility.sensors.odorLevel)
              return (
                <Card key={facility.facilityId} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{facility.facilityName}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {getSignalIcon(facility.sensors.signalStrength)}
                        <Badge variant="outline" className="text-xs">
                          {facility.sensors.signalStrength}%
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Last update: {new Date(facility.sensors.lastUpdate).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Odor Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="h-4 w-4" />
                          <span className="text-sm font-medium">Air Quality</span>
                        </div>
                        <Badge className={odorStatus.bgColor + " " + odorStatus.color} variant="outline">
                          {odorStatus.status}
                        </Badge>
                      </div>
                      <Progress value={100 - facility.sensors.odorLevel} className="h-2" />
                    </div>

                    {/* Water Flow */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4" />
                        <span className="text-sm font-medium">Water Flow</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {facility.sensors.waterFlow ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{facility.sensors.waterFlow ? "Active" : "Stopped"}</span>
                      </div>
                    </div>

                    {/* Door Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDoorStatusIcon(facility.sensors.doorStatus)}
                        <span className="text-sm font-medium">Access</span>
                      </div>
                      <Badge
                        variant={
                          facility.sensors.doorStatus === "open"
                            ? "default"
                            : facility.sensors.doorStatus === "locked"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {facility.sensors.doorStatus}
                      </Badge>
                    </div>

                    {/* Occupancy */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Usage Today</span>
                      </div>
                      <span className="text-sm font-bold">{facility.sensors.occupancyCount}</span>
                    </div>

                    {/* Battery Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4" />
                          <span className="text-sm font-medium">Battery</span>
                        </div>
                        <span className="text-sm">{facility.sensors.batteryLevel}%</span>
                      </div>
                      <Progress value={facility.sensors.batteryLevel} className="h-2" />
                    </div>
                  </CardContent>
                  {facility.alerts.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="text-xs">
                        {facility.alerts.length}
                      </Badge>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {iotData.map((facility) => (
            <Card key={facility.facilityId}>
              <CardHeader>
                <CardTitle>{facility.facilityName}</CardTitle>
                <CardDescription>Detailed sensor readings and environmental data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    <div className="text-2xl font-bold">{facility.sensors.temperature}°C</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold">{facility.sensors.humidity}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Daily Usage</span>
                    </div>
                    <div className="text-2xl font-bold">{facility.sensors.occupancyCount}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Power Status</span>
                    </div>
                    <div className="text-2xl font-bold">Online</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Critical notifications requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {iotData.flatMap((facility) =>
                  facility.alerts.map((alert, index) => (
                    <div
                      key={`${facility.facilityId}-${index}`}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <AlertTriangle
                        className={`h-4 w-4 mt-0.5 ${
                          alert.type === "critical"
                            ? "text-red-600"
                            : alert.type === "warning"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{facility.facilityName}</h4>
                          <Badge
                            variant={
                              alert.type === "critical"
                                ? "destructive"
                                : alert.type === "warning"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )),
                )}
                {iotData.every((facility) => facility.alerts.length === 0) && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">No active alerts - all systems operating normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
