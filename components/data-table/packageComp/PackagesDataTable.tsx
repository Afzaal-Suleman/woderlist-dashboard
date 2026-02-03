"use client"

import { DataTable } from "@/components/data-table"
import { PackageColumns } from "@/components/data-table/packageComp/Packages-column"
import { useState, useEffect } from "react"
import { Package } from "@/types/packages"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { statusOptions } from "@/utils/statusOptions"
import { PackageForTable } from "@/types/packages"
import { getStatusConfig } from "@/utils/statusOptions"
import { StatusChangeModal } from "@/components/status-confirmation-modal"
import {  changeStatusWithNotification } from "@/server/status-change"
import { PackageViewModal } from "./package-view-modal"
interface PackagesDataTableProps {
  data: Package[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  onPageChange?: (page: number, pageSize: number) => void
  onRefresh?: () => void
}

export function PackageDataTable({
  data,
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange,
  onRefresh
}: PackagesDataTableProps) {

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    package: PackageForTable | null
    newStatus: string | null
  }>({
    isOpen: false,
    package: null,
    newStatus: null
  })

   // Add view modal state
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean
    package: PackageForTable | null
  }>({
    isOpen: false,
    package: null
  })

  const mapData = (packages: Package[]): PackageForTable[] => {
    return packages.map(pkg => {
      const agency = pkg.agency_profiles
      const userProfile = agency?.user_profile
      const approverProfile = agency?.approver_profile

      return {
        ...pkg,
        status: pkg.status || "Inactive",
        target: pkg.target || "0",
        limit: pkg.limit || "Unlimited",
        reviewer: pkg.reviewer || "Not assigned",
        agencyName: agency?.business_name || "Unknown Agency",
        travelerName: userProfile?.full_name || pkg.travelerName || "Unknown",
        travelerEmail: userProfile?.email || "No email",
        approverName: approverProfile?.full_name || "Not approved",
        approverEmail: approverProfile?.email || "",
        profileCity: userProfile?.city || pkg.profileCity || "Unknown",
        isApproved: !!agency?.approved_by
      }
    })
  }

  const [packages, setPackages] = useState<PackageForTable[]>(mapData(data))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPackages(mapData(data))
  }, [data])

  const handleEditPackage = async (pkg: PackageForTable) => {
    console.log("Edit package:", pkg)
  }

  const handleDeletePackage = async (pkg: PackageForTable) => {
    if (!confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
      return
    }

    setLoading(true)
    try {
      // Call your delete API
      // await deletePackage(pkg.id)

      setPackages(prev => prev.filter(p => p.id !== pkg.id))

      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("Failed to delete package:", error)
      toast.error("Failed to delete package")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPackage = () => {
    console.log("Add new package")
  }

  // Handle dropdown selection
  const handleStatusSelect = (pkg: PackageForTable, newStatus: string) => {
    if (pkg.status === newStatus) return

    setStatusModal({
      isOpen: true,
      package: pkg,
      newStatus
    })
  }

  // Import the utility

  // Updated confirmStatusChange function
  const confirmStatusChange = async () => {
    if (!statusModal.package || !statusModal.newStatus) return;

    setLoading(true);
    try {
      // Use the reusable status change utility
      const result = await changeStatusWithNotification({
        tableName: "packages",
        id: statusModal.package.id,
        newStatus: statusModal.newStatus,
        statusColumn: "status",
        equalCol: "id",
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
        setPackages((prev: any) =>
          prev.map((p: PackageForTable) =>
            p.id === statusModal.package!.id
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
        package: null,
        newStatus: null,
      });
    }
  };
  // Close status modal
  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      package: null,
      newStatus: null
    })
  }
 // Function to open view modal
  const openViewModal = (pkg: PackageForTable) => {
    setViewModal({
      isOpen: true,
      package: pkg
    })
  }
    // Close view modal
  const closeViewModal = () => {
    setViewModal({
      isOpen: false,
      package: null
    })
  }
  // Enhanced columns with dropdown
  const enhancedColumns = PackageColumns.map((col: any) => {
    if (col?.accessorKey === "status") {
      return {
        ...col,
        cell: ({ row }: any) => {
          const pkg = row.original
          const status = pkg.status || "Inactive"
          const statusConfig = getStatusConfig(status)
          const Icon = statusConfig.icon

          return (
            <Select
              value={status}
              onValueChange={(newStatus) => handleStatusSelect(pkg, newStatus)}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue>
                  <Badge
                    variant="secondary"
                    className={`${statusConfig.bgColor} cursor-pointer`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className="size-3" />
                      {status}
                    </div>
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
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
      <DataTable<PackageForTable>
        data={packages}
        columns={enhancedColumns}
        title="Travel Packages"
        description="Manage your travel packages and offers"
        addButtonLabel="Add Package"
        onAddNew={handleAddPackage}
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
        onpenViewModal={openViewModal}
        // loading={loading}
        serverSidePagination={serverSidePagination}
        totalCount={totalCount}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        onPageChange={onPageChange}
      />

      {/* Status Change Confirmation Modal */}
      {/* <Dialog open={statusModal.isOpen} onOpenChange={closeStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this package?
            </DialogDescription>
          </DialogHeader>
          
          {statusModal.package && statusModal.newStatus && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium mb-1">{statusModal.package.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {statusModal.package.agencyName}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                  {(() => {
                    const currentConfig = getStatusConfig(statusModal.package.status || "Inactive")
                    const CurrentIcon = currentConfig.icon
                    return (
                      <Badge 
                        variant="secondary"
                        className={currentConfig.bgColor}
                      >
                        <div className="flex items-center gap-1">
                          <CurrentIcon className="size-3" />
                          {statusModal.package.status}
                        </div>
                      </Badge>
                    )
                  })()}
                </div>
                
                <div className="text-muted-foreground">→</div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">New Status</p>
                  {(() => {
                    const newConfig = getStatusConfig(statusModal.newStatus)
                    const NewIcon = newConfig.icon
                    return (
                      <Badge 
                        variant="secondary"
                        className={newConfig.bgColor}
                      >
                        <div className="flex items-center gap-1">
                          <NewIcon className="size-3" />
                          {statusModal.newStatus}
                        </div>
                      </Badge>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={closeStatusModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Confirm Change'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <StatusChangeModal
        isOpen={statusModal.isOpen}
        onClose={closeStatusModal}
        onConfirm={confirmStatusChange}
        package={statusModal.package}
        newStatus={statusModal.newStatus}
        loading={loading}
      />
        {/* Package View Modal */}
      <PackageViewModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        package={viewModal.package}
      />
    </div>
  )
}