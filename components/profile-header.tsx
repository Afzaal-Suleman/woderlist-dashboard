import Select from 'react-select'
import * as React from "react"
import {
    IconMapPin,
    IconCurrencyDollar,
    IconStarFilled,
    IconCalendar,
    IconTrendingUp,
    IconUser,
    IconBuilding,
    IconUsers,
    IconGlobe,
    IconCheck,
    IconBriefcase
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { fetchTravelerProfileByUser_Id } from "@/server/fetch/fetchTravelers"
import { fetchAgencyProfileByUser_Id } from "@/server/fetch/fetchAgencies"
import { TravelerProfileA } from "@/types/traveler"
import { Agency } from "@/types/agency"
// Define types
interface Profile {
    id: string
    role: 'traveler' | 'agency' | 'superadmin'
    email: string
    full_name: string
    avatar_url?: string
}

interface TravelerData {
    id: string
    user_id: string
    average_rating: number
    countries_visited: number
    total_reviews: number
    total_spent: number
    total_trips: number
    travel_style: string | null
    preferred_currency: string
    created_at: string
    updated_at: string
    profiles: Profile
    status: string
    interests: string[]
}


interface AgencyData {
    id: string
    user_id: string
    business_name: string
    registration_number: string | null
    country: string
    city: string
    address: string | null
    contact_name: string
    phone: string | null
    website: string | null
    instagram: string | null
    description: string | null
    logo_url: string | null
    cover_image_url: string | null
    license_url: string | null
    id_verification_url: string | null
    tourism_permit_url: string | null
    tour_type: 'local' | 'international' | 'both'  // match your enum
    destinations_covered: string[]
    languages: string[]
    status: 'pending' | 'approved' | 'rejected' // match your enum
    rejection_reason: string | null
    approved_at: string | null  // timestamp in ISO format
    approved_by: string | null  // user id of approver
    average_rating: number
    total_reviews: number
    total_bookings: number
    created_at: string  // timestamp in ISO format
    updated_at: string  // timestamp in ISO format

    // embedded owner profile
    profiles: Profile,
}

interface ProfileHeaderProps {
    role: string
    userId: string
    className?: string
    variant?: 'full' | 'compact'
}



export function ProfileHeader({ role, userId, className = "", variant = 'full' }: ProfileHeaderProps) {
    const [profileData, setProfileData] = React.useState<TravelerData | AgencyData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    
    React.useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                let result: {
                    data: TravelerData[] | AgencyData[] | any
                    error: any
                }
                if (role === "traveler") {
                    result = await fetchTravelerProfileByUser_Id(userId)

                } else if (role === "agency") {
                    result = await fetchAgencyProfileByUser_Id(userId)
                } else {
                    // Handle other roles or return null
                    setProfileData(null)
                    setLoading(false)
                    return
                }

                if (result.error) {
                    setError(result.error)
                } else {
                    const d = result?.data?.[0] ?? null
                    setProfileData(d)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile data')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [role, userId])

    if (loading) {
        return <ProfileHeaderSkeleton variant={variant} className={className} />
    }

    if (error) {
        return (
            <Card className={`mb-6 border-red-200 ${className}`}>
                <CardContent className="p-6">
                    <div className="text-center text-red-600">
                        Error loading profile: {error}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!profileData) {
        return null
    }

    // Render based on role
    if (role === "traveler") {
        const travelerData = profileData as TravelerData
        return variant === 'compact'
            ? <CompactTravelerHeader travelerData={travelerData} className={className} />
            : <></>
    }

    if (role === "agency") {
        const agencyData = profileData as AgencyData
        return variant === 'compact'
            ? <CompactAgencyHeader agencyData={agencyData} className={className} />
            : <></>
    }

    return null
}
const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        minHeight: '32px',
        height: '32px',
        fontSize: '14px',
        borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
        boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
        '&:hover': {
            borderColor: '#6366f1'
        },
        backgroundColor: '#f9fafb',
    }),
    valueContainer: (base: any) => ({
        ...base,
        height: '32px',
        padding: '0 8px',
    }),
    indicatorsContainer: (base: any) => ({
        ...base,
        height: '32px',
    }),
    option: (base: any, { data }: any) => ({
        ...base,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ':before': {
            content: '""',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: data.color,
        }
    }),
    singleValue: (base: any, { data }: any) => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        ':before': {
            content: '""',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: data.color,
        }
    }),
}
 // Status options for the select dropdown
    const statusOptions = [
        { value: 'pending', label: 'Pending', color: '#f59e0b' },
        { value: 'approved', label: 'Approved', color: '#10b981' },
        { value: 'suspended', label: 'Suspended', color: '#ef4444' },
        { value: 'rejected', label: 'Rejected', color: '#6b7280' },
    ]

