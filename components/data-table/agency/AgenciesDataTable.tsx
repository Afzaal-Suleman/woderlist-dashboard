"use client"

import { DataTable } from "@/components/data-table"
import { agencyColumns } from "@/components/data-table/agency/agency-columns"
import { useState, useEffect } from "react"
import { AgencyProfileViewModal } from "./agency-view-modal"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { StatusChangeModal } from "@/components/status-confirmation-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {  changeStatusWithNotification } from "@/server/status-change"
import {statusConfig, getStatusConfig } from "@/utils/agencyStatusOptions"

export type AgencyFromDB = {
  id: number
  created_at: string
  email: string | null
  full_name: string | null
  role: string | null
}

export type AgencyForTable = AgencyFromDB & {
  status?: string
  target?: string
  limit?: string
  reviewer?: string
}

interface AgenciesDataTableProps {
  data: AgencyFromDB[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  onPageChange?: (page: number, pageSize: number) => void
  onRefresh?: () => void
}

export function AgenciesDataTable({ 
  data, 
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange,
  onRefresh,
}: AgenciesDataTableProps) {

  // Add view modal state
     const [agencyModal, setAgencyModal] = useState<{
    isOpen: boolean
    userId: string | null
  }>({
    isOpen: false,
    userId: null
  })

   const [statusModal, setStatusModal] = useState<{
      isOpen: boolean
      agency: AgencyForTable | null
      newStatus: string | null
    }>({
      isOpen: false,
      agency: null,
      newStatus: null
    })
  const [loading, setLoading] = useState(false)

  const [agencies, setAgencies] = useState<AgencyForTable[]>(
    data.map(agency => ({
      ...agency,
      status: agency.email ? "Active" : "Inactive",
      target: "0",
      limit: "Unlimited",
      reviewer: "Not assigned"
    }))
  )

  // Update agencies when data changes (for server-side pagination)
  useEffect(() => {
    setAgencies(
      data.map(agency => ({
        ...agency,
        status: agency.email ? "Active" : "Inactive",
        target: "0",
        limit: "Unlimited",
        reviewer: "Not assigned"
      }))
    )
  }, [data])

  const handleAddAgency = () => {
    const newAgency: AgencyForTable = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      email: "new@agency.com",
      full_name: "New Agency",
      role: "traveler",
      status: "Active",
      target: "0",
      limit: "Unlimited",
      reviewer: "Not assigned"
    }
    setAgencies([...agencies, newAgency])
  }

  const handleEditAgency = (agency: AgencyForTable) => {
    console.log("Edit agency:", agency)
  }

  const handleDeleteAgency = (agency: AgencyForTable) => {
    setAgencies(agencies.filter(a => a.id !== agency.id))
  }

   // Function to open view modal
    const openViewModal = (agency: AgencyForTable) => {
      setAgencyModal({
        isOpen: true,
        userId:  agency?.id.toString()
      })
    }
      // Close view modal
    const closeAgencyModal = () => {
      setAgencyModal({
        isOpen: false,
        userId: null
      })
    }

      // Handle dropdown selection
  const handleStatusSelect = (pkg: AgencyForTable, newStatus: string) => {
    if (pkg.status === newStatus) return

    setStatusModal({
      isOpen: true,
      agency: pkg,
      newStatus
    })
  }

  // Import the utility

  // Updated confirmStatusChange function
  const confirmStatusChange = async () => {
    if (!statusModal.agency || !statusModal.newStatus) return;

    setLoading(true);
    try {
      // Use the reusable status change utility
      const result = await changeStatusWithNotification({
        tableName: "agency_profiles",
        id: statusModal.agency.id.toString(),
        newStatus: statusModal.newStatus,
        statusColumn: "status",
        equalCol: "user_id",
        // Additional data if needed
        // additionalData: {
        //   updated_by: "current_user_id", // Add user ID if needed
        // },
        // Success callback
        onSuccess: (updatedData) => {
          console.log("Package updated:", updatedData);
        },
        // Error callback
        onError: (error) => {
          console.error("Update error:", error);
        },
        // Custom messages
        successMessage: `Package status updated to ${statusModal.newStatus}`,
        errorMessage: "Failed to update package status",
      });

      if (result.success) {
        // Update local state with the returned data
        setAgencies((prev: any) =>
          prev.map((p: AgencyForTable) =>
            p.id === statusModal.agency!.id
              ? { ...p, status: statusModal.newStatus! }
              : p
          )
        );

        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
      setStatusModal({
        isOpen: false,
        agency: null,
        newStatus: null,
      });
    }
  };
  // Close status modal
  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      agency: null,
      newStatus: null
    })
  }

    // Enhanced columns with dropdown
  const enhancedColumns = agencyColumns.map((col: any) => {
    if (col?.accessorKey === "status") {
      return {
        ...col,
        cell: ({ row }: any) => {
          const pkg = row.original
          const status = pkg.status || "Inactive"
          const statusConfigsn = getStatusConfig(status)
          const Icon = statusConfigsn.icon

          return (
            <Select
              value={status}
              onValueChange={(newStatus) => handleStatusSelect(pkg, newStatus)}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue>
                  <Badge
                    variant="secondary"
                    className={`${statusConfigsn.bgColor} cursor-pointer`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className="size-3" />
                      {status}
                    </div>
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusConfig.map((option) => {
                  const OptionIcon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <OptionIcon className={`size-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }
      }
    }
    return col
  })
  return (
    <div className="space-y-4">

    <DataTable<AgencyForTable>
      data={agencies}
      columns={enhancedColumns}
      title="Travel Agencies"
      description="Manage your travel agency partners"
      addButtonLabel="Add Agency"
      onAddNew={handleAddAgency}
      onEdit={handleEditAgency}
      onDelete={handleDeleteAgency}
      onpenViewModal={openViewModal}
      
      // Pagination props
      serverSidePagination={serverSidePagination}
      totalCount={totalCount}
      initialPage={initialPage}
      initialPageSize={initialPageSize}
      onPageChange={onPageChange}
    />

          {/* Agency Profile Modal */}
      <AgencyProfileViewModal
        isOpen={agencyModal.isOpen}
        onClose={closeAgencyModal}
        userId={agencyModal.userId}
        // onStatusChange={handleStatusChange}
      />

       <StatusChangeModal
              isOpen={statusModal.isOpen}
              onClose={closeStatusModal}
              onConfirm={confirmStatusChange}
              package={statusModal.agency}
              newStatus={statusModal.newStatus}
              loading={loading}
            />
      </div>

  )
}