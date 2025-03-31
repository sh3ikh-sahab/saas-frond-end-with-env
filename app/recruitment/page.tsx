"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Job posting form schema
const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Job title must be at least 3 characters" }),
  department: z.string().min(1, { message: "Please select a department" }),
  location: z.string().min(1, { message: "Location is required" }),
  type: z.enum(["full-time", "part-time", "contract", "internship", "remote"]),
  salary: z.object({
    min: z.string().regex(/^\d+$/, { message: "Must be a valid number" }).optional(),
    max: z.string().regex(/^\d+$/, { message: "Must be a valid number" }).optional(),
    showSalary: z.boolean().default(true),
  }),
  description: z.string().min(10, { message: "Job description must be at least 10 characters" }),
  requirements: z.string().min(10, { message: "Job requirements must be at least 10 characters" }),
  applicationDeadline: z.date().optional(),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
})

// Application form schema
const applicationFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  resume: z.string().min(1, { message: "Resume is required" }),
  coverLetter: z.string().optional(),
  experience: z.string().min(1, { message: "Experience is required" }),
  currentCompany: z.string().optional(),
  noticePeriod: z.string().optional(),
  expectedSalary: z.string().optional(),
})

// Mock departments data
const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Marketing" },
  { id: "3", name: "Finance" },
  { id: "4", name: "Human Resources" },
  { id: "5", name: "Customer Support" },
]

// Mock job postings data
const initialJobPostings = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "1",
    location: "New York, NY",
    type: "full-time",
    salary: {
      min: "100000",
      max: "150000",
      showSalary: true,
    },
    description: "We are looking for an experienced frontend developer to join our engineering team...",
    requirements:
      "- 5+ years of experience with React\n- Experience with TypeScript\n- Strong CSS skills\n- Experience with modern frontend tooling",
    postedDate: "2023-07-01",
    applicationDeadline: "2023-08-15",
    status: "published",
    applications: 12,
  },
  {
    id: "2",
    title: "Marketing Manager",
    department: "2",
    location: "Remote",
    type: "full-time",
    salary: {
      min: "90000",
      max: "120000",
      showSalary: true,
    },
    description: "We're seeking a marketing manager to lead our marketing efforts and drive growth...",
    requirements:
      "- 3+ years of experience in marketing\n- Experience with digital marketing\n- Strong communication skills\n- Experience with marketing analytics",
    postedDate: "2023-07-05",
    applicationDeadline: "2023-08-20",
    status: "published",
    applications: 8,
  },
  {
    id: "3",
    title: "Financial Analyst",
    department: "3",
    location: "Chicago, IL",
    type: "full-time",
    salary: {
      min: "80000",
      max: "110000",
      showSalary: true,
    },
    description: "We are looking for a financial analyst to join our finance team...",
    requirements:
      "- Bachelor's degree in Finance or Accounting\n- 2+ years of experience in financial analysis\n- Strong Excel skills\n- Experience with financial modeling",
    postedDate: "2023-07-10",
    applicationDeadline: "2023-08-25",
    status: "published",
    applications: 5,
  },
  {
    id: "4",
    title: "HR Specialist",
    department: "4",
    location: "Boston, MA",
    type: "part-time",
    salary: {
      min: "40000",
      max: "60000",
      showSalary: true,
    },
    description: "We are looking for an HR specialist to support our human resources department...",
    requirements:
      "- Bachelor's degree in Human Resources or related field\n- 1+ years of experience in HR\n- Knowledge of labor laws\n- Strong organizational skills",
    postedDate: "2023-07-15",
    applicationDeadline: "2023-09-01",
    status: "published",
    applications: 3,
  },
  {
    id: "5",
    title: "Customer Support Representative",
    department: "5",
    location: "Remote",
    type: "full-time",
    salary: {
      min: "45000",
      max: "55000",
      showSalary: false,
    },
    description: "We are looking for a customer support representative to help our customers...",
    requirements:
      "- High school diploma or equivalent\n- 1+ years of experience in customer service\n- Strong communication skills\n- Problem-solving abilities",
    postedDate: "2023-07-20",
    applicationDeadline: "2023-09-05",
    status: "draft",
    applications: 0,
  },
]

// Mock applications data
const initialApplications = [
  {
    id: "1",
    jobId: "1",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    resume: "Resume_JohnSmith.pdf",
    coverLetter: "Cover Letter for Senior Frontend Developer position...",
    experience: "7 years",
    currentCompany: "Tech Solutions Inc.",
    noticePeriod: "30 days",
    expectedSalary: "140000",
    status: "reviewing",
    appliedDate: "2023-07-15",
    avatar: "",
  },
  {
    id: "2",
    jobId: "1",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    resume: "Resume_JaneDoe.pdf",
    coverLetter: "I am excited to apply for the Senior Frontend Developer position...",
    experience: "6 years",
    currentCompany: "Web Innovations",
    noticePeriod: "2 weeks",
    expectedSalary: "135000",
    status: "shortlisted",
    appliedDate: "2023-07-16",
    avatar: "",
  },
  {
    id: "3",
    jobId: "2",
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "555-456-7890",
    resume: "Resume_MichaelJohnson.pdf",
    coverLetter: "As an experienced marketing professional, I am excited to apply...",
    experience: "5 years",
    currentCompany: "Market Leaders",
    noticePeriod: "1 month",
    expectedSalary: "110000",
    status: "interviewing",
    appliedDate: "2023-07-17",
    avatar: "",
  },
]

export default function RecruitmentPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("jobs")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [isViewApplicationsOpen, setIsViewApplicationsOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [jobPostings, setJobPostings] = useState(initialJobPostings)
  const [applications, setApplications] = useState(initialApplications)

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "full-time",
      salary: {
        min: "",
        max: "",
        showSalary: true,
      },
      description: "",
      requirements: "",
      status: "draft",
    },
  })

  const itemsPerPage = 5

  // Filter job postings based on search and filters
  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departments
        .find((d) => d.id === job.department)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false

    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesType = typeFilter === "all" || job.type === typeFilter
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter

    return matchesSearch && matchesStatus && matchesType && matchesDepartment
  })

  // Paginate jobs
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Get applications for a specific job
  const getJobApplications = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId)
  }

  // Get department name by id
  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "Unassigned"
  }

  // Get job type badge
  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Full Time</Badge>
      case "part-time":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Part Time</Badge>
      case "contract":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Contract</Badge>
      case "internship":
        return <Badge className="bg-green-500 hover:bg-green-600">Internship</Badge>
      case "remote":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">Remote</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get job status badge
  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "published":
        return <Badge variant="default">Published</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get application status badge
  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline">New</Badge>
      case "reviewing":
        return <Badge variant="secondary">Reviewing</Badge>
      case "shortlisted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Shortlisted</Badge>
      case "interviewing":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Interviewing</Badge>
      case "offered":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Offered</Badge>
      case "hired":
        return <Badge className="bg-green-500 hover:bg-green-600">Hired</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleAddJob = (values: z.infer<typeof jobFormSchema>) => {
    const newJob = {
      id: (jobPostings.length + 1).toString(),
      title: values.title,
      department: values.department,
      location: values.location,
      type: values.type,
      salary: values.salary,
      description: values.description,
      requirements: values.requirements,
      postedDate: format(new Date(), "yyyy-MM-dd"),
      applicationDeadline: values.applicationDeadline ? format(values.applicationDeadline, "yyyy-MM-dd") : "",
      status: values.status,
      applications: 0,
    }

    setJobPostings([...jobPostings, newJob])
    setIsAddJobOpen(false)
    form.reset()

    toast({
      title: "Job posting created",
      description: `${values.title} has been created successfully.`,
    })
  }

  const handleChangeJobStatus = (jobId: string, newStatus: string) => {
    const updatedJobs = jobPostings.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
    setJobPostings(updatedJobs)

    toast({
      title: "Status updated",
      description: `Job status has been updated to ${newStatus}.`,
    })
  }

  const handleDeleteJob = (jobId: string) => {
    setJobPostings(jobPostings.filter((job) => job.id !== jobId))

    toast({
      title: "Job deleted",
      description: "The job posting has been deleted.",
    })
  }

  const handleViewApplications = (jobId: string) => {
    setSelectedJob(jobId)
    setIsViewApplicationsOpen(true)
  }

  const handleChangeApplicationStatus = (appId: string, newStatus: string) => {
    const updatedApplications = applications.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    setApplications(updatedApplications)

    toast({
      title: "Application status updated",
      description: `Application status has been updated to ${newStatus}.`,
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Recruitment</h1>
            <p className="text-muted-foreground">Manage job postings and applications.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab === "jobs" ? "jobs" : "applications"}...`}
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === "jobs" && (
            <>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" /> Status
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" /> Type
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
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
              </div>

              <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Create Job Posting</DialogTitle>
                    <DialogDescription>Fill in the details for the new job posting.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddJob)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Senior Frontend Developer" {...field} />
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
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. New York, NY or Remote" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full-time">Full Time</SelectItem>
                                  <SelectItem value="part-time">Part Time</SelectItem>
                                  <SelectItem value="contract">Contract</SelectItem>
                                  <SelectItem value="internship">Internship</SelectItem>
                                  <SelectItem value="remote">Remote</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="applicationDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Application Deadline (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="salary.min"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Min salary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="salary.max"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Max salary" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="salary.showSalary"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Display salary range on job posting</FormLabel>
                                <FormDescription>
                                  If unchecked, the salary range will be hidden from applicants
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the role, responsibilities, and what the candidate will be doing."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List qualifications, skills, and experience required for this position."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Use bullet points (e.g. - 5+ years of experience) for better readability
                            </FormDescription>
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
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Draft jobs are not visible to applicants. Published jobs are open for applications.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddJobOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Job Posting</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {activeTab === "jobs" && (
          <Card className="mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className="font-medium">{job.title}</div>
                          {job.salary.showSalary && job.salary.min && job.salary.max && (
                            <div className="text-sm text-muted-foreground">
                              ${Number(job.salary.min).toLocaleString()} - ${Number(job.salary.max).toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getDepartmentName(job.department)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {job.location}
                          </div>
                        </TableCell>
                        <TableCell>{getJobTypeBadge(job.type)}</TableCell>
                        <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewApplications(job.id)}
                            disabled={job.applications === 0}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {job.applications}
                          </Button>
                        </TableCell>
                        <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("View job")}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Edit job")}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Job</span>
                              </DropdownMenuItem>
                              {job.status === "draft" && (
                                <DropdownMenuItem onClick={() => handleChangeJobStatus(job.id, "published")}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>Publish Job</span>
                                </DropdownMenuItem>
                              )}
                              {job.status === "published" && (
                                <DropdownMenuItem onClick={() => handleChangeJobStatus(job.id, "closed")}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  <span>Close Job</span>
                                </DropdownMenuItem>
                              )}
                              {job.status === "closed" && (
                                <DropdownMenuItem onClick={() => handleChangeJobStatus(job.id, "published")}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>Reopen Job</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Job</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-muted-foreground">No job postings found</p>
                          <Button onClick={() => setIsAddJobOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of{" "}
                    {filteredJobs.length} jobs
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "applications" && (
          <Card className="mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Expected Salary</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length > 0 ? (
                    applications.map((app) => {
                      const job = jobPostings.find((j) => j.id === app.jobId)
                      return (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={app.avatar} />
                                <AvatarFallback>
                                  {app.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{app.fullName}</div>
                                <div className="text-sm text-muted-foreground">{app.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{job?.title || "Unknown Position"}</TableCell>
                          <TableCell>{getApplicationStatusBadge(app.status)}</TableCell>
                          <TableCell>{app.experience}</TableCell>
                          <TableCell>
                            {app.expectedSalary ? `$${Number(app.expectedSalary).toLocaleString()}` : "Not specified"}
                          </TableCell>
                          <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => console.log("View application")}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Application</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log("Download resume")}>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download Resume</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Change Status
                                  <ChevronRight className="ml-auto h-4 w-4" />
                                  <DropdownMenuContent className="min-w-[180px]">
                                    <DropdownMenuItem
                                      onClick={() => handleChangeApplicationStatus(app.id, "reviewing")}
                                    >
                                      Reviewing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleChangeApplicationStatus(app.id, "shortlisted")}
                                    >
                                      Shortlisted
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleChangeApplicationStatus(app.id, "interviewing")}
                                    >
                                      Interviewing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeApplicationStatus(app.id, "offered")}>
                                      Offered
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeApplicationStatus(app.id, "hired")}>
                                      Hired
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeApplicationStatus(app.id, "rejected")}>
                                      Rejected
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <p className="text-muted-foreground">No applications found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* View Applications Dialog */}
        <Dialog open={isViewApplicationsOpen} onOpenChange={setIsViewApplicationsOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                Applications for {selectedJob && jobPostings.find((j) => j.id === selectedJob)?.title}
              </DialogTitle>
              <DialogDescription>Review and manage applications for this position.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[500px] overflow-y-auto">
              {selectedJob && getJobApplications(selectedJob).length > 0 ? (
                getJobApplications(selectedJob).map((app) => (
                  <Card key={app.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={app.avatar} />
                            <AvatarFallback>
                              {app.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{app.fullName}</CardTitle>
                            <CardDescription>
                              {app.email} • {app.phone}
                            </CardDescription>
                          </div>
                        </div>
                        {getApplicationStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Experience</p>
                          <p className="font-medium">{app.experience}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Company</p>
                          <p className="font-medium">{app.currentCompany || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Notice Period</p>
                          <p className="font-medium">{app.noticePeriod || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expected Salary</p>
                          <p className="font-medium">
                            {app.expectedSalary ? `$${Number(app.expectedSalary).toLocaleString()}` : "Not specified"}
                          </p>
                        </div>
                      </div>
                      {app.coverLetter && (
                        <div className="mt-4">
                          <p className="text-muted-foreground mb-1">Cover Letter</p>
                          <p className="text-sm whitespace-pre-line">{app.coverLetter}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download Resume
                        </Button>
                        <Select
                          defaultValue={app.status}
                          onValueChange={(value) => handleChangeApplicationStatus(app.id, value)}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="interviewing">Interviewing</SelectItem>
                            <SelectItem value="offered">Offered</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No applications found for this job posting.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewApplicationsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

