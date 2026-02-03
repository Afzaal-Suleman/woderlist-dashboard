"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const checkAccess = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      router.replace("/");
      return;
    }

    const role = session.user.app_metadata?.role;

    if (role !== "superadmin") {
      router.replace("/");
      return;
    }

    setLoading(false);
  };

  checkAccess();
}, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
