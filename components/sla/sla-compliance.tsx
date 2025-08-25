"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Target,
  Award,
  DollarSign,
} from "lucide-react"

interface SLAMetrics {
  facilityId: string
  facilityName: string
  contractor: string
  overallScore: number
  metrics: {
    cleaningFrequency: number // % of scheduled cleanings completed
    responseTime: number // % of issues resolved within SLA time
    userSatisfaction: number // % positive feedback
    iotCompliance: number // % time sensors show acceptable levels
    staffAttendance: number // % attendance rate
    supervisorApproval: number // % reports approved without issues
  }
  penalties: number
  rewards: number
  slaBreaches: Array<{
    type: string
    description: string
    timestamp: string
    severity: "low" | "medium" | "high"
  }>
  trend: "up" | "down" | "stable"
}

interface SLAComplianceProps {
  facilityIds?: string[]
  showDetailedView?: boolean
}

export function SLACompliance({ facilityIds, showDetailedView = true }: SLAComplianceProps) {
  const [slaData, setSlaData] = useState<SLAMetrics[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("current_month")
  const [selectedContractor, setSelectedContractor] = useState("all")

  // Generate mock SLA data
  const generateSLAData = (): SLAMetrics[] => {
    const facilities = [
      { id: "NH1_KM45", name: "NH1 KM 45 - Delhi", contractor: "CleanTech Services" },
      { id: "NH1_KM67", name: "NH1 KM 67 - Gurgaon", contractor: "HygieneMax Ltd" },
      { id: "NH8_KM23", name: "NH8 KM 23 - Jaipur", contractor: "CleanTech Services" },
      { id: "NH2_KM89", name: "NH2 KM 89 - Agra", contractor: "SanitaryPro" },
      { id: "NH4_KM12", name: "NH4 KM 12 - Mumbai", contractor: "HygieneMax Ltd" },
    ]

    return facilities
      .filter((facility) => !facilityIds || facilityIds.includes(facility.id))
      .map((facility) => {
        const cleaningFreq = 75 + Math.floor(Math.random() * 25) // 75-100%
        const responseTime = 70 + Math.floor(Math.random() * 30) // 70-100%
        const userSatisfaction = 65 + Math.floor(Math.random() * 35) // 65-100%
        const iotCompliance = 80 + Math.floor(Math.random() * 20) // 80-100%
        const staffAttendance = 85 + Math.floor(Math.random() * 15) // 85-100%
        const supervisorApproval = 70 + Math.floor(Math.random() * 30) // 70-100%

        const overallScore = Math.round(
          cleaningFreq * 0.25 +
            responseTime * 0.2 +
            userSatisfaction * 0.2 +
            iotCompliance * 0.15 +
            staffAttendance * 0.1 +
            supervisorApproval * 0.1,
        )

        const penalties =
          overallScore < 70
            ? Math.floor(Math.random() * 5000) + 1000
            : overallScore < 90
              ? Math.floor(Math.random() * 2000)
              : 0
        const rewards = overallScore > 90 ? Math.floor(Math.random() * 3000) + 1000 : 0

        const breaches = []
        if (cleaningFreq < 80) {
          breaches.push({
            type: "Cleaning Frequency",
            description: "Below minimum cleaning frequency requirement",
            timestamp: new Date().toISOString(),
            severity: "medium" as const,
          })
        }
        if (responseTime < 75) {
          breaches.push({
            type: "Response Time",
            description: "Delayed response to maintenance issues",
            timestamp: new Date().toISOString(),
            severity: "high" as const,
          })
        }
        if (userSatisfaction < 70) {
          breaches.push({
            type: "User Satisfaction",
            description: "Below acceptable user satisfaction threshold",
            timestamp: new Date().toISOString(),
            severity: "medium" as const,
          })
        }

        const trend = Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "stable" : "down"

        return {
          facilityId: facility.id,
          facilityName: facility.name,
          contractor: facility.contractor,
          overallScore,
          metrics: {
            cleaningFrequency: cleaningFreq,
            responseTime,
            userSatisfaction,
            iotCompliance,
            staffAttendance,
            supervisorApproval,
          },
          penalties,
          rewards,
          slaBreaches: breaches,
          trend,
        }
      })
  }

  useEffect(() => {
    setSlaData(generateSLAData())
  }, [facilityIds, selectedPeriod])

  const getSLAStatus = (score: number) => {
    if (score >= 90) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle }
    if (score >= 70) return { status: "Good", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertTriangle }
    return { status: "Poor", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getContractorSummary = () => {
    const contractors = slaData.reduce((acc, facility) => {
      if (!acc[facility.contractor]) {
        acc[facility.contractor] = {
          name: facility.contractor,
          facilities: 0,
          avgScore: 0,
          totalPenalties: 0,
          totalRewards: 0,
          breaches: 0,
        }
      }
      acc[facility.contractor].facilities += 1
      acc[facility.contractor].avgScore += facility.overallScore
      acc[facility.contractor].totalPenalties += facility.penalties
      acc[facility.contractor].totalRewards += facility.rewards
      acc[facility.contractor].breaches += facility.slaBreaches.length
      return acc
    }, {} as any)

    return Object.values(contractors).map((contractor: any) => ({
      ...contractor,
      avgScore: Math.round(contractor.avgScore / contractor.facilities),
    }))
  }

  const generateSLAReport = () => {
    // In real app, this would generate and download a PDF report
    console.log("Generating SLA Report for period:", selectedPeriod)
    alert("SLA Report generated successfully! Download will start shortly.")
  }

  if (!showDetailedView) {
    // Compact view for embedding in other dashboards
    return (
      <div className="space-y-3">
        {slaData.map((facility) => {
          const slaStatus = getSLAStatus(facility.overallScore)
          const StatusIcon = slaStatus.icon
          return (
            <div key={facility.facilityId} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`h-4 w-4 ${slaStatus.color}`} />
                <div>
                  <h4 className="font-medium text-sm">{facility.facilityName}</h4>
                  <p className="text-xs text-muted-foreground">{facility.contractor}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold">{facility.overallScore}%</div>
                  <p className="text-xs text-muted-foreground">SLA Score</p>
                </div>
                <Badge className={slaStatus.bgColor + " " + slaStatus.color} variant="outline">
                  {slaStatus.status}
                </Badge>
                {getTrendIcon(facility.trend)}
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
          <h2 className="text-2xl font-bold">SLA Compliance Dashboard</h2>
          <p className="text-muted-foreground">Service Level Agreement monitoring and contractor accountability</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateSLAReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average SLA Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(slaData.reduce((sum, f) => sum + f.overallScore, 0) / slaData.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {slaData.reduce((sum, f) => sum + f.slaBreaches.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Active violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{slaData.reduce((sum, f) => sum + f.penalties, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{slaData.reduce((sum, f) => sum + f.rewards, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Performance bonuses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="facilities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="facilities">Facility Scores</TabsTrigger>
          <TabsTrigger value="contractors">Contractor Performance</TabsTrigger>
          <TabsTrigger value="breaches">SLA Breaches</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {slaData.map((facility) => {
              const slaStatus = getSLAStatus(facility.overallScore)
              const StatusIcon = slaStatus.icon
              return (
                <Card key={facility.facilityId} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{facility.facilityName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(facility.trend)}
                        <Badge className={slaStatus.bgColor + " " + slaStatus.color} variant="outline">
                          {slaStatus.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>Contractor: {facility.contractor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{facility.overallScore}%</div>
                      <Progress value={facility.overallScore} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">Overall SLA Score</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cleaning Freq:</span>
                          <span className="font-medium">{facility.metrics.cleaningFrequency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className="font-medium">{facility.metrics.responseTime}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>User Satisfaction:</span>
                          <span className="font-medium">{facility.metrics.userSatisfaction}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>IoT Compliance:</span>
                          <span className="font-medium">{facility.metrics.iotCompliance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Staff Attendance:</span>
                          <span className="font-medium">{facility.metrics.staffAttendance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supervisor Approval:</span>
                          <span className="font-medium">{facility.metrics.supervisorApproval}%</span>
                        </div>
                      </div>
                    </div>

                    {(facility.penalties > 0 || facility.rewards > 0) && (
                      <div className="flex justify-between pt-2 border-t">
                        {facility.penalties > 0 && (
                          <div className="text-red-600">
                            <span className="text-sm">Penalties: ₹{facility.penalties.toLocaleString()}</span>
                          </div>
                        )}
                        {facility.rewards > 0 && (
                          <div className="text-green-600">
                            <span className="text-sm">Rewards: ₹{facility.rewards.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  {facility.slaBreaches.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="text-xs">
                        {facility.slaBreaches.length} breach{facility.slaBreaches.length > 1 ? "es" : ""}
                      </Badge>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Performance Scorecard</CardTitle>
              <CardDescription>Consolidated performance metrics by contractor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getContractorSummary().map((contractor, index) => {
                  const slaStatus = getSLAStatus(contractor.avgScore)
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold">{contractor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{contractor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contractor.facilities} facilities • {contractor.breaches} breaches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{contractor.avgScore}%</div>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            ₹{contractor.totalPenalties.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">Penalties</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            ₹{contractor.totalRewards.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">Rewards</p>
                        </div>
                        <Badge className={slaStatus.bgColor + " " + slaStatus.color} variant="outline">
                          {slaStatus.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active SLA Breaches</CardTitle>
              <CardDescription>Violations requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slaData.flatMap((facility) =>
                  facility.slaBreaches.map((breach, index) => (
                    <div
                      key={`${facility.facilityId}-${index}`}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <AlertTriangle
                        className={`h-4 w-4 mt-0.5 ${
                          breach.severity === "high"
                            ? "text-red-600"
                            : breach.severity === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{facility.facilityName}</h4>
                          <Badge
                            variant={
                              breach.severity === "high"
                                ? "destructive"
                                : breach.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {breach.severity} severity
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-red-600 mt-1">{breach.type}</p>
                        <p className="text-sm text-muted-foreground">{breach.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">Contractor: {facility.contractor}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(breach.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )),
                )}
                {slaData.every((facility) => facility.slaBreaches.length === 0) && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No active SLA breaches - all facilities meeting requirements
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {slaData.map((facility) => (
            <Card key={facility.facilityId}>
              <CardHeader>
                <CardTitle>{facility.facilityName}</CardTitle>
                <CardDescription>Detailed performance metrics breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cleaning Frequency</span>
                      <span className="text-sm">{facility.metrics.cleaningFrequency}%</span>
                    </div>
                    <Progress value={facility.metrics.cleaningFrequency} className="h-2" />
                    <p className="text-xs text-muted-foreground">Scheduled cleanings completed on time</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm">{facility.metrics.responseTime}%</span>
                    </div>
                    <Progress value={facility.metrics.responseTime} className="h-2" />
                    <p className="text-xs text-muted-foreground">Issues resolved within SLA timeframe</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">User Satisfaction</span>
                      <span className="text-sm">{facility.metrics.userSatisfaction}%</span>
                    </div>
                    <Progress value={facility.metrics.userSatisfaction} className="h-2" />
                    <p className="text-xs text-muted-foreground">Positive citizen feedback rating</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">IoT Compliance</span>
                      <span className="text-sm">{facility.metrics.iotCompliance}%</span>
                    </div>
                    <Progress value={facility.metrics.iotCompliance} className="h-2" />
                    <p className="text-xs text-muted-foreground">Time sensors show acceptable levels</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Staff Attendance</span>
                      <span className="text-sm">{facility.metrics.staffAttendance}%</span>
                    </div>
                    <Progress value={facility.metrics.staffAttendance} className="h-2" />
                    <p className="text-xs text-muted-foreground">Staff attendance rate</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Supervisor Approval</span>
                      <span className="text-sm">{facility.metrics.supervisorApproval}%</span>
                    </div>
                    <Progress value={facility.metrics.supervisorApproval} className="h-2" />
                    <p className="text-xs text-muted-foreground">Reports approved without issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
