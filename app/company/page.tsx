"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"

const companyFormSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters" }).optional(),
})

const positionFormSchema = z.object({
  title: z.string().min(2, { message: "Position title must be at least 2 characters" }),
  department: z.string().min(2, { message: "Department must be at least 2 characters" }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters" }).optional(),
  salary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Salary must be a positive number",
  }),
})

export default function CompanyPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock company data
  const companyData = {
    name: "Acme Inc.",
    website: "https://acme.example.com",
    email: "info@acme.example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    description: "A leading technology company specializing in innovative solutions.",
  }

  // Mock positions data
  const [positions, setPositions] = useState([
    {
      id: "1",
      title: "Frontend Developer",
      department: "Engineering",
      description: "Responsible for developing and maintaining user interfaces.",
      salary: "80000",
    },
    {
      id: "2",
      title: "Backend Developer",
      department: "Engineering",
      description: "Responsible for server-side logic and database management.",
      salary: "85000",
    },
    {
      id: "3",
      title: "UI/UX Designer",
      department: "Design",
      description: "Responsible for creating user-friendly interfaces and experiences.",
      salary: "75000",
    },
  ])

  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: companyData,
  })

  const positionForm = useForm<z.infer<typeof positionFormSchema>>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
      salary: "",
    },
  })

  async function onCompanySubmit(values: z.infer<typeof companyFormSchema>) {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Company information updated",
        description: "Your company information has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company information.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPositionSubmit(values: z.infer<typeof positionFormSchema>) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newPosition = {
        id: Date.now().toString(),
        ...values,
      }

      setPositions([...positions, newPosition])
      positionForm.reset()

      toast({
        title: "Position added",
        description: "The new position has been added successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add position.",
      })
    }
  }

  const handleDeletePosition = (id: string) => {
    setPositions(positions.filter((position) => position.id !== id))
    toast({
      title: "Position deleted",
      description: "The position has been deleted successfully.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Company</h1>
        <p className="text-muted-foreground">Manage your company information and job positions.</p>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Company Information</TabsTrigger>
            <TabsTrigger value="positions">Job Positions</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company's basic information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                    <FormField
                      control={companyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of your company"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Brief description of your company. Maximum 500 characters.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Positions</CardTitle>
                <CardDescription>Manage job positions and salaries in your company.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    {positions.map((position) => (
                      <div key={position.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{position.title}</h3>
                          <p className="text-sm">{position.department}</p>
                          <p className="text-sm text-muted-foreground">
                            Salary: ${Number.parseInt(position.salary).toLocaleString()}
                          </p>
                          {position.description && <p className="mt-2 text-sm">{position.description}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePosition(position.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Position</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...positionForm}>
                        <form onSubmit={positionForm.handleSubmit(onPositionSubmit)} className="space-y-4">
                          <FormField
                            control={positionForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Frontend Developer, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={positionForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input placeholder="Engineering, Design, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={positionForm.control}
                            name="salary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Salary</FormLabel>
                                <FormControl>
                                  <Input placeholder="Annual salary amount" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={positionForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Job description and responsibilities"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Brief description of the position. Maximum 500 characters.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Add Position</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

