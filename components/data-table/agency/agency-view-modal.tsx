"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import {
  IconBuilding,
  IconUser,
  IconMapPin,
  IconPhone,
  IconGlobe,
  IconCalendar,
  IconStar,
  IconCheck,
  IconX,
  IconClock,
  IconBan,
  IconFileText,
  IconWorld,
  IconLanguage,
  IconLink,
  IconMail,
  IconSettings,
  IconChartBar,
  IconShield,
  IconPhoto,
  IconExternalLink,
} from "@tabler/icons-react"
import { formatDate } from "@/utils/formatDate"
import { fetchAgencyProfileByUserId } from "@/server/fetch/fetchAgencies"
import { AgencyProfile } from "@/types/packages"
import { getStatusConfig } from "@/utils/agencyStatusOptions"

interface AgencyProfileViewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
  onStatusChange?: (agencyId: string, newStatus: any) => void
}




export function AgencyProfileViewModal({
  isOpen,
  onClose,
  userId,
  onStatusChange
}: AgencyProfileViewModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [agency, setAgency] = useState<AgencyProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      loadAgencyProfile()
    }
  }, [isOpen, userId])

  const loadAgencyProfile = async () => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await fetchAgencyProfileByUserId(userId)
      console.log(data, "data");
      
      const d = data ?  data[0] : null
      
      if (error) {
        throw new Error(error.message || "Failed to load agency profile")
      }
      
      if (data) {
        setAgency(d)
      } else {
        setError("Agency profile not found")
      }
    } catch (err: any) {
      console.error("Error loading agency profile:", err)
      setError(err.message || "Failed to load agency profile")
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="size-5" />
            {agency?.business_name || "Agency Profile"}
          </DialogTitle>
          <DialogDescription>
            Complete agency profile and business information
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <IconX className="size-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadAgencyProfile}>Retry</Button>
          </div>
        ) : !agency ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <IconBuilding className="size-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agency Profile Found</h3>
            <p className="text-muted-foreground">This user doesn't have an agency profile yet.</p>
          </div>
        ) : (
          <>
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {agency.logo_url && (
                  <div className="size-16 rounded-lg overflow-hidden border">
                    <img
                      src={agency.logo_url}
                      alt={`${agency.business_name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{agency.business_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {agency.city}, {agency.country}
                  </p>
                </div>
              </div>
              <Badge className={getStatusConfig(agency.status?? "_").bgColor}>
                <div className="flex items-center gap-1">
                  {getStatusConfig(agency.status ?? "_").label}
                </div>
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">
                  <IconBuilding className="size-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <IconUser className="size-4 mr-2" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="documents">
                  {/* <IconDocument className="size-4 mr-2" /> */}
                  Documents
                </TabsTrigger>
                <TabsTrigger value="services">
                  <IconWorld className="size-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <IconChartBar className="size-4 mr-2" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[50vh] pr-4">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Business Information */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconBuilding className="size-4" />
                      Business Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        icon={IconBuilding}
                        title="Registration Number"
                        value={agency.registration_number || "Not provided"}
                      />
                      <InfoCard
                        icon={IconMapPin}
                        title="Country"
                        value={agency.country?? ""}
                      />
                      <InfoCard
                        icon={IconMapPin}
                        title="City"
                        value={agency.city ?? "_"}
                      />
                      <InfoCard
                        icon={IconWorld}
                        title="Tour Type"
                        value={agency.tour_type ? 
                          agency.tour_type.charAt(0).toUpperCase() + agency.tour_type.slice(1) 
                          : "Not specified"
                        }
                      />
                    </div>
                    
                    {agency.address && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Address</p>
                        <p className="text-sm text-muted-foreground">{agency.address}</p>
                      </div>
                    )}
                    
                    {agency.description && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Description</p>
                        <p className="text-sm text-muted-foreground">{agency.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  {(agency.logo_url || agency.cover_image_url) && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <IconPhoto className="size-4" />
                        Images
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {agency.logo_url && (
                          <ImageCard
                            title="Logo"
                            url={agency.logo_url}
                            alt="Agency Logo"
                          />
                        )}
                        {agency.cover_image_url && (
                          <ImageCard
                            title="Cover Image"
                            url={agency.cover_image_url}
                            alt="Agency Cover Image"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconUser className="size-4" />
                      Contact Information
                    </h4>
                    
                    <div className="space-y-4">
                      <InfoRow 
                        icon={IconUser}
                        label="Contact Person"
                        value={agency.contact_name?? "_"}
                      />
                      <InfoRow 
                        icon={IconPhone}
                        label="Phone"
                        value={agency.phone || "Not provided"}
                      />
                      <InfoRow 
                        icon={IconMail}
                        label="Email"
                        value={agency.user_profile?.email || "Not available"}
                      />
                      
                      <Separator />
                      
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconGlobe className="size-4" />
                          Online Presence
                        </h5>
                        <div className="space-y-2 pl-6">
                          {agency.website && (
                            <div className="flex items-center gap-2">
                              <IconGlobe className="size-4 text-muted-foreground" />
                              <a 
                                href={agency.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {agency.website}
                                <IconExternalLink className="size-3" />
                              </a>
                            </div>
                          )}
                          {agency.instagram && (
                            <div className="flex items-center gap-2">
                              <IconLink className="size-4 text-muted-foreground" />
                              <a 
                                href={`https://instagram.com/${agency.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                @{agency.instagram.replace('@', '')}
                                <IconExternalLink className="size-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      {/* <IconDocument className="size-4" /> */}
                      Documents & Verification
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DocumentCard
                        title="Business License"
                        url={agency.license_url}
                        required
                      />
                      <DocumentCard
                        title="ID Verification"
                        url={agency.id_verification_url}
                        required
                      />
                      <DocumentCard
                        title="Tourism Permit"
                        url={agency.tourism_permit_url}
                        required
                      />
                    </div>

                    {/* Approval Information */}
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <h5 className="font-medium flex items-center gap-2">
                        <IconShield className="size-4" />
                        Approval Information
                      </h5>
                      
                      <InfoRow 
                        label="Status"
                        value={getStatusConfig(agency.status ?? "_").label}
                      />
                      
                      {agency.approved_at && (
                        <InfoRow 
                          label="Approved At"
                          value={formatDate(agency.approved_at)}
                        />
                      )}
                      
                      {agency.approved_by && agency.approver_profile && (
                        <>
                          <InfoRow 
                            label="Approved By"
                            value={agency.approver_profile.full_name || "Admin"}
                          />
                          <InfoRow 
                            label="Approver Email"
                            value={agency.approver_profile.email}
                          />
                        </>
                      )}
                      
                      {agency.status === 'rejected' && agency.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            {agency.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconWorld className="size-4" />
                      Services & Specializations
                    </h4>
                    
                    {/* Destinations Covered */}
                    {agency.destinations_covered && agency.destinations_covered.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconMapPin className="size-4" />
                          Destinations Covered
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {/* {agency.destinations_covered.map((destination, index) => (
                            <Badge key={index} variant="outline">
                              {destination}
                            </Badge>
                          ))} */}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {agency.languages && agency.languages.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconLanguage className="size-4" />
                          Languages Supported
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {/* {agency.languages.map((language, index) => (
                            <Badge key={index} variant="secondary">
                              {language}
                            </Badge>
                          ))} */}
                        </div>
                      </div>
                    )}

                    {/* Tour Type */}
                    <div>
                      <h5 className="font-medium mb-2">Tour Specialization</h5>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          agency.tour_type === 'international' ? 'default' : 
                          agency.tour_type === 'domestic' ? 'secondary' : 'outline'
                        }>
                          {agency.tour_type ? 
                            agency.tour_type.charAt(0).toUpperCase() + agency.tour_type.slice(1) 
                            : "Not specified"
                          }
                        </Badge>
                        {agency.tour_type === 'both' && (
                          <span className="text-sm text-muted-foreground">
                            (International & Domestic)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconChartBar className="size-4" />
                      Performance Statistics
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard
                        title="Total Bookings"
                        value={agency.total_bookings?.toString() || "0"}
                        icon={IconCalendar}
                      />
                      <StatCard
                        title="Average Rating"
                        value={Number(agency?.average_rating).toFixed(2) || "0.0"}
                        icon={IconStar}
                      />
                      <StatCard
                        title="Total Reviews"
                        value={agency.total_reviews?.toString() || "0"}
                        icon={IconFileText}
                      />
                      <StatCard
                        title="Status"
                        value={getStatusConfig(agency.status?? "-").label}
                        icon={getStatusConfig(agency.status ?? "_").icon}
                      />
                    </div>

                    <Separator className="my-4" />

                    {/* Timeline */}
                    <div className="space-y-3">
                      <h5 className="font-medium mb-2">Timeline</h5>
                      <InfoRow label="Created" value={formatDate(agency.created_at)} />
                      <InfoRow label="Last Updated" value={formatDate(agency.updated_at)} />
                      {agency.approved_at && (
                        <InfoRow label="Approved" value={formatDate(agency.approved_at)} />
                      )}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Action Buttons */}
            {onStatusChange && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {agency.status !== 'approved' && (
                  <Button
                    onClick={() => onStatusChange(agency.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <IconCheck className="mr-2 size-4" />
                    Approve Agency
                  </Button>
                )}
                {agency.status !== 'rejected' && (
                  <Button
                    variant="destructive"
                    onClick={() => onStatusChange(agency.id, 'rejected')}
                  >
                    <IconX className="mr-2 size-4" />
                    Reject Agency
                  </Button>
                )}
                {agency.status === 'approved' && (
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                    onClick={() => onStatusChange(agency.id, 'suspended')}
                  >
                    <IconBan className="mr-2 size-4" />
                    Suspend Agency
                  </Button>
                )}
              </div>
            )}
          </>
        )}
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
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <p className="text-sm">{value}</p>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: any
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <Icon className="size-6 mx-auto mb-2 text-primary" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{title}</p>
    </div>
  )
}

interface InfoRowProps {
  icon?: any
  label: string
  value: string
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm">{value}</span>
    </div>
  )
}

interface DocumentCardProps {
  title: string
  url?: string | null
  required?: boolean
}

function DocumentCard({ title, url, required }: DocumentCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium">{title}</p>
        {required && (
          <Badge variant="outline" className="text-xs">
            Required
          </Badge>
        )}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View Document
          <IconExternalLink className="size-3" />
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">Not provided</p>
      )}
    </div>
  )
}

interface ImageCardProps {
  title: string
  url: string
  alt: string
}

function ImageCard({ title, url, alt }: ImageCardProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="aspect-video rounded-lg overflow-hidden border">
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
    </div>
  )
}