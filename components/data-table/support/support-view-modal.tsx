"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  IconUser,
  IconCalendar,
  IconTag,
  IconCheck,
} from "@tabler/icons-react"
import { SupportTicketWithProfile } from "@/types/support"

interface SupportViewModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: SupportTicketWithProfile | null
}

export function SupportViewModal({
  isOpen,
  onClose,
  ticket,
}: SupportViewModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const statusColor =
    ticket?.status === "open"
      ? "bg-red-50 text-red-700"
      : ticket?.status === "pending"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-green-50 text-green-700"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
          <DialogDescription>
            View and manage support ticket information
          </DialogDescription>
        </DialogHeader>

        {ticket ? (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Ticket Header */}
              <div>
                <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>

              <Separator />

              {/* Status & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={statusColor}>{ticket.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary">{ticket.categoryId || "N/A"}</Badge>
                </div>
              </div>

              <Separator />

              {/* Reporter Information */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <IconUser className="size-4" />
                  Reporter Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{ticket.profiles?.full_name || ticket.userId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{ticket.profiles?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Agent Assignment */}
              {ticket.agentId && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <IconCheck className="size-4" />
                      Assigned Agent
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Agent ID</p>
                        <p className="text-sm font-medium">{ticket.agentId}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Dates */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <IconCalendar className="size-4" />
                  Dates
                </h3>
                <div className="pl-6">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{new Date(ticket.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No ticket data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
