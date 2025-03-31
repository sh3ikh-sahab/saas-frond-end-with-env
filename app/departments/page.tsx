"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import api from "@/lib/api"

// Department form schema
const departmentFormSchema = z.object({
  name: z.string().min(2, { message: "Department name must be at least 2 characters" }),
  description: z.string().optional(),
  manager: z.string().optional(),
})

// Mock department data
// const initialDepartments = [
//   {
//     id: "1",
//     name: "Human Resources",
//     description: "Responsible for recruiting, onboarding, and managing employee relations",
//     employeeCount: 8,
//     manager: "Sarah Johnson",
//     created: "2022-01-15",
//   },
//   {
//     id: "2",
//     name: "Engineering",
//     description: "Software development and technical operations",
//     employeeCount: 24,
//     manager: "Michael Chen",
//     created: "2022-01-20",
//   },
//   {
//     id: "3",
//     name: "Finance",
//     description: "Financial planning, accounting, and payroll",
//     employeeCount: 12,
//     manager: "Jessica Williams",
//     created: "2022-01-25",
//   },
//   {
//     id: "4",
//     name: "Marketing",
//     description: "Brand management, digital marketing, and promotional activities",
//     employeeCount: 10,
//     manager: "David Miller",
//     created: "2022-02-01",
//   },
//   {
//     id: "5",
//     name: "Customer Support",
//     description: "User assistance and problem resolution",
//     employeeCount: 15,
//     manager: "Emily Davis",
//     created: "2022-02-10",
//   },
// ]

export default function DepartmentsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<any>(null)
  const [departments, setDepartments] = useState([])

  const form = useForm<z.infer<typeof departmentFormSchema>>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      manager: "",
    },
  })

  const editForm = useForm<z.infer<typeof departmentFormSchema>>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      manager: "",
    },
  })

  const itemsPerPage = 5

  // Filter departments based on search term
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Paginate departments
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Add this useEffect to fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments")
        setDepartments(response.data)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load departments data",
        })
      }
    }

    fetchDepartments()
  }, [])

  // Replace the handleAddDepartment function with this API-connected version
  const handleAddDepartment = async (values: z.infer<typeof departmentFormSchema>) => {
    try {
      // Make API call
      const response = await api.post("/departments", values)

      // Update local state with the new department
      setDepartments([...departments, response.data])

      setIsAddDepartmentOpen(false)
      form.reset()

      toast({
        title: "Department added",
        description: "The department has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add department",
      })
    }
  }

  // Replace the handleEditDepartment function with this API-connected version
  const handleEditDepartment = async (values: z.infer<typeof departmentFormSchema>) => {
    if (!currentDepartment) return

    try {
      // Make API call
      const response = await api.put(`/departments/${currentDepartment.id}`, values)

      // Update local state with the updated department
      const updatedDepartments = departments.map((dept) => (dept.id === currentDepartment.id ? response.data : dept))

      setDepartments(updatedDepartments)
      setIsEditDepartmentOpen(false)
      setCurrentDepartment(null)

      toast({
        title: "Department updated",
        description: "The department has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update department",
      })
    }
  }

  // Replace the handleDeleteDepartment function with this API-connected version
  const handleDeleteDepartment = async (id: string) => {
    try {
      // Make API call
      await api.delete(`/departments/${id}`)

      // Update local state by removing the deleted department
      setDepartments(departments.filter((dept) => dept.id !== id))

      toast({
        title: "Department deleted",
        description: "The department has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete department",
      })
    }
  }

  const openEditDialog = (department: any) => {
    setCurrentDepartment(department)
    editForm.reset({
      name: department.name,
      description: department.description,
      manager: department.manager,
    })
    setIsEditDepartmentOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Create and manage departments within your organization.</p>
          </div>
          <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>Enter the details of the new department.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddDepartment)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Human Resources, Engineering, etc." {...field} />
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
                          <Textarea placeholder="Department's responsibilities and functions" {...field} />
                        </FormControl>
                        <FormDescription>Brief description of the department's purpose.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Manager (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Department manager's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Department</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Department</DialogTitle>
                <DialogDescription>Update the department details.</DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditDepartment)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Human Resources, Engineering, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Department's responsibilities and functions" {...field} />
                        </FormControl>
                        <FormDescription>Brief description of the department's purpose.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Manager (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Department manager's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEditDepartmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDepartments.length > 0 ? (
                  currentDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{department.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {department.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>{department.employeeCount}</TableCell>
                      <TableCell>{new Date(department.created).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(department)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/departments/${department.id}`}>
                                <Users className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteDepartment(department.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {filteredDepartments.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDepartments.length)} of{" "}
                  {filteredDepartments.length} departments
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
      </div>
    </DashboardLayout>
  )
}

