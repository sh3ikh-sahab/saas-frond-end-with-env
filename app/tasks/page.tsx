"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import {
  CalendarIcon,
  ChevronDown,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Clock4,
} from "lucide-react"
import api from "@/lib/api"

// Task form schema
const taskFormSchema = z.object({
  title: z.string().min(3, { message: "Task title must be at least 3 characters" }),
  description: z.string().optional(),
  department: z.string().min(1, { message: "Please select a department" }),
  assignee: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.date().optional(),
  status: z.enum(["todo", "in-progress", "review", "completed"]),
  parentTask: z.string().optional(),
})

// Mock data for departments
const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Marketing" },
  { id: "3", name: "Finance" },
  { id: "4", name: "Human Resources" },
  { id: "5", name: "Customer Support" },
]

// Mock data for employees
const employees = [
  { id: "1", name: "John Doe", avatar: "", department: "1" },
  { id: "2", name: "Jane Smith", avatar: "", department: "1" },
  { id: "3", name: "Robert Wilson", avatar: "", department: "2" },
  { id: "4", name: "Emily Davis", avatar: "", department: "3" },
  { id: "5", name: "Michael Johnson", avatar: "", department: "4" },
  { id: "6", name: "Sarah Brown", avatar: "", department: "5" },
]

// Mock data for tasks
const initialTasks = [
  {
    id: "1",
    title: "Implement login functionality",
    description: "Create login page with email and password authentication",
    department: "1",
    assignee: "1",
    priority: "high",
    dueDate: "2023-07-20",
    createdDate: "2023-07-10",
    status: "completed",
    subtasks: [
      {
        id: "1-1",
        title: "Design login UI",
        status: "completed",
        assignee: "2",
      },
      {
        id: "1-2",
        title: "Implement authentication logic",
        status: "completed",
        assignee: "1",
      },
    ],
  },
  {
    id: "2",
    title: "Create marketing campaign for new product",
    description: "Develop marketing materials for Q3 product launch",
    department: "2",
    assignee: "3",
    priority: "medium",
    dueDate: "2023-08-15",
    createdDate: "2023-07-05",
    status: "in-progress",
    subtasks: [
      {
        id: "2-1",
        title: "Design social media graphics",
        status: "completed",
        assignee: "3",
      },
      {
        id: "2-2",
        title: "Write email campaign copy",
        status: "in-progress",
        assignee: "3",
      },
    ],
  },
  {
    id: "3",
    title: "Prepare quarterly financial report",
    description: "Compile and analyze Q2 financial data",
    department: "3",
    assignee: "4",
    priority: "urgent",
    dueDate: "2023-07-25",
    createdDate: "2023-07-01",
    status: "review",
    subtasks: [],
  },
  {
    id: "4",
    title: "Conduct employee satisfaction survey",
    description: "Create and distribute annual employee survey",
    department: "4",
    assignee: "5",
    priority: "low",
    dueDate: "2023-08-30",
    createdDate: "2023-07-15",
    status: "todo",
    subtasks: [],
  },
  {
    id: "5",
    title: "Update customer support knowledge base",
    description: "Review and update support articles for new features",
    department: "5",
    assignee: "6",
    priority: "medium",
    dueDate: "2023-08-05",
    createdDate: "2023-07-12",
    status: "in-progress",
    subtasks: [],
  },
]

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      department: "",
      assignee: "",
      priority: "medium",
      status: "todo",
    },
  })

  const subtaskForm = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string().min(3, { message: "Subtask title must be at least 3 characters" }),
        assignee: z.string().optional(),
      }),
    ),
    defaultValues: {
      title: "",
      assignee: "",
    },
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks")
        setTasks(response.data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tasks data",
        })
      }
    }

    fetchTasks()
  }, [])

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employees
        .find((e) => e.id === task.assignee)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || task.department === departmentFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
  })

  // Get department name by id
  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "Unassigned"
  }

  // Get employee name by id
  const getEmployeeName = (id: string) => {
    return employees.find((e) => e.id === id)?.name || "Unassigned"
  }

  // Get employee initials
  const getEmployeeInitials = (id: string) => {
    const name = getEmployeeName(id)
    return name === "Unassigned"
      ? "UN"
      : name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
  }

  // Get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Low</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "high":
        return <Badge variant="default">High</Badge>
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return (
          <div className="flex items-center gap-1">
            <Clock4 className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline">To Do</Badge>
          </div>
        )
      case "in-progress":
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-blue-500" />
            <Badge variant="secondary">In Progress</Badge>
          </div>
        )
      case "review":
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Review
            </Badge>
          </div>
        )
      case "completed":
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <Badge variant="outline" className="border-green-500 text-green-500">
              Completed
            </Badge>
          </div>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleAddTask = async (values: z.infer<typeof taskFormSchema>) => {
    try {
      // Make API call
      const response = await api.post("/tasks", values)

      // Update local state with the new task
      setTasks([...tasks, response.data])

      setIsAddTaskOpen(false)
      form.reset()

      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task",
      })
    }
  }

  const handleAddSubtask = async (values: { title: string; assignee: string }) => {
    if (!selectedTask) return

    try {
      // Make API call
      const response = await api.post(`/tasks/${selectedTask}/subtasks`, values)

      // Update local state with the updated task (including new subtask)
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTask) {
          return {
            ...task,
            subtasks: [...task.subtasks, response.data],
          }
        }
        return task
      })

      setTasks(updatedTasks)
      setIsAddSubtaskOpen(false)
      subtaskForm.reset()

      toast({
        title: "Subtask added",
        description: "Your subtask has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding subtask:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add subtask",
      })
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      // Make API call
      const response = await api.patch(`/tasks/${taskId}`, { status: newStatus })

      // Update local state with the updated task
      const updatedTasks = tasks.map((task) => (task.id === taskId ? response.data : task))
      setTasks(updatedTasks)

      toast({
        title: "Status updated",
        description: "Task status has been updated.",
      })
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status",
      })
    }
  }

  const openAddSubtaskDialog = (taskId: string) => {
    setSelectedTask(taskId)
    setIsAddSubtaskOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Create and manage tasks for your organization.</p>
          </div>
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your organization's workflow.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddTask)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter task description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employees.map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="low" />
                                </FormControl>
                                <FormLabel className="font-normal">Low</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="medium" />
                                </FormControl>
                                <FormLabel className="font-normal">Medium</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="high" />
                                </FormControl>
                                <FormLabel className="font-normal">High</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="urgent" />
                                </FormControl>
                                <FormLabel className="font-normal">Urgent</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date (Optional)</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Task</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Status
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Department
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Priority
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="list" className="mt-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="border-b p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                          </div>
                          <h3 className="text-lg font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Department:</span>
                              <span>{getDepartmentName(task.department)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Assignee:</span>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="text-xs">
                                    {task.assignee ? getEmployeeInitials(task.assignee) : "UN"}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.assignee ? getEmployeeName(task.assignee) : "Unassigned"}</span>
                              </div>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Due:</span>
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{new Date(task.createdDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Status <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "todo")}>
                                To Do
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "review")}>
                                Review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                                Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openAddSubtaskDialog(task.id)}>
                                Add Subtask
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem>Delete Task</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {task.subtasks.length > 0 && (
                        <div className="mt-4 pl-4 border-l">
                          <p className="text-sm font-medium mb-2">Subtasks ({task.subtasks.length})</p>
                          <div className="space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-center gap-3 text-sm">
                                <Checkbox id={subtask.id} checked={subtask.status === "completed"} />
                                <label
                                  htmlFor={subtask.id}
                                  className={`${subtask.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {subtask.title}
                                </label>
                                {subtask.assignee && (
                                  <Avatar className="h-5 w-5 ml-auto">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xs">
                                      {getEmployeeInitials(subtask.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No tasks found. Create a new task to get started.</p>
                    <Button className="mt-4" onClick={() => setIsAddTaskOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">To Do</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {filteredTasks.filter((t) => t.status === "todo").length > 0 ? (
                    filteredTasks
                      .filter((t) => t.status === "todo")
                      .map((task) => (
                        <Card key={task.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(task.priority)}
                                <span className="text-xs text-muted-foreground">
                                  {task.dueDate && `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                                </span>
                              </div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.assignee && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xs">
                                      {getEmployeeInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{getEmployeeName(task.assignee)}</span>
                                </div>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                                  Move to In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddSubtaskDialog(task.id)}>
                                  Add Subtask
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No tasks</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">In Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {filteredTasks.filter((t) => t.status === "in-progress").length > 0 ? (
                    filteredTasks
                      .filter((t) => t.status === "in-progress")
                      .map((task) => (
                        <Card key={task.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(task.priority)}
                                <span className="text-xs text-muted-foreground">
                                  {task.dueDate && `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                                </span>
                              </div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.assignee && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xs">
                                      {getEmployeeInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{getEmployeeName(task.assignee)}</span>
                                </div>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "review")}>
                                  Move to Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "todo")}>
                                  Move to To Do
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No tasks</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Review</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {filteredTasks.filter((t) => t.status === "review").length > 0 ? (
                    filteredTasks
                      .filter((t) => t.status === "review")
                      .map((task) => (
                        <Card key={task.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(task.priority)}
                                <span className="text-xs text-muted-foreground">
                                  {task.dueDate && `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                                </span>
                              </div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.assignee && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xs">
                                      {getEmployeeInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{getEmployeeName(task.assignee)}</span>
                                </div>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                                  Move to Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                                  Move to In Progress
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No tasks</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Completed</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {filteredTasks.filter((t) => t.status === "completed").length > 0 ? (
                    filteredTasks
                      .filter((t) => t.status === "completed")
                      .map((task) => (
                        <Card key={task.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(task.priority)}
                                <span className="text-xs text-muted-foreground">
                                  {task.dueDate && `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                                </span>
                              </div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.assignee && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xs">
                                      {getEmployeeInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{getEmployeeName(task.assignee)}</span>
                                </div>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "review")}>
                                  Move to Review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No tasks</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddSubtaskOpen} onOpenChange={setIsAddSubtaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Subtask</DialogTitle>
            <DialogDescription>Add a subtask to the selected task.</DialogDescription>
          </DialogHeader>
          <Form {...subtaskForm}>
            <form onSubmit={subtaskForm.handleSubmit(handleAddSubtask)} className="space-y-4">
              <FormField
                control={subtaskForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtask Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subtask title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subtaskForm.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddSubtaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Subtask</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

