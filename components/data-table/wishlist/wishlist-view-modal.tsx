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
  IconMapPin,
  IconCalendar,
  IconCurrencyDollar,
  IconStar,
  IconStarFilled,
  IconPhoto,
  IconEye,
  IconEyeOff,
  IconUsers,
  IconFileText,
  IconFlag,
  IconCheck,
  IconClock,
  IconPlane,
  IconX,
  IconEdit,
  IconTrash,
  IconShare,
  IconHeart,
  IconCash,
  IconList,
  IconWorld,
  IconLock,
  IconLockOpen,
  IconChartLine,
  IconBuilding,
  IconNavigation,
  IconCalendarEvent,
  IconMoneybag,
} from "@tabler/icons-react"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { fetchWishlistById } from "@/server/fetch/fetchWhishlist"
import { Wishlist } from "@/types/whishlist"
import { getStatusConfig } from "@/utils/wishlistStatusOptions"

interface WishlistViewModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistId: string | null
  onEdit?: (wishlistId: string) => void
  onDelete?: (wishlistId: string) => void
  onTogglePublic?: (wishlistId: string, isPublic: boolean) => void
}

export function WishlistViewModal({
  isOpen,
  onClose,
  wishlistId,
  onEdit,
  onDelete,
  onTogglePublic
}: WishlistViewModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && wishlistId) {
      loadWishlist()
    }
  }, [isOpen, wishlistId])

  const loadWishlist = async () => {
    if (!wishlistId) return
    
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await fetchWishlistById(wishlistId)
      const d = data ?  data[0] : null
      
      if (error) {
        throw new Error(error.message || "Failed to load wishlist")
      }
      
      if (data) {
        setWishlist(d)
      } else {
        setError("Wishlist not found")
      }
    } catch (err: any) {
      console.error("Error loading wishlist:", err)
      setError(err.message || "Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }

  if (!wishlistId) return null

  const formatBudget = (amount: number | null, currency: string = 'USD') => {
    if (!amount) return "Not specified"
    return formatCurrency(amount, currency)
  }

  const renderRating = (rating: number | null) => {
    if (!rating) return "Not rated"
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          i < rating ? (
            <IconStarFilled key={i} className="size-4 text-yellow-500 fill-yellow-500" />
          ) : (
            <IconStar key={i} className="size-4 text-gray-300" />
          )
        ))}
        <span className="ml-2">({rating}/5)</span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconHeart className="size-5 text-red-500" />
            Wishlist Details
          </DialogTitle>
          <DialogDescription>
            View and manage your travel wishlist
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <IconX className="size-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Wishlist</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadWishlist}>Retry</Button>
          </div>
        ) : !wishlist ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <IconHeart className="size-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Wishlist Found</h3>
            <p className="text-muted-foreground">The requested wishlist could not be found.</p>
          </div>
        ) : (
          <>
            {/* Wishlist Header with Cover Image */}
            {/* <div className="relative rounded-lg overflow-hidden mb-6">
              {wishlist.cover_image ? (
                <div className="h-48">
                  <img
                    src={wishlist.cover_image}
                    alt={wishlist.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <IconMapPin className="size-12 text-white/80" />
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{wishlist.destination}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <IconFlag className="size-4" />
                      <span>{wishlist.destination_country || "Unknown country"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {wishlist.is_public ? (
                      <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        <IconEye className="size-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-black/40 text-white hover:bg-black/50">
                        <IconEyeOff className="size-3 mr-1" />
                        Private
                      </Badge>
                    )}
                    <Badge className={getStatusConfig(wishlist.status).bgColor}>
                      {getStatusConfig(wishlist.status).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div> */}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">
                  <IconHeart className="size-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="planning">
                  <IconCalendar className="size-4 mr-2" />
                  Planning
                </TabsTrigger>
                <TabsTrigger value="expenses">
                  <IconCurrencyDollar className="size-4 mr-2" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="media">
                  <IconPhoto className="size-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="details">
                  <IconFileText className="size-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[50vh] pr-4">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      title="Status"
                      value={getStatusConfig(wishlist.status).label}
                      icon={getStatusConfig(wishlist.status).icon}
                      color={getStatusConfig(wishlist.status).color }
                    />
                    <StatCard
                      title="Estimated Budget"
                      value={formatBudget(wishlist.estimated_budget, wishlist.currency?.toString())}
                      icon={IconMoneybag}
                      color="green"
                    />
                    <StatCard
                      title="Travel Dates"
                      value={
                        wishlist.target_start_date && wishlist.target_end_date
                          ? `${formatDate(wishlist.target_start_date)} - ${formatDate(wishlist.target_end_date)}`
                          : "Not set"
                      }
                      icon={IconCalendarEvent}
                      color="blue"
                    />
                    <StatCard
                      title="Travelers"
                      value={wishlist.travelers_count ? `${wishlist.travelers_count} people` : "Not set"}
                      icon={IconUsers}
                      color="purple"
                    />
                  </div>

                  {/* Destination Details */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconMapPin className="size-4" />
                      Destination Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        icon={IconWorld}
                        title="Destination"
                        value={wishlist.destination}
                      />
                      <InfoCard
                        icon={IconFlag}
                        title="Country"
                        value={wishlist.destination_country || "Not specified"}
                      />
                      <InfoCard
                        icon={IconNavigation}
                        title="Trip Status"
                        value={getStatusConfig(wishlist.status).label}
                      />
                      {wishlist.rating && (
                        <InfoCard
                          icon={IconStar}
                          title="Rating"
                          value={wishlist.rating.toString()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Trip Completion Info */}
                  {wishlist.status === 'completed' && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <IconCheck className="size-4 text-green-600" />
                        Trip Completed
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {wishlist.actual_start_date && wishlist.actual_end_date && (
                          <>
                            <InfoCard
                              icon={IconCalendar}
                              title="Actual Start Date"
                              value={formatDate(wishlist.actual_start_date)}
                            />
                            <InfoCard
                              icon={IconCalendar}
                              title="Actual End Date"
                              value={formatDate(wishlist.actual_end_date)}
                            />
                          </>
                        )}
                        {wishlist.total_cost && (
                          <InfoCard
                            icon={IconCash}
                            title="Total Cost"
                            value={formatBudget(wishlist.total_cost, wishlist.currency?.toString())}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Planning Tab */}
                <TabsContent value="planning" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconCalendar className="size-4" />
                      Trip Planning
                    </h4>
                    
                    {/* Target Dates */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconCalendar className="size-4 text-blue-600" />
                          Target Dates
                        </h5>
                        {wishlist.target_start_date && wishlist.target_end_date ? (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">From:</span> {formatDate(wishlist.target_start_date)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">To:</span> {formatDate(wishlist.target_end_date)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Duration: {calculateDuration(wishlist.target_start_date, wishlist.target_end_date)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No target dates set</p>
                        )}
                      </div>
                      
                      {/* Actual Dates (if completed) */}
                      {wishlist.status === 'completed' && wishlist.actual_start_date && wishlist.actual_end_date && (
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <IconCheck className="size-4 text-green-600" />
                            Actual Dates
                          </h5>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Started:</span> {formatDate(wishlist.actual_start_date)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Ended:</span> {formatDate(wishlist.actual_end_date)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Travel Group */}
                    <div className="mb-6">
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <IconUsers className="size-4 text-purple-600" />
                        Travel Group
                      </h5>
                      {wishlist.travelers_count ? (
                        <div className="flex items-center gap-2">
                          <IconUsers className="size-5 text-purple-500" />
                          <span>{wishlist.travelers_count} traveler(s)</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>

                    {/* Notes */}
                    {wishlist.notes && (
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconFileText className="size-4 text-gray-600" />
                          Notes & Plans
                        </h5>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <p className="text-sm whitespace-pre-wrap">{wishlist.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Expenses Tab */}
                <TabsContent value="expenses" className="space-y-6">
                  <div className="rounded-lg border p-2">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconCurrencyDollar className="size-4" />
                      Budget & Expenses
                    </h4>
                    
                    {/* Budget Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <IconMoneybag className="size-5 text-blue-600" />
                          <h5 className="font-medium">Estimated Budget</h5>
                        </div>
                        <p className="text-2xl font-bold">
                          {formatBudget(wishlist.estimated_budget, wishlist.currency?? "")}
                        </p>
                      </div>
                      
                      {wishlist.status === 'completed' && wishlist.total_cost && (
                        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <IconCash className="size-5 text-green-600" />
                            <h5 className="font-medium">Actual Cost</h5>
                          </div>
                          <p className="text-2xl font-bold">
                            {formatBudget(wishlist.total_cost, wishlist.currency?.toString())}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Expense Breakdown */}
                    {wishlist.expenses && Object.keys(wishlist.expenses).length > 0 ? (
                      <div>
                        <h5 className="font-medium mb-3">Expense Breakdown</h5>
                        <div className="space-y-3">
                          {Object.entries(wishlist.expenses).map(([category, amount], index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                              <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
                              <span className="font-medium">
                                {formatCurrency(amount as number, wishlist.currency || 'USD')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <IconCurrencyDollar className="size-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-muted-foreground">No expense breakdown available</p>
                      </div>
                    )}

                    {/* Travel Tips */}
                    {wishlist.tips && (
                      <div className="mt-6">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <IconList className="size-4 text-orange-600" />
                          Travel Tips
                        </h5>
                        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
                          <p className="text-sm whitespace-pre-wrap">{wishlist.tips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconPhoto className="size-4" />
                      Photos & Media
                    </h4>
                    
                    {wishlist.photos && wishlist.photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {wishlist.photos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                            <img
                              src={photo}
                              alt={`Trip photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(photo, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <IconPhoto className="size-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-muted-foreground">No photos added yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {wishlist.status === 'completed' 
                            ? "Add photos to remember your trip"
                            : "Add photos of places you want to visit"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconFileText className="size-4" />
                      Additional Details
                    </h4>
                    
                    {/* Privacy & Visibility */}
                    <div className="mb-6">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        {wishlist.is_public ? (
                          <>
                            <IconLockOpen className="size-4 text-green-600" />
                            Public Wishlist
                          </>
                        ) : (
                          <>
                            <IconLock className="size-4 text-gray-600" />
                            Private Wishlist
                          </>
                        )}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {wishlist.is_public 
                          ? "This wishlist is visible to other users. You can share it with friends and family."
                          : "This wishlist is private and only visible to you."
                        }
                      </p>
                    </div>

                    {/* Rating */}
                    {wishlist.rating && (
                      <div className="mb-6">
                        <h5 className="font-medium mb-2">Trip Rating</h5>
                        <div className="flex items-center gap-2">
                          {renderRating(wishlist.rating)}
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-3">
                      <h5 className="font-medium">Timeline</h5>
                      <InfoRow label="Created" value={formatDate(wishlist.created_at)} />
                      <InfoRow label="Last Updated" value={formatDate(wishlist.updated_at)} />
                      {wishlist.status === 'completed' && wishlist.actual_start_date && (
                        <InfoRow label="Trip Started" value={formatDate(wishlist.actual_start_date)} />
                      )}
                      {wishlist.status === 'completed' && wishlist.actual_end_date && (
                        <InfoRow label="Trip Ended" value={formatDate(wishlist.actual_end_date)} />
                      )}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
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
  color?: "default" | "blue" | "green" | "purple" | "orange" | "red"
}

function StatCard({ title, value, icon: Icon, color = "default" }: StatCardProps) {
  const colorClasses = {
    default: "text-gray-700 bg-gray-100 dark:bg-gray-800",
    blue: "text-blue-700 bg-blue-100 dark:bg-blue-950/30",
    green: "text-green-700 bg-green-100 dark:bg-green-950/30",
    purple: "text-purple-700 bg-purple-100 dark:bg-purple-950/30",
    orange: "text-orange-700 bg-orange-100 dark:bg-orange-950/30",
    red: "text-red-700 bg-red-100 dark:bg-red-950/30"
  }

  return (
    <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-5" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="font-bold truncate">{value}</p>
    </div>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

// Utility function to calculate duration between dates
function calculateDuration(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
}