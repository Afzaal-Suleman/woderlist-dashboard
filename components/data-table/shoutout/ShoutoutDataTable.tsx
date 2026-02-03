"use client"

import { DataTable } from "@/components/data-table"
import { ShoutoutColumns } from "@/components/data-table/shoutout/shoutout-columns"
import { useState, useEffect } from "react"
import { Shoutout } from "@/types/shoutout"

// Updated type: include nested traveler_profiles and profiles
export type AgencyForTable = Shoutout & {
  status?: string
  target?: string
  limit?: string
  reviewer?: string
  travelerName?: string   // derived from traveler_profiles
  profileCity?: string    // derived from nested profiles
}

interface AgenciesDataTableProps {
  data: Shoutout[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  onPageChange?: (page: number, pageSize: number) => void
}

export function ShoutoutDataTable({ 
  data, 
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange 
}: AgenciesDataTableProps) {

  const mapData = (data: Shoutout[]): AgencyForTable[] => {
    return data.map(agency => ({
      ...agency,
      // Compute status based on email or nested data
      status: agency.traveler_profiles?.full_name ? "Active" : "Inactive",
      target: "0",
      limit: "Unlimited",
      reviewer: "Not assigned",
      travelerName: agency.traveler_profiles?.full_name || "Unknown",
      profileCity: agency.traveler_profiles?.profiles?.city || "Unknown"
    }))
  }

  const [shoutout, setShoutout] = useState<AgencyForTable[]>(mapData(data))

  // Update agencies when data changes (for server-side pagination)
  useEffect(() => {
    setShoutout(mapData(data))
  }, [data])

  const handleEditAgency = (agency: AgencyForTable) => {
    console.log("Edit agency:", agency)
  }

  const handleDeleteAgency = (agency: AgencyForTable) => {
    setShoutout(shoutout.filter(a => a.id !== agency.id))
  }

  return (
    <DataTable<AgencyForTable>
      data={shoutout}
      columns={ShoutoutColumns}
      title="Travel Agencies"
      description="Manage your travel agency partners"
      addButtonLabel="Add Agency"
      // onAddNew={handleAddAgency}
      onEdit={handleEditAgency}
      onDelete={handleDeleteAgency}

      // Pagination props
      serverSidePagination={serverSidePagination}
      totalCount={totalCount}
      initialPage={initialPage}
      initialPageSize={initialPageSize}
      onPageChange={onPageChange}
    />
  )
}
