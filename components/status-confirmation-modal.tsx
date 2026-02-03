// components/modals/status-change-modal.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClock,
  IconEdit,
  IconBan,
} from "@tabler/icons-react"
import { PackageForTable } from "@/types/packages"
interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  package: any | null
  newStatus: string | null
  loading?: boolean
}

import { AgencyForTable } from "./data-table/agency/AgenciesDataTable"

// Status options configuration
const statusOptions = [
  { 
    value: "Active", 
    label: "Active", 
    icon: IconCircleCheckFilled, 
    bgColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  },
  { 
    value: "Inactive", 
    label: "Inactive", 
    icon: IconCircleXFilled, 
    bgColor: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  },
  { 
    value: "Pending", 
    label: "Pending", 
    icon: IconClock, 
    bgColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  { 
    value: "Draft", 
    label: "Draft", 
    icon: IconEdit, 
    bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  },
  { 
    value: "Rejected", 
    label: "Rejected", 
    icon: IconBan, 
    bgColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  },
]

// Helper function to get status config
const getStatusConfig = (status: string) => {
  return statusOptions.find(opt => opt.value === status) || statusOptions[1] // Default to Inactive
}

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  package: pkg,
  newStatus,
  loading = false
}: StatusChangeModalProps) {
  if (!pkg || !newStatus) return null

  const currentConfig = getStatusConfig(pkg.status || "Inactive")
  const CurrentIcon = currentConfig.icon
  
  const newConfig = getStatusConfig(newStatus)
  const NewIcon = newConfig.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the status of this package?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-3">
            <h4 className="font-medium mb-1">{pkg.title}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Agency:</span>
                <p className="font-medium">{pkg.agencyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Author:</span>
                <p className="font-medium">{pkg.travelerName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Status</p>
              <Badge 
                variant="secondary"
                className={currentConfig.bgColor}
              >
                <div className="flex items-center gap-1">
                  <CurrentIcon className="size-3" />
                  {pkg.status}
                </div>
              </Badge>
            </div>
            
            <div className="text-muted-foreground">→</div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">New Status</p>
              <Badge 
                variant="secondary"
                className={newConfig.bgColor}
              >
                <div className="flex items-center gap-1">
                  <NewIcon className="size-3" />
                  {newStatus}
                </div>
              </Badge>
            </div>
          </div>
          
          {pkg.content && (
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm line-clamp-2">{pkg.content}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
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
    </Dialog>
  )
}