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
  IconMapPin,
  IconPhone,
  IconMail,
  IconCalendar,
  IconTag,
} from "@tabler/icons-react"
import { formatDate } from "@/utils/formatDate"
import { Shoutout } from "@/types/shoutout"

interface ShoutoutViewModalProps {
  isOpen: boolean
  onClose: () => void
  shoutout: Shoutout | null
}

export function ShoutoutViewModal({
  isOpen,
  onClose,
  shoutout,
}: ShoutoutViewModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Shoutout Details</DialogTitle>
          <DialogDescription>
            View shoutout information and author details
          </DialogDescription>
        </DialogHeader>

        {shoutout ? (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Author Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <IconUser className="size-4" />
                  Author Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{shoutout.profiles?.full_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconMail className="size-3" />
                      Email
                    </p>
                    <p className="text-sm font-medium">{shoutout.profiles?.email || "N/A"}</p>
                  </div>
                  {shoutout.profiles?.profiles?.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconPhone className="size-3" />
                        Phone
                      </p>
                      <p className="text-sm font-medium">{shoutout.profiles.profiles.phone}</p>
                    </div>
                  )}
                  {shoutout.profiles?.profiles?.city && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconMapPin className="size-3" />
                        Location
                      </p>
                      <p className="text-sm font-medium">{shoutout.profiles.profiles.city}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Shoutout Content Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Shoutout Content</h3>
                <div className="space-y-4 pl-0">
                  <div>
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="text-sm font-medium mt-1">{shoutout.title || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Message</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                      {shoutout.content || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tags Section */}
              {shoutout.tags && shoutout.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <IconTag className="size-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {shoutout.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Dates Section */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <IconCalendar className="size-4" />
                  Dates
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {shoutout.created_at ? formatDate(shoutout.created_at) : "N/A"}
                    </p>
                  </div>
                  {shoutout.updated_at && (
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{formatDate(shoutout.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No shoutout data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
