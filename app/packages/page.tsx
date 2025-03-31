"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

// Mock package data
const packages = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    billing: "monthly",
    description: "Perfect for small businesses just getting started.",
    features: [
      "Up to 5 employees",
      "Basic payroll management",
      "Employee profiles",
      "Payment processing",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 199,
    billing: "monthly",
    description: "Ideal for growing businesses with more employees.",
    features: [
      "Up to 20 employees",
      "Advanced payroll management",
      "Employee profiles and performance tracking",
      "Multiple payment methods",
      "Priority email support",
      "Analytics dashboard",
      "Role-based access control",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 399,
    billing: "monthly",
    description: "For large organizations with complex requirements.",
    features: [
      "Unlimited employees",
      "Complete payroll and HR management",
      "Advanced analytics and reporting",
      "Custom payment integrations",
      "24/7 phone and email support",
      "Dedicated account manager",
      "Custom role permissions",
      "API access",
    ],
    popular: false,
  },
]

export default function PackagesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId)

    // Redirect to payment page
    window.location.href = `/payments/make?package=${packageId}`
  }

  const handleSubscribe = async (packageId: string) => {
    try {
      setIsLoading(true)
      setSelectedPackage(packageId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Package selected",
        description: "You will now be redirected to the payment page.",
      })

      // Redirect to payment page
      window.location.href = `/payments/make?package=${packageId}`
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select package. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Subscription Packages</h1>
        <p className="text-muted-foreground">Choose the right package for your business needs.</p>

        <div className="grid gap-6 mt-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`flex flex-col ${pkg.popular ? "border-primary shadow-md" : ""}`}>
              {pkg.popular && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                  <Badge variant="default" className="text-xs">
                    Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground">/{pkg.billing}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(pkg.id)}
                  disabled={isLoading && selectedPackage === pkg.id}
                >
                  {isLoading && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Need a custom solution?</CardTitle>
              <CardDescription>
                Contact our sales team for a tailored package that meets your specific requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team can help you customize a package that fits your business needs perfectly. Get in touch with us
                to discuss your requirements and get a personalized quote.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

