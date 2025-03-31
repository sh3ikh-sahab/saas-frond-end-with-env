"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Building2,
  CreditCard,
  Home,
  LogOut,
  Package,
  Settings,
  User,
  Users,
  ChevronDown,
  FolderKanban,
  CheckSquare,
  BarChart,
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<number>(3)

  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard",
      },
      {
        title: "Profile",
        icon: User,
        href: "/profile",
      },
    ]

    const roleBasedItems = {
      CEO: [
        {
          title: "Company",
          icon: Building2,
          href: "/company",
        },
        {
          title: "Employees",
          icon: Users,
          href: "/employees",
        },
        {
          title: "Departments",
          icon: FolderKanban,
          href: "/departments",
        },
        {
          title: "Tasks",
          icon: CheckSquare,
          href: "/tasks",
        },
        {
          title: "Recruitment",
          icon: Users,
          href: "/recruitment",
        },
        {
          title: "Analytics",
          icon: BarChart,
          href: "/analytics",
        },
        {
          title: "Packages",
          icon: Package,
          href: "/packages",
        },
      ],
      HR: [
        {
          title: "Company",
          icon: Building2,
          href: "/company",
        },
        {
          title: "Employees",
          icon: Users,
          href: "/employees",
        },
        {
          title: "Departments",
          icon: FolderKanban,
          href: "/departments",
        },
        {
          title: "Tasks",
          icon: CheckSquare,
          href: "/tasks",
        },
        {
          title: "Recruitment",
          icon: Users,
          href: "/recruitment",
        },
        {
          title: "Analytics",
          icon: BarChart,
          href: "/analytics",
        },
        {
          title: "Packages",
          icon: Package,
          href: "/packages",
        },
      ],
      Manager: [
        {
          title: "Employees",
          icon: Users,
          href: "/employees",
        },
        {
          title: "Departments",
          icon: FolderKanban,
          href: "/departments",
        },
        {
          title: "Tasks",
          icon: CheckSquare,
          href: "/tasks",
        },
        {
          title: "Analytics",
          icon: BarChart,
          href: "/analytics",
        },
      ],
      Employee: [
        {
          title: "Tasks",
          icon: CheckSquare,
          href: "/tasks",
        },
      ],
      User: [
        {
          title: "Packages",
          icon: Package,
          href: "/packages",
        },
      ],
    }

    const paymentItems = [
      {
        title: "Make Payment",
        icon: CreditCard,
        href: "/payments/make",
      },
      {
        title: "Payment History",
        icon: CreditCard,
        href: "/payments/history",
      },
    ]

    return {
      main: [...commonItems, ...(roleBasedItems[user?.role || "User"] || [])],
      payments: paymentItems,
    }
  }

  const navItems = getNavItems()
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex flex-col items-start px-4 py-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                EMS
              </div>
              <span className="text-lg font-semibold">EMS</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.main.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.payments.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name || "User"}</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Payment Processed</span>
                      <span className="text-xs text-muted-foreground">
                        Your payment has been processed successfully
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Role Updated</span>
                      <span className="text-xs text-muted-foreground">Your role has been updated to Manager</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">New Employee Added</span>
                      <span className="text-xs text-muted-foreground">John Doe has joined the company</span>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/notifications" className="flex justify-center">
                    View all
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span>{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.role || "User"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

