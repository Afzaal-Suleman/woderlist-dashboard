"use client"

import { DataTable } from "@/components/data-table"
import { ShoutoutColumns } from "@/components/data-table/shoutout/shoutout-columns"
import { ShoutoutViewModal } from "@/components/data-table/shoutout/shoutout-view-modal"
import { useState, useEffect } from "react"
import { Shoutout } from "@/types/shoutout"
import { deleteData } from "@/server/delete/deleteData"

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
  title?: string
  description?: string
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  onRowClick?:(item: any) => void
  onPageChange?: (page: number, pageSize: number) => void
  loadApiData?:boolean
}

export function ShoutoutDataTable({
  data,
  title,
  description,
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange,
  onRowClick,
  loadApiData
}: AgenciesDataTableProps) {

  const [viewModal, setViewModal] = useState<{
    isOpen: boolean
    shoutout: Shoutout | null
  }>({
    isOpen: false,
    shoutout: null
  })

  const mapData = (data: Shoutout[]): AgencyForTable[] => {
    return data.map(agency => ({
      ...agency,
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

  const handleDeleteAgency = async(agency: AgencyForTable) => {
    // await deleteData()
    setShoutout(shoutout.filter(a => a.id !== agency.id))
  }

  const handleViewShoutout = (item: AgencyForTable) => {
    setViewModal({
      isOpen: true,
      shoutout: item as Shoutout
    })
  }

  const closeViewModal = () => {
    setViewModal({
      isOpen: false,
      shoutout: null
    })
  }

  return (
    <>
      <DataTable<AgencyForTable>
        data={shoutout}
        columns={ShoutoutColumns}
        title={title}
        description={description}
        addButtonLabel="Add Agency"
        loadApiData={loadApiData}
        // onAddNew={handleAddAgency}
        // onEdit={handleEditAgency}
        onDelete={handleDeleteAgency}
        onRowClick={onRowClick}
        onpenViewModal={handleViewShoutout}
        // Pagination props
        serverSidePagination={serverSidePagination}
        totalCount={totalCount}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        onPageChange={onPageChange}
      />

      <ShoutoutViewModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        shoutout={viewModal.shoutout}
      />
    </>
  )
}
