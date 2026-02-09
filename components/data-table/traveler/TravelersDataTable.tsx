"use client"

import { DataTable } from "@/components/data-table"
import { travelerColumns } from "./traveler-columns"
import { useState, useEffect } from "react"
import { TravelerProfileA } from "@/types/traveler"
import { TravelerProfileViewModal } from "./traveler-view-modal"
import { deleteData } from "@/server/delete/deleteData"
export type TravelerForTable = TravelerProfileA & {
  status?: string
  target?: string
  limit?: string
  reviewer?: string
}

interface TravelerDataTableProps {
  data: TravelerProfileA[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  loadApiData?: boolean
  onPageChange?: (page: number, pageSize: number) => void
}

export function TravelersDataTable({
  data,
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange,
  loadApiData
}: TravelerDataTableProps) {

  const [agencyModal, setAgencyModal] = useState<{
    isOpen: boolean
    userId: string | null
  }>({
    isOpen: false,
    userId: null
  })
  const [travelers, setTravelers] = useState<TravelerForTable[]>(
    data.map(agency => ({
      ...agency,
      status: agency.status ? "Active" : "Inactive",
      target: "0",
      limit: "Unlimited",
      reviewer: "Not assigned"
    }))
  )

  // Update agencies when data changes (for server-side pagination)
  useEffect(() => {
    setTravelers(
      data.map(agency => ({
        ...agency,
        status: agency.status ? "Active" : "Inactive",
        target: "0",
        limit: "Unlimited",
        reviewer: "Not assigned"
      }))
    )
  }, [data])

  const handleAddAgency = () => {
    // const newAgency: TravelerForTable = {
    //   // id: Date.now(),
    //   // created_at: new Date().toISOString(),
    //   // email: "new@agency.com",
    //   // full_name: "New Agency",
    //   // role: "traveler",
    //   // status: "Active",
    //   // target: "0",
    //   // limit: "Unlimited",
    //   // reviewer: "Not assigned"
    // }
    // setTravelers([...travelers, newAgency])
  }

  const handleEditAgency = (agency: TravelerForTable) => {
    console.log("Edit agency:", agency)
  }

  const handleDeleteAgency = (agency: TravelerForTable) => {
    // await deleteData()
    setTravelers(travelers.filter(a => a.id !== agency.id))
  }

  // Function to open view modal
  const openViewModal = (agency: TravelerForTable) => {
    setAgencyModal({
      isOpen: true,
      userId: agency?.id.toString()
    })
  }
  // Close view modal
  const closeAgencyModal = () => {
    setAgencyModal({
      isOpen: false,
      userId: null
    })
  }
  
  return (
    <div className="space-y-4">
      <DataTable<TravelerForTable>
        data={travelers}
        columns={travelerColumns}
        title="travelers"
        description="Manage your travel agency partners"
        // addButtonLabel="Add Travelers"
        // onAddNew={handleAddAgency}
        // onEdit={handleEditAgency}
        onDelete={handleDeleteAgency}
        onpenViewModal={openViewModal}
        loadApiData={loadApiData}

        // Pagination props
        serverSidePagination={serverSidePagination}
        totalCount={totalCount}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        onPageChange={onPageChange}
      />
      <TravelerProfileViewModal
        isOpen={agencyModal.isOpen}
        onClose={closeAgencyModal}
        userId={agencyModal.userId}
      // onStatusChange={handleStatusChange}
      />
    </div>
  )
}