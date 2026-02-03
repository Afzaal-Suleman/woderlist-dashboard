"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  IconPackage,
  IconUser,
  IconBuilding,
  IconHistory,
  IconSettings,
  IconInfoCircle,
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconStar,
  IconPhoto,
  IconMail,
  IconCheck,
  IconX,
  IconClock,
  IconTarget,
  IconChartBar,
  IconWorld,
  IconBed,
  IconSun,
} from "@tabler/icons-react"
import { formatDate } from "@/utils/formatDate"
import { PackageForTable } from "@/types/packages"
import { statusOptions, getStatusConfig } from "@/utils/statusOptions"

interface PackageViewModalProps {
  isOpen: boolean
  onClose: () => void
  package: PackageForTable | null
}


export function PackageViewModal({
  isOpen,
  onClose,
  package: pkg,
}: PackageViewModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!pkg) return null



  const statusInfo = getStatusConfig(pkg.status || "paused")
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPackage className="size-5" />
            {pkg.title}
          </DialogTitle>
          <DialogDescription>
            Complete package details and information
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">
              <IconInfoCircle className="size-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="agency">
              <IconBuilding className="size-4 mr-2" />
              Agency
            </TabsTrigger>
            <TabsTrigger value="details">
              <IconPackage className="size-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="stats">
              <IconChartBar className="size-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] pr-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Header with status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{pkg.title}</h3>
                  {/* <p className="text-sm text-muted-foreground mt-1">
                    ID: {pkg.id}
                  </p> */}
                </div>
                <Badge className={statusInfo.color}>
                  <div className="flex items-center gap-1">
                    <StatusIcon className="size-3" />
                    {statusInfo.label}
                  </div>
                </Badge>
              </div>

              {/* Short Description */}
              {pkg.short_description && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm">{pkg.short_description}</p>
                </div>
              )}

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard
                  icon={IconWorld}
                  title="Destination"
                  value={pkg.destination || "Not specified"}
                />
                <InfoCard
                  icon={IconSun}
                  title="Duration Days"
                  value={pkg.duration_days?.toString() || "0"}
                />
                <InfoCard
                  icon={IconBed}
                  title="Duration Nights"
                  value={pkg.duration_nights?.toString() || "0"}
                />
                <InfoCard
                  icon={IconUsers}
                  title="Max Travelers"
                  value={pkg.max_travelers?.toString() || "Unlimited"}
                />
              </div>

              {/* Age Restrictions */}
              {(pkg.min_age || pkg.max_age) && (
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Age Restrictions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="Minimum Age" value={pkg.min_age ? `${pkg.min_age} years` : "No minimum"} />
                    <InfoRow label="Maximum Age" value={pkg.max_age ? `${pkg.max_age} years` : "No maximum"} />
                  </div>
                </div>
              )}

              {/* Images Preview */}
              {pkg.images && pkg.images.length > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IconPhoto className="size-4" />
                    <h4 className="font-semibold">Package Images ({pkg.images.length})</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {pkg.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={`Package image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {pkg.images.length > 4 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      + {pkg.images.length - 4} more images
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Agency Tab */}
            <TabsContent value="agency" className="space-y-6">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <IconBuilding className="size-4" />
                  Agency Information
                </h4>
                
                <div className="space-y-4">
                  <InfoRow label="Business Name" value={pkg.agency_profiles?.business_name || "Not specified"} />
                  {/* <InfoRow label="Agency ID" value={pkg.agency_profiles?.id || "N/A"} /> */}
                  
                  <Separator />
                  
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <IconUser className="size-4" />
                      Author Information
                    </h5>
                    <div className="space-y-2 pl-6">
                      <InfoRow label="Name" value={pkg.travelerName || "Unknown"} />
                      {pkg.travelerEmail && (
                        <div className="flex items-center gap-2">
                          <IconMail className="size-4 text-muted-foreground" />
                          <a 
                            href={`mailto:${pkg.travelerEmail}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {pkg.travelerEmail}
                          </a>
                        </div>
                      )}
                      <InfoRow label="City" value={pkg.agency_profiles?.city || "N/A"} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* <div>
                    <h5 className="font-medium mb-2">Approval Status</h5>
                    <div className="space-y-2 pl-6">
                      <InfoRow 
                        label="Approved By" 
                        value={pkg.agency_profiles?.approved_by || "Not approved yet"} 
                      />
                      {pkg.approverName && pkg.approverName !== "Not approved" && (
                        <InfoRow label="Approver Name" value={pkg.approverName} />
                      )}
                      {pkg.approverEmail && (
                        <InfoRow label="Approver Email" value={pkg.approverEmail} />
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Timeline Information */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <IconCalendar className="size-4" />
                  Timeline
                </h4>
                <div className="space-y-3">
                  <InfoRow label="Created Date" value={formatDate(pkg.created_at)} />
                  <InfoRow label="Last Updated" value={formatDate(pkg.updated_at)} />
                  <InfoRow 
                    label="Published Date" 
                    value={pkg.published_at ? formatDate(pkg.published_at) : "Not published"} 
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <IconMapPin className="size-4" />
                  Location Details
                </h4>
                <div className="space-y-3">
                  <InfoRow label="Destination" value={pkg.destination || "Not specified"} />
                  <InfoRow label="Profile City" value={pkg.profileCity || "Unknown"} />
                </div>
              </div>

              {/* Package Configuration */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4">Package Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    icon={IconUsers}
                    title="Duration (Days/Nights)"
                    value={`${pkg.duration_days || 0}d / ${pkg.duration_nights || 0}n`}
                  />
                  <InfoCard
                    icon={IconTarget}
                    title="Max Travelers"
                    value={pkg.max_travelers?.toString() || "Unlimited"}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <IconChartBar className="size-4" />
                  Performance Statistics
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Bookings"
                    value={pkg.total_bookings?.toString() || "0"}
                    trend="up"
                    description="All-time bookings"
                  />
                  <StatCard
                    title="Total Reviews"
                    value={pkg.total_reviews?.toString() || "0"}
                    trend="neutral"
                    description="Customer reviews"
                  />
                  <StatCard
                    title="Status"
                    value={statusInfo.label}
                    trend="neutral"
                    description="Current status"
                  />
                  <StatCard
                    title="Age Range"
                    value={`${pkg.min_age || "Any"}-${pkg.max_age || "Any"}`}
                    trend="neutral"
                    description="Years"
                  />
                </div>

                <Separator className="my-4" />

                {/* Booking Analytics */}
                <div>
                  <h5 className="font-medium mb-3">Booking Analytics</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Booking Rate</span>
                      <span className="text-sm font-medium">
                        {pkg.total_bookings && pkg.max_travelers 
                          ? `${((pkg.total_bookings / pkg.max_travelers) * 100).toFixed(1)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{
                          width: pkg.total_bookings && pkg.max_travelers 
                            ? `${Math.min((pkg.total_bookings / pkg.max_travelers) * 100, 100)}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <IconSettings className="size-4" />
                  System Information
                </h4>
                <div className="space-y-2 text-sm">
                  <InfoRow label="Package ID" value={pkg.id} />
                  <InfoRow label="Agency ID" value={pkg.agency_profiles?.id || "N/A"} />
                  <InfoRow label="Created" value={formatDate(pkg.created_at)} />
                  <InfoRow label="Last Updated" value={formatDate(pkg.updated_at)} />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Helper Components
interface InfoCardProps {
  icon: any
  title: string
  value: string
}

function InfoCard({ icon: Icon, title, value }: InfoCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  trend: "up" | "down" | "neutral"
  description: string
}

function StatCard({ title, value, trend, description }: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  }

  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold my-1">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}