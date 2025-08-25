"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  TrendingUp,
  Download,
  Calendar,
  Activity,
  Target,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { IoTMonitoring } from "@/components/iot/iot-monitoring"
import { SLACompliance } from "@/components/sla/sla-compliance"

interface AdminDashboardProps {
  user: any
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  // Mock data for demonstration
  const toiletStats = {
    total: 5,
    clean: 3,
    dirty: 1,
    locked: 1,
    iot: 5,
    slaCompliant: 4,
  }

  const mockToilets = [
    {
      id: "NH1_KM45",
      location: "NH1 KM 45 - Delhi",
      status: "clean",
      lastCleaned: "2 hours ago",
      contractor: "CleanTech Services",
    },
    {
      id: "NH1_KM67",
      location: "NH1 KM 67 - Gurgaon",
      status: "clean",
      lastCleaned: "1 hour ago",
      contractor: "HygieneMax Ltd",
    },
    {
      id: "NH8_KM23",
      location: "NH8 KM 23 - Jaipur",
      status: "dirty",
      lastCleaned: "6 hours ago",
      contractor: "CleanTech Services",
    },
    {
      id: "NH2_KM89",
      location: "NH2 KM 89 - Agra",
      status: "clean",
      lastCleaned: "30 minutes ago",
      contractor: "SanitaryPro",
    },
    {
      id: "NH4_KM12",
      location: "NH4 KM 12 - Mumbai",
      status: "locked",
      lastCleaned: "8 hours ago",
      contractor: "HygieneMax Ltd",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "dirty":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "locked":
        return <Lock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clean":
        return <Badge className="bg-green-100 text-green-800">Clean</Badge>
      case "dirty":
        return <Badge variant="destructive">Needs Cleaning</Badge>
      case "locked":
        return <Badge variant="secondary">Locked/Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const performanceData = [
    { month: "Jan", slaCompliance: 85, userSatisfaction: 78, cleaningFreq: 92 },
    { month: "Feb", slaCompliance: 88, userSatisfaction: 82, cleaningFreq: 89 },
    { month: "Mar", slaCompliance: 92, userSatisfaction: 85, cleaningFreq: 94 },
    { month: "Apr", slaCompliance: 89, userSatisfaction: 88, cleaningFreq: 91 },
    { month: "May", slaCompliance: 94, userSatisfaction: 91, cleaningFreq: 96 },
    { month: "Jun", slaCompliance: 91, userSatisfaction: 89, cleaningFreq: 93 },
  ]

  const contractorPerformance = [
    { name: "CleanTech Services", score: 92, facilities: 2, penalties: 1 },
    { name: "HygieneMax Ltd", score: 88, facilities: 2, penalties: 2 },
    { name: "SanitaryPro", score: 95, facilities: 1, penalties: 0 },
  ]

  const feedbackDistribution = [
    { name: "Clean", value: 68, color: "#22c55e" },
    { name: "Dirty", value: 22, color: "#ef4444" },
    { name: "Locked", value: 10, color: "#f59e0b" },
  ]

  const costAnalysis = [
    { month: "Jan", maintenance: 45000, cleaning: 32000, utilities: 18000 },
    { month: "Feb", maintenance: 38000, cleaning: 35000, utilities: 19000 },
    { month: "Mar", maintenance: 42000, cleaning: 33000, utilities: 17000 },
    { month: "Apr", maintenance: 35000, cleaning: 36000, utilities: 20000 },
    { month: "May", maintenance: 40000, cleaning: 34000, utilities: 18500 },
    { month: "Jun", maintenance: 37000, cleaning: 37000, utilities: 19500 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">National Overview Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring of highway toilet facilities</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toiletStats.total}</div>
            <p className="text-xs text-muted-foreground">Pilot locations monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{toiletStats.clean}</div>
            <p className="text-xs text-muted-foreground">Meeting hygiene standards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{toiletStats.dirty}</div>
            <p className="text-xs text-muted-foreground">Requires immediate cleaning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IoT Sensors</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{toiletStats.iot}</div>
            <p className="text-xs text-muted-foreground">Active monitoring systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliant</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{toiletStats.slaCompliant}</div>
            <p className="text-xs text-muted-foreground">Meeting service standards</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sla">SLA Compliance</TabsTrigger>
          <TabsTrigger value="iot">IoT Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Facility Status Table */}
          <Card>
            <CardHeader>
              <CardTitle>Live Facility Status</CardTitle>
              <CardDescription>Real-time monitoring of all highway toilet facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockToilets.map((toilet) => (
                  <div key={toilet.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(toilet.status)}
                      <div>
                        <h3 className="font-medium">{toilet.location}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {toilet.id} • {toilet.contractor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">Last cleaned: {toilet.lastCleaned}</p>
                      </div>
                      {getStatusBadge(toilet.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Interactive map showing toilet locations and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive Map View</p>
                  <p className="text-sm text-muted-foreground">Google Maps integration showing facility locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IoT Monitoring Tab */}
        <TabsContent value="iot" className="space-y-4">
          <IoTMonitoring showDetailedView={true} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance Trends</CardTitle>
                <CardDescription>Monthly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="slaCompliance" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="userSatisfaction" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="cleaningFreq" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Current month vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SLA Compliance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "91%" }}></div>
                      </div>
                      <span className="text-sm font-bold">91%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                      <span className="text-sm font-bold">89%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cleaning Frequency</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: "93%" }}></div>
                      </div>
                      <span className="text-sm font-bold">93%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Performance Scorecard</CardTitle>
              <CardDescription>Performance metrics and accountability tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractorPerformance.map((contractor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">{contractor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{contractor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contractor.facilities} facilities • {contractor.penalties} penalties
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{contractor.score}%</p>
                        <p className="text-xs text-muted-foreground">Performance Score</p>
                      </div>
                      <Badge
                        variant={
                          contractor.score >= 90 ? "default" : contractor.score >= 80 ? "secondary" : "destructive"
                        }
                      >
                        {contractor.score >= 90 ? "Excellent" : contractor.score >= 80 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Citizen Feedback Distribution</CardTitle>
                <CardDescription>User-reported facility conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feedbackDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {feedbackDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest citizen reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">NH1 KM 45 - Delhi</p>
                      <p className="text-xs text-muted-foreground">Clean facility, well maintained</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">NH8 KM 23 - Jaipur</p>
                      <p className="text-xs text-muted-foreground">Needs immediate cleaning</p>
                    </div>
                    <span className="text-xs text-muted-foreground">4h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Lock className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">NH4 KM 12 - Mumbai</p>
                      <p className="text-xs text-muted-foreground">Door locked, no access</p>
                    </div>
                    <span className="text-xs text-muted-foreground">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis & Budget Tracking</CardTitle>
              <CardDescription>Monthly expenditure breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={costAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
                  <Area
                    type="monotone"
                    dataKey="maintenance"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                  />
                  <Area
                    type="monotone"
                    dataKey="cleaning"
                    stackId="1"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                  />
                  <Area
                    type="monotone"
                    dataKey="utilities"
                    stackId="1"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Monthly Cost</CardTitle>
                <CardDescription>Current month expenditure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹93,500</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  5% decrease from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost per Facility</CardTitle>
                <CardDescription>Average monthly cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹18,700</div>
                <p className="text-xs text-muted-foreground">Per facility per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Utilization</CardTitle>
                <CardDescription>Current vs allocated budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <SLACompliance showDetailedView={true} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generate Reports</CardTitle>
            <CardDescription>Download SLA compliance and performance reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Monthly Report
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              Custom Date Range
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manage Staff</CardTitle>
            <CardDescription>View staff performance and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              <Users className="mr-2 h-4 w-4" />
              Staff Management
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Alerts</CardTitle>
            <CardDescription>Critical notifications and SLA breaches</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View All Alerts (3)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
