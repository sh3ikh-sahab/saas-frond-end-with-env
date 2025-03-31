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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters" }).optional(),
  avatar: z.string().optional(),
})

const skillFormSchema = z.object({
  name: z.string().min(2, { message: "Skill name must be at least 2 characters" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
})

const educationFormSchema = z.object({
  institution: z.string().min(2, { message: "Institution name must be at least 2 characters" }),
  degree: z.string().min(2, { message: "Degree must be at least 2 characters" }),
  fieldOfStudy: z.string().min(2, { message: "Field of study must be at least 2 characters" }),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
})

const experienceFormSchema = z.object({
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  position: z.string().min(2, { message: "Position must be at least 2 characters" }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters" }).optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
})

const certificationFormSchema = z.object({
  name: z.string().min(2, { message: "Certification name must be at least 2 characters" }),
  issuer: z.string().min(2, { message: "Issuer must be at least 2 characters" }),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
})

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for skills, education, experience, and certifications
  const [skills, setSkills] = useState([
    { id: "1", name: "React", level: "Advanced" },
    { id: "2", name: "Node.js", level: "Intermediate" },
    { id: "3", name: "TypeScript", level: "Advanced" },
  ])

  const [education, setEducation] = useState([
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      current: false,
    },
  ])

  const [experience, setExperience] = useState([
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Frontend Developer",
      description: "Developed and maintained web applications using React and TypeScript.",
      startDate: "2019-08-01",
      endDate: "",
      current: true,
    },
  ])

  const [certifications, setCertifications] = useState([
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      issueDate: "2020-05-15",
      expiryDate: "2023-05-15",
      credentialId: "AWS-DEV-12345",
    },
  ])

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: "",
      avatar: user?.avatar || "",
    },
  })

  const skillForm = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      level: "Beginner",
    },
  })

  const educationForm = useForm<z.infer<typeof educationFormSchema>>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  })

  const experienceForm = useForm<z.infer<typeof experienceFormSchema>>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  })

  const certificationForm = useForm<z.infer<typeof certificationFormSchema>>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSkillSubmit(values: z.infer<typeof skillFormSchema>) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSkills([...skills, { id: Date.now().toString(), ...values }])
      skillForm.reset()

      toast({
        title: "Skill added",
        description: "Your skill has been added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add skill",
      })
    }
  }

  async function onEducationSubmit(values: z.infer<typeof educationFormSchema>) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setEducation([...education, { id: Date.now().toString(), ...values }])
      educationForm.reset()

      toast({
        title: "Education added",
        description: "Your education has been added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add education",
      })
    }
  }

  async function onExperienceSubmit(values: z.infer<typeof experienceFormSchema>) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setExperience([...experience, { id: Date.now().toString(), ...values }])
      experienceForm.reset()

      toast({
        title: "Experience added",
        description: "Your experience has been added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add experience",
      })
    }
  }

  async function onCertificationSubmit(values: z.infer<typeof certificationFormSchema>) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCertifications([...certifications, { id: Date.now().toString(), ...values }])
      certificationForm.reset()

      toast({
        title: "Certification added",
        description: "Your certification has been added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add certification",
      })
    }
  }

  function deleteSkill(id: string) {
    setSkills(skills.filter((skill) => skill.id !== id))
    toast({
      title: "Skill deleted",
      description: "Your skill has been deleted successfully",
    })
  }

  function deleteEducation(id: string) {
    setEducation(education.filter((edu) => edu.id !== id))
    toast({
      title: "Education deleted",
      description: "Your education has been deleted successfully",
    })
  }

  function deleteExperience(id: string) {
    setExperience(experience.filter((exp) => exp.id !== id))
    toast({
      title: "Experience deleted",
      description: "Your experience has been deleted successfully",
    })
  }

  function deleteCertification(id: string) {
    setCertifications(certifications.filter((cert) => cert.id !== id))
    toast({
      title: "Certification deleted",
      description: "Your certification has been deleted successfully",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information and credentials.</p>

        <Tabs defaultValue="personal" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information and profile picture.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-4xl">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                              </FormControl>
                              <FormDescription>
                                Brief description for your profile. Maximum 500 characters.
                              </FormDescription>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add and manage your skills and proficiency levels.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{skill.name}</h3>
                          <p className="text-sm text-muted-foreground">{skill.level}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteSkill(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Skill</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...skillForm}>
                        <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4">
                          <FormField
                            control={skillForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="React, Node.js, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={skillForm.control}
                            name="level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Proficiency Level</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Skill
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Add and manage your educational background.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">
                            {edu.degree} in {edu.fieldOfStudy}
                          </h3>
                          <p className="text-sm">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(edu.startDate).toLocaleDateString()} -
                            {edu.current
                              ? " Present"
                              : edu.endDate
                                ? ` ${new Date(edu.endDate).toLocaleDateString()}`
                                : ""}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...educationForm}>
                        <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
                          <FormField
                            control={educationForm.control}
                            name="institution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="University name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={educationForm.control}
                            name="degree"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input placeholder="Bachelor of Science, Master's, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={educationForm.control}
                            name="fieldOfStudy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field of Study</FormLabel>
                                <FormControl>
                                  <Input placeholder="Computer Science, Business, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={educationForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" disabled={educationForm.watch("current")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={educationForm.control}
                            name="current"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="current-education"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel htmlFor="current-education">Currently Studying</FormLabel>
                                  <FormDescription>
                                    Check this if you are currently studying at this institution
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Education
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Add and manage your work experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{exp.position}</h3>
                          <p className="text-sm">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exp.startDate).toLocaleDateString()} -
                            {exp.current
                              ? " Present"
                              : exp.endDate
                                ? ` ${new Date(exp.endDate).toLocaleDateString()}`
                                : ""}
                          </p>
                          {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...experienceForm}>
                        <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="space-y-4">
                          <FormField
                            control={experienceForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={experienceForm.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input placeholder="Job title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={experienceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Job description and responsibilities"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Brief description of your role and responsibilities. Maximum 500 characters.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={experienceForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={experienceForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" disabled={experienceForm.watch("current")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={experienceForm.control}
                            name="current"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="current-experience"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel htmlFor="current-experience">Current Position</FormLabel>
                                  <FormDescription>
                                    Check this if you are currently working at this company
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Experience
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Add and manage your certifications and credentials.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <p className="text-sm">Issued by {cert.issuer}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                          </p>
                          {cert.credentialId && <p className="text-sm">Credential ID: {cert.credentialId}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteCertification(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Certification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...certificationForm}>
                        <form onSubmit={certificationForm.handleSubmit(onCertificationSubmit)} className="space-y-4">
                          <FormField
                            control={certificationForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certification Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="AWS Certified Developer, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={certificationForm.control}
                            name="issuer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Issuing Organization</FormLabel>
                                <FormControl>
                                  <Input placeholder="Amazon Web Services, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={certificationForm.control}
                              name="issueDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Issue Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={certificationForm.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={certificationForm.control}
                            name="credentialId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Credential ID (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Credential ID or verification URL" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Certification
                          </Button>
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