function CompactTravelerHeader({ travelerData, className, onStatusChange }: {
    travelerData: TravelerData,
    className?: string,
    onStatusChange?: (status: string) => void
}) {
    const { profiles, average_rating, countries_visited, total_trips } = travelerData

    // Check if we have status in travelerData or profiles
    const travelerStatus = travelerData?.status || 'active'


    const handleStatusChange = (selectedOption: any) => {
        if (onStatusChange) {
            onStatusChange(selectedOption.value)
        }
    }

    const selectedStatus = statusOptions.find(option => option.value === travelerStatus)

    return (
        <Card className={`mb-4 ${className}`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                    {/* Left Section - User Info */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <IconUser className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                                <h3 className="font-semibold text-sm md:text-base truncate">
                                    {profiles?.full_name || "Traveler"}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                    <Badge variant="secondary" className="hidden sm:inline-flex">
                                        Traveler
                                    </Badge>
                                    {onStatusChange && (
                                        <div className="w-full sm:w-40 md:w-48">
                                            <Select
                                                options={statusOptions}
                                                value={selectedStatus}
                                                onChange={handleStatusChange}
                                                styles={customStyles}
                                                isSearchable={false}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                                {profiles?.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2 sm:hidden">
                                <Badge variant="secondary" className="w-fit">
                                    Traveler
                                </Badge>
                                {onStatusChange && (
                                    <div className="flex-1">
                                        <Select
                                            options={statusOptions}
                                            value={selectedStatus}
                                            onChange={handleStatusChange}
                                            styles={customStyles}
                                            isSearchable={false}
                                            className="text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Stats */}
                    <div className="flex justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">
                                {average_rating ? average_rating.toFixed(1) : '0.0'}
                            </p>
                            <p className="text-xs text-gray-600">Rating</p>
                        </div>
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">{countries_visited || 0}</p>
                            <p className="text-xs text-gray-600">Countries</p>
                        </div>
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">{total_trips || 0}</p>
                            <p className="text-xs text-gray-600">Trips</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CompactAgencyHeader({ agencyData, className, onStatusChange }: {
    agencyData: AgencyData,
    className?: string,
    onStatusChange?: (status: string) => void
}) {
    const { profiles, business_name, total_bookings, total_reviews, average_rating, status } = agencyData


    const handleStatusChange = (selectedOption: any) => {
        if (onStatusChange) {
            onStatusChange(selectedOption.value)
        }
    }

    const selectedStatus = statusOptions.find(option => option.value === status)

    return (
        <Card className={`mb-4 ${className}`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                    {/* Left Section - Agency Info */}
                    <div className="flex items-start md:items-center gap-3 w-full md:w-auto">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <IconBuilding className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm md:text-base truncate">
                                        {business_name || "Agency"}
                                    </h3>
                                    {status === "approved" && (
                                        <span className="text-xs text-green-600 whitespace-nowrap">✓ Verified</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <Badge variant="secondary" className="hidden sm:inline-flex">
                                        Agency
                                    </Badge>
                                    {onStatusChange && (
                                        <div className="w-full sm:w-40 md:w-48 lg:w-56">
                                            <Select
                                                options={statusOptions}
                                                value={selectedStatus}
                                                onChange={handleStatusChange}
                                                styles={customStyles}
                                                isSearchable={false}
                                                className="text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 truncate mt-1">
                                {profiles?.full_name || "No owner"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 sm:hidden">
                                <Badge variant="secondary" className="w-fit">
                                    Agency
                                </Badge>
                                {onStatusChange && (
                                    <div className="flex-1">
                                        <Select
                                            options={statusOptions}
                                            value={selectedStatus}
                                            onChange={handleStatusChange}
                                            styles={customStyles}
                                            isSearchable={false}
                                            className="text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Stats */}
                    <div className="flex justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">{total_bookings}</p>
                            <p className="text-xs text-gray-600">Bookings</p>
                        </div>
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">{total_reviews}</p>
                            <p className="text-xs text-gray-600">Reviews</p>
                        </div>
                        <div className="text-center flex-1 md:flex-none">
                            <p className="text-base md:text-lg font-bold">{average_rating.toFixed(1)}</p>
                            <p className="text-xs text-gray-600">Rating</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


// Skeleton loader
function ProfileHeaderSkeleton({ variant = 'full', className = "" }: { variant?: 'full' | 'compact', className?: string }) {
    if (variant === 'compact') {
        return (
            <Card className={`mb-4 ${className}`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="text-center">
                                    <Skeleton className="h-5 w-8 mb-1 mx-auto" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`mb-6 ${className}`}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex gap-4">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}