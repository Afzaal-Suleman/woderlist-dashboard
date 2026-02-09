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
  IconUser,
  IconMapPin,
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
  IconCurrencyDollar,
  IconPlane,
  IconCoin,
  IconTrendingUp,
  IconFlag,
  IconHeart,
  IconMap,
} from "@tabler/icons-react"
import { formatDate } from "@/utils/formatDate"
import { fetchTravelerProfileByUserId } from "@/server/fetch/fetchTravelers"
import { TravelerProfile } from "@/types/traveler"

interface TravelerProfileViewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
  onStatusChange?: (profileId: string, newStatus: any) => void
}

export function TravelerProfileViewModal({
  isOpen,
  onClose,
  userId,
  onStatusChange
}: TravelerProfileViewModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<TravelerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      loadTravelerProfile()
    }
  }, [isOpen, userId])

  const loadTravelerProfile = async () => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await fetchTravelerProfileByUserId(userId)
      
      const d = data ?  data[0] : null

    console.log(d, data, profile);
    
      if (error) {
        throw new Error(error.message || "Failed to load traveler profile")
      }
      
      if (d) {
        setProfile(d)
      } else {
        setError("Traveler profile not found")
      }
    } catch (err: any) {
      console.error("Error loading traveler profile:", err)
      setError(err.message || "Failed to load traveler profile")
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="size-5" />
            Traveler Profile
          </DialogTitle>
          <DialogDescription>
            Traveler preferences, statistics, and journey history
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
            <Button onClick={loadTravelerProfile}>Retry</Button>
          </div>
        ) : !profile ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <IconUser className="size-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Traveler Profile Found</h3>
            <p className="text-muted-foreground">This user hasn't created a traveler profile yet.</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <IconUser className="size-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {profile.user_profile?.full_name || "Traveler"}
                  </h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <IconMapPin className="size-4" />
                    {profile.user_profile?.city || "Location not set"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                <div className="flex items-center gap-1">
                  <IconPlane className="size-4" />
                  Traveler
                </div>
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">
                  <IconUser className="size-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="interests">
                  <IconHeart className="size-4 mr-2" />
                  Interests
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <IconChartBar className="size-4 mr-2" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <IconCalendar className="size-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[50vh] pr-4">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Traveler Information */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconUser className="size-4" />
                      Traveler Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        icon={IconUser}
                        title="Member Since"
                        value={formatDate(profile.created_at)}
                      />
                      <InfoCard
                        icon={IconCurrencyDollar}
                        title="Preferred Currency"
                        value={profile.preferred_currency || "USD"}
                      />
                      <InfoCard
                        icon={IconWorld}
                        title="Travel Style"
                        value={profile.travel_style ? 
                          profile.travel_style.charAt(0).toUpperCase() + profile.travel_style.slice(1) 
                          : "Not specified"
                        }
                      />
                      <InfoCard
                        icon={IconFlag}
                        title="Countries Visited"
                        value={profile.countries_visited?.toString() || "0"}
                      />
                    </div>
                    
                    {/* Contact Information */}
                    <Separator className="my-4" />
                    
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <IconMail className="size-4" />
                        Contact
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-sm">{profile.user_profile?.email || "Not available"}</p>
                        </div>
                        {profile.user_profile?.phone && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="text-sm">{profile.user_profile.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      title="Total Trips"
                      value={profile.total_trips?.toString() || "0"}
                      icon={IconPlane}
                      color="blue"
                    />
                    <StatCard
                      title="Total Spent"
                      value={`${profile.preferred_currency || 'USD'} ${profile.total_spent?.toLocaleString() || '0'}`}
                      icon={IconCoin}
                      color="green"
                    />
                  </div>
                </TabsContent>

                {/* Interests Tab */}
                <TabsContent value="interests" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconHeart className="size-4" />
                      Travel Interests
                    </h4>
                    
                    {profile.interests && profile.interests.length >= 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1.5">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <IconHeart className="size-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-muted-foreground">No interests specified yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This traveler hasn't added any travel interests
                        </p>
                      </div>
                    )}
                    
                    {/* Travel Style */}
                    <Separator className="my-6" />
                    
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <IconWorld className="size-4" />
                        Travel Style
                      </h5>
                      {profile.travel_style ? (
                        <Badge variant="outline" className="text-sm px-4 py-2">
                          {profile.travel_style.charAt(0).toUpperCase() + profile.travel_style.slice(1)}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconChartBar className="size-4" />
                      Travel Statistics
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <StatCard
                        title="Countries Visited"
                        value={profile.countries_visited?.toString() || "0"}
                        icon={IconFlag}
                        color="purple"
                      />
                      <StatCard
                        title="Total Trips"
                        value={profile.total_trips?.toString() || "0"}
                        icon={IconPlane}
                        color="blue"
                      />
                      <StatCard
                        title="Total Spent"
                        value={`${profile.preferred_currency || 'USD'} ${profile.total_spent?.toLocaleString() || '0'}`}
                        icon={IconCoin}
                        color="green"
                      />
                      <StatCard
                        title="Travel Experience"
                        value={getExperienceLevel(profile.total_trips || 0)}
                        icon={IconTrendingUp}
                        color="orange"
                      />
                    </div>

                    {/* Currency Preference */}
                    <Separator className="my-6" />
                    
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <IconCurrencyDollar className="size-4" />
                        Financial Preferences
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Preferred Currency</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-sm">
                              {profile.preferred_currency || "USD"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Amount Spent</p>
                          <p className="text-lg font-semibold">
                            {profile.preferred_currency || 'USD'} {profile.total_spent?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <IconCalendar className="size-4" />
                      Activity Timeline
                    </h4>
                    
                    <div className="space-y-4">
                      <ActivityItem
                        date={profile.created_at}
                        title="Profile Created"
                        description="Traveler profile was created"
                      />
                      <ActivityItem
                        date={profile.updated_at}
                        title="Last Updated"
                        description="Profile information was last updated"
                      />
                      
                      {profile.total_trips && profile.total_trips > 0 && (
                        <ActivityItem
                          date={profile.updated_at}
                          title="Trip Activity"
                          description={`${profile.total_trips} trips taken`}
                        />
                      )}
                    </div>

                    {/* Recent Countries */}
                    <Separator className="my-6" />
                    
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <IconMap className="size-4" />
                        Travel Map
                      </h5>
                      {profile.countries_visited && profile.countries_visited > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <IconMap className="size-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{profile.countries_visited} countries visited</p>
                            <p className="text-sm text-muted-foreground">
                              Explore the world, one country at a time
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <IconMap className="size-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">No countries visited yet</p>
                            <p className="text-sm text-muted-foreground">
                              Ready for the first adventure!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default">
                <IconExternalLink className="mr-2 size-4" />
                View Full Profile
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to determine experience level
function getExperienceLevel(trips: number): string {
  if (trips === 0) return "Beginner"
  if (trips < 5) return "Intermediate"
  if (trips < 20) return "Experienced"
  return "Expert Traveler"
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
  color?: "blue" | "green" | "purple" | "orange"
}

function StatCard({ title, value, icon: Icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    green: "text-green-600 bg-green-50 dark:bg-green-950/30",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-950/30"
  }

  return (
    <div className="rounded-lg border p-4">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="size-6" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  )
}

interface ActivityItemProps {
  date: string | Date
  title: string
  description: string
}

function ActivityItem({ date, title, description }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="size-2.5 rounded-full bg-blue-500"></div>
        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
      </div>
      <div className="pb-4">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatDate(date)}</p>
      </div>
    </div>
  )
}