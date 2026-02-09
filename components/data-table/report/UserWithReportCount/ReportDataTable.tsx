"use client"

import { DataTable } from "@/components/data-table"
import { UserWithReportCountColumns } from "@/components/data-table/report/UserWithReportCount/report-column"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserWithReportCount } from "@/server/fetch/fetchUsersWithReportCount";

// Updated type: include nested traveler_profiles and profiles
export type AgencyForTable = UserWithReportCount & {
    status?: string
    target?: string
    limit?: string
    reviewer?: string
    travelerName?: string   // derived from traveler_profiles
    profileCity?: string    // derived from nested profiles
}

interface ReportDataTableProps {
    data: UserWithReportCount[]
    totalCount?: number
    initialPage?: number
    initialPageSize?: number
    serverSidePagination?: boolean
    loadApiData?:boolean
    onPageChange?: (page: number, pageSize: number) => void
}

export function ReportDataTable({
    data,
    totalCount = 0,
    initialPage = 0,
    initialPageSize = 10,
    serverSidePagination = false,
    onPageChange,
    loadApiData
}: ReportDataTableProps) {

    const mapData = (data: UserWithReportCount[]): AgencyForTable[] => {
        return data.map(agency => ({
            ...agency,
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
            columns={UserWithReportCountColumns}
            title="Reports"
            description="Manage your reports"
            addButtonLabel="Add Agency"

            enableSearch={true}
            searchPlaceholder="Search by name or email..."
            searchColumns={['full_name', 'email', 'role']}
            loadApiData={loadApiData}
            //server side
            // enableSearch={true}
            // serverSidePagination={true}
            // onSearch={(searchTerm) => {
            //     fetchData({ search: searchTerm, page: 1, pageSize: 10 })
            // }}
            // onAddNew={handleAddAgency}
            // onEdit={handleEditAgency}
            onDelete={handleDeleteAgency}
            onRowClick={(user) => router.push(`/dashboard/report/${user.id}?r=${user.role}`)
            }
            // Pagination props
            serverSidePagination={serverSidePagination}
            totalCount={totalCount}
            initialPage={initialPage}
            initialPageSize={initialPageSize}
            onPageChange={onPageChange}
        />
    )
}
