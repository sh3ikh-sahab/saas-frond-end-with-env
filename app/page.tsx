import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Building, Users, ChevronRight, BarChart2, Calendar, Briefcase } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              EMS
            </div>
            <span className="text-lg font-semibold">Enterprise Management System</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 px-3 py-1">All-in-One Solution</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Modern Employee & Company <br /> Management Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive SaaS solution for businesses of all sizes to manage employees, departments, tasks,
            recruitment, and analytics in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">All-in-One Management Platform</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform provides a complete suite of tools to help businesses manage their operations effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>
                  Comprehensive employee data management, payroll, and performance tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Employee profiles and credentials</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Performance tracking and reviews</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Salary management and payroll</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Department & Team Structure</CardTitle>
                <CardDescription>
                  Easily manage your organization's structure and departmental operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Department and team creation</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Role assignment and management</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Budget allocation and tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Streamline workflows with task assignments, tracking, and reporting.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Task creation and assignment</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Progress tracking and deadlines</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Subtasks and dependencies</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Recruitment & Hiring</CardTitle>
                <CardDescription>Streamline your hiring process from job postings to onboarding.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Job posting and applicant tracking</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Interview scheduling and feedback</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Onboarding process management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>Gain insights with comprehensive analytics and customizable reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Performance metrics and KPIs</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Department effectiveness reports</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Cost analysis and budget reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Industry Support</CardTitle>
                <CardDescription>Tailored solutions for various industries and company types.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Software and IT companies</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Financial and government sectors</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Manufacturing and retail businesses</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include core features.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Perfect for small businesses just getting started.</p>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Up to 5 employees</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Basic payroll management</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Employee profiles</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Payment processing</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary shadow-md relative">
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <Badge variant="default" className="text-xs">
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Ideal for growing businesses with more employees.</p>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Up to 20 employees</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Advanced payroll management</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Employee profiles and performance tracking</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Multiple payment methods</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Role-based access control</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$399</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">For large organizations with complex requirements.</p>
                <ul className="space-y-2">
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Unlimited employees</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Complete payroll and HR management</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Advanced analytics and reporting</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Custom payment integrations</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>24/7 phone and email support</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Custom role permissions</span>
                  </li>
                  <li className="flex items-baseline">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workplace?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Join thousands of companies already using our platform to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  EMS
                </div>
                <span className="text-lg font-semibold">Enterprise Management System</span>
              </div>
              <p className="text-muted-foreground">
                A comprehensive SaaS solution for businesses of all sizes to manage their operations effectively.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Enterprise Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

