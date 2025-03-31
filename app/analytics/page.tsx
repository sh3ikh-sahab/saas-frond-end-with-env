"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, Calendar, DollarSign, Download, LineChart, PieChart, RefreshCw, Users } from "lucide-react"

// Mock analytics data
const overviewData = {
  totalEmployees: 128,
  employeeChange: 8,
  activeDepartments: 7,
  averageSalary: 75500,
  salaryChange: 3.2,
  openPositions: 12,
  newHires: {
    thisMonth: 3,
    lastMonth: 5,
  },
  turnover: {
    thisMonth: 1,
    lastMonth: 2,
    rate: 0.8,
  },
  payroll: {
    thisMonth: 967400,
    lastMonth: 932000,
    change: 3.8,
  },
  departments: [
    { name: "Engineering", employees: 42, budget: 378000 },
    { name: "Marketing", employees: 18, budget: 162000 },
    { name: "Finance", employees: 15, budget: 135000 },
    { name: "Human Resources", employees: 8, budget: 72000 },
    { name: "Customer Support", employees: 25, budget: 225000 },
    { name: "Sales", employees: 16, budget: 144000 },
    { name: "Operations", employees: 4, budget: 36000 },
  ],
  tasks: {
    total: 143,
    completed: 98,
    inProgress: 32,
    overdue: 13,
  },
}

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("month")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track and analyze your company's performance metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefreshData} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewData.totalEmployees}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className={`mr-1 ${overviewData.employeeChange > 0 ? "text-green-500" : "text-red-500"}`}>
                      {overviewData.employeeChange > 0 ? (
                        <ArrowUp className="inline h-3 w-3" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3" />
                      )}
                      {Math.abs(overviewData.employeeChange)}
                    </div>
                    since last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${overviewData.averageSalary.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className={`mr-1 ${overviewData.salaryChange > 0 ? "text-green-500" : "text-red-500"}`}>
                      {overviewData.salaryChange > 0 ? (
                        <ArrowUp className="inline h-3 w-3" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3" />
                      )}
                      {Math.abs(overviewData.salaryChange)}%
                    </div>
                    since last year
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Hires</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewData.newHires.thisMonth}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div
                      className={`mr-1 ${overviewData.newHires.thisMonth >= overviewData.newHires.lastMonth ? "text-green-500" : "text-red-500"}`}
                    >
                      {overviewData.newHires.thisMonth > overviewData.newHires.lastMonth ? (
                        <ArrowUp className="inline h-3 w-3" />
                      ) : overviewData.newHires.thisMonth < overviewData.newHires.lastMonth ? (
                        <ArrowDown className="inline h-3 w-3" />
                      ) : null}
                      {Math.abs(overviewData.newHires.thisMonth - overviewData.newHires.lastMonth)}
                    </div>
                    compared to last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewData.turnover.rate}%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {overviewData.turnover.thisMonth} employees left this month
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Employee Growth</CardTitle>
                  <CardDescription>Monthly employee count over the past year</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <LineChart className="h-8 w-8" />
                    <span className="ml-2">Employee growth chart would render here</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee distribution by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.departments.map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)` }}
                          />
                          <span className="text-sm font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{dept.employees}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((dept.employees / overviewData.totalEmployees) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion</CardTitle>
                  <CardDescription>Overall task completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-3xl font-bold">
                        {Math.round((overviewData.tasks.completed / overviewData.tasks.total) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Completion rate</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {overviewData.tasks.completed}/{overviewData.tasks.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Tasks completed</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span className="font-medium">{overviewData.tasks.completed}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(overviewData.tasks.completed / overviewData.tasks.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In Progress</span>
                      <span className="font-medium">{overviewData.tasks.inProgress}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(overviewData.tasks.inProgress / overviewData.tasks.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overdue</span>
                      <span className="font-medium">{overviewData.tasks.overdue}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(overviewData.tasks.overdue / overviewData.tasks.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Payroll</CardTitle>
                  <CardDescription>Total payroll expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${overviewData.payroll.thisMonth.toLocaleString()}</div>
                  <div className="flex items-center text-sm mt-1">
                    <div className={`mr-1 ${overviewData.payroll.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      {overviewData.payroll.change > 0 ? (
                        <ArrowUp className="inline h-3 w-3" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3" />
                      )}
                      {Math.abs(overviewData.payroll.change)}%
                    </div>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                  <div className="h-[200px] mt-4 flex items-center justify-center text-muted-foreground">
                    <LineChart className="h-8 w-8" />
                    <span className="ml-2">Payroll trend chart would render here</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Department Budget</CardTitle>
                  <CardDescription>Monthly budget allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.departments.slice(0, 5).map((dept) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="font-medium">${dept.budget.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${(dept.budget / overviewData.payroll.thisMonth) * 100}%`,
                              backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {overviewData.departments.length > 5 && (
                      <Button variant="ghost" className="w-full text-sm">
                        View all departments
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Demographics</CardTitle>
                <CardDescription>Employee distribution by various demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
                  <PieChart className="h-8 w-8" />
                  <span className="ml-2">Employee demographics charts would render here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Analytics</CardTitle>
                <CardDescription>Performance metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
                  <LineChart className="h-8 w-8" />
                  <span className="ml-2">Department performance charts would render here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
                  <LineChart className="h-8 w-8" />
                  <span className="ml-2">Performance metrics charts would render here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

