"use client"

import * as React from "react"
import { useSession } from "@/components/providers/SessionProvider"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconLifebuoy,
  IconCreditCard,
  IconBroadcast,
  IconPackage,
  IconHeart,
  
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession()

  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "user@example.com",
    avatar: user?.user_metadata?.avatar_url || "/avatars/default.jpg",
  }

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Agencies",
        url: "/dashboard/agencies",
        icon: IconUsers,
      },
      {
        title: "Travelers",
        url: "/dashboard/travelers",
        icon: IconUsers,
      },
      {
        title: "Subscriptions",
        url: "/dashboard/subscriptions",
        icon: IconCreditCard,
      },
      {
        title: "Shoutout",
        url: "/dashboard/shoutout",
        icon: IconBroadcast,
      },
      {
        title: "Packages",
        url: "/dashboard/packages",
        icon: IconPackage,
      },
      {
        title: "Wishlist",
        url: "/dashboard/wishlist",
        icon: IconHeart,
      },
      {
        title: "Support",
        url: "/dashboard/support",
        icon: IconLifebuoy,
      },
      {
        title: "Report",
        url: "/dashboard/report",
        icon: IconReport ,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Wonderlist.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
