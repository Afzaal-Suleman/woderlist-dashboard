"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useRole() {
  const [isSuperadmin, setIsSuperadmin] = useState(false)
    
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsSuperadmin(data.user?.app_metadata?.role === "superadmin")
    })
  }, [])

  return { isSuperadmin }
}
