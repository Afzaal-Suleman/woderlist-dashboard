"use client"

import { DataTable } from "@/components/data-table"
import SupportColumns from "./support-columns"
import { SupportViewModal } from "./support-view-modal"
import { useState, useEffect } from "react"
import { SupportTicketWithProfile } from "@/types/support"

interface SupportTableProps {
  data?: SupportTicketWithProfile[]
  title?: string
  initialPage?: number
  initialPageSize?: number
  description?: string
  error?: string | null
  totalCount?: number
  loadApiData?: boolean
  serverSidePagination?: boolean
  onPageChange?: (page: number, pageSize: number) => void
}

export function SupportDataTable({ data, title = "Support Tickets", description = "Manage support tickets", totalCount, error, loadApiData = false, serverSidePagination = false, onPageChange, initialPage, initialPageSize }: SupportTableProps) {
  const [rows, setRows] = useState<SupportTicketWithProfile[]>(data || [])
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean
    ticket: SupportTicketWithProfile | null
  }>({
    isOpen: false,
    ticket: null,
  })

  useEffect(() => {
    if (data) setRows(data)
  }, [data])
  const handleViewTicket = (ticket: SupportTicketWithProfile) => {
    setViewModal({
      isOpen: true,
      ticket,
    })
  }

  const closeViewModal = () => {
    setViewModal({
      isOpen: false,
      ticket: null,
    })
  }

  // if (error) {
  //   return (
  //     <div className="border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg p-6">
  //       <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error Loading Tickets</h3>
  //       <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
  //     </div>
  //   )
  // }

  // if (loadApiData) {
  //   return (
  //     <div className="flex justify-center items-center p-8">
  //       <p className="text-gray-600 dark:text-gray-400">Loading support tickets...</p>
  //     </div>
  //   )
  // }

  return (
    <>
      <DataTable<SupportTicketWithProfile>
        data={rows}
        columns={SupportColumns}
        title={title}
        description={description}
        addButtonLabel="New Ticket"
        totalCount={totalCount}
        onpenViewModal={handleViewTicket}
        serverSidePagination={serverSidePagination}
        onPageChange={onPageChange}
        loadApiData={loadApiData}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
      // enableSearch={true}
      // searchPlaceholder="Search by subject or description..."
      // searchColumns={["subject", "description"]}
      />

      <SupportViewModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        ticket={viewModal.ticket}
      />
    </>
  )
}

export default SupportDataTable