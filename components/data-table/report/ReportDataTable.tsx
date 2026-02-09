"use client"

import { DataTable } from "@/components/data-table"
import { ReportColumns } from "@/components/data-table/report/report-column"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Report } from "@/types/report"

// Updated type: include nested traveler_profiles and profiles
export type ReportForTable = Report & {
    status?: string
    target?: string
    limit?: string
    reviewer?: string
    travelerName?: string   // derived from traveler_profiles
    profileCity?: string    // derived from nested profiles
}

interface ReportDataTableProps {
    data: Report[]
    totalCount?: number
    initialPage?: number
    initialPageSize?: number
    serverSidePagination?: boolean
    onPageChange?: (page: number, pageSize: number) => void
}

export function ReportDataTable({
    data,
    totalCount = 0,
    initialPage = 0,
    initialPageSize = 10,
    serverSidePagination = false,
    onPageChange
}: ReportDataTableProps) {

    const mapData = (data: Report[]): ReportForTable[] => {
        return data.map(rep => ({
            ...rep,
            // Compute status based on email or nested data
            //   status: agency.traveler_profiles?.full_name ? "Active" : "Inactive",
            //   target: "0",
            //   limit: "Unlimited",
            //   reviewer: "Not assigned",
            //   travelerName: agency.traveler_profiles?.full_name || "Unknown",
            //   profileCity: agency.traveler_profiles?.profiles?.city || "Unknown"
        }))
    }
    const router = useRouter()

    const [shoutout, setShoutout] = useState<ReportForTable[]>(mapData(data))

    // Update agencies when data changes (for server-side pagination)
    useEffect(() => {
        setShoutout(mapData(data))
    }, [data])

    const handleEditAgency = (agency: ReportForTable) => {
        console.log("Edit agency:", agency)
    }

    const handleDeleteAgency = (agency: ReportForTable) => {
        setShoutout(shoutout.filter(a => a.id !== agency.id))
    }

    return (
        <DataTable<ReportForTable>
            data={shoutout}
            columns={ReportColumns}
            title="Reports"
            description="Manage your reports"
            addButtonLabel="Add Agency"
            // onAddNew={handleAddAgency}
            // onEdit={handleEditAgency}
            onDelete={handleDeleteAgency}
            // onRowClick={(user) =>router.push(`/dashboard/report/${user.id}`)}
            // Pagination props
            serverSidePagination={serverSidePagination}
            totalCount={totalCount}
            initialPage={initialPage}
            initialPageSize={initialPageSize}
            onPageChange={onPageChange}
        />
    )
}
