"use client"

import { useState, useEffect } from "react"
import SupportDataTable from "@/components/data-table/support/SupportDataTable"
import { fetchSupport } from "@/server/fetch/fetchSupport"
import { SupportTicketWithProfile } from "@/types/support"

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicketWithProfile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadApiData, setIsLoading] = useState(false);

  const loadTickets = async (page: number = 1, pageSize: number = 10) => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, count, error: fetchError } = await fetchSupport(page, pageSize)
      if (fetchError) {
        setError(fetchError.message || "Failed to load support tickets")
        setTickets([])
      } else {
        setTickets(data || [])
        setTotalCount(count || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load support tickets")
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])
  // For server-side pagination
  const handlePageChange = async (page: number, perPage: number) => {
    setCurrentPage(page);
    setPageSize(perPage);
    await loadTickets(page, perPage);
  };
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SupportDataTable
            data={tickets}
            error={error}
            initialPage={currentPage - 1}
            initialPageSize={pageSize}
            loadApiData={loadApiData}
            totalCount={totalCount}
            serverSidePagination={true}
            onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}
