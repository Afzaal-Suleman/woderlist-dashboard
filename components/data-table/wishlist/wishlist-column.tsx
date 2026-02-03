"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  IconHeart,
  IconMapPin,
  IconCalendar,
  IconCurrencyDollar,
  IconUsers,
  IconEye,
  IconEyeOff,
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconStarFilled,
  IconStar,
  IconPlane,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Wishlist } from "@/types/whishlist"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"

// Custom status config function for your data
const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string; icon: any; bgColor: string }> = {
    planning: {
      label: "Planning",
      icon: IconCalendar,
      bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    booked: {
      label: "Booked",
      icon: IconCheck,
      bgColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    in_progress: {
      label: "In Progress",
      icon: IconPlane,
      bgColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    },
    completed: {
      label: "Completed",
      icon: IconCheck,
      bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    visited: {
      label: "Visited",
      icon: IconCheck,
      bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    cancelled: {
      label: "Cancelled",
      icon: IconX,
      bgColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
  }

  return configs[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    icon: IconCalendar,
    bgColor: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  }
}



export const getWishlistColumns: ColumnDef<Wishlist>[] = [
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => {
      const wishlist = row.original
      return (
        <div className="flex items-center gap-3">
          {wishlist.cover_image ? (
            <div className="size-10 rounded-lg overflow-hidden border">
              <img
                src={wishlist.cover_image}
                alt={wishlist.destination}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="size-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border">
              <IconMapPin className="size-5 text-blue-600" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{wishlist.destination}</span>
            {wishlist.destination_country && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <IconMapPin className="size-3" />
                {wishlist.destination_country}
              </span>
            )}
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "traveler_profiles",
    header: "Traveler",
    cell: ({ row }) => {
      const wishlist = row.original
      // Fixed: Accessing traveler_profiles instead of traveler_profile
      const travelerName = wishlist.traveler_profiles?.profiles?.full_name
      const travelerEmail = wishlist.traveler_profiles?.profiles?.email
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{travelerName || "Unknown Traveler"}</span>
          {travelerEmail && (
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {travelerEmail}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "planning"
      const config = getStatusConfig(status)
    //   const Icon = config.icon
      
      return (
        <Badge
          variant="outline"
          className={`${config.bgColor} px-2 py-1 capitalize`}
        >
          {/* <Icon className="size-3 mr-1" /> */}
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "estimated_budget",
    header: "Budget",
    cell: ({ row }) => {
      const wishlist = row.original
      if (!wishlist.estimated_budget) {
        return (
          <div className="text-sm text-muted-foreground">Not set</div>
        )
      }
      
      return (
        <div className="flex items-center gap-2">
          <IconCurrencyDollar className="size-4 text-green-600" />
          <span className="font-medium">
            {formatCurrency(wishlist.estimated_budget, wishlist.currency || "USD")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "target_start_date",
    header: "Target Dates",
    cell: ({ row }) => {
      const wishlist = row.original
      if (!wishlist.target_start_date && !wishlist.target_end_date) {
        return (
          <div className="text-sm text-muted-foreground">Not set</div>
        )
      }
    
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconCalendar className="size-4 text-blue-600" /> */}
          <div className="text-sm">
            {wishlist.target_start_date && formatDate(wishlist.target_start_date)}
            {wishlist.target_end_date && ` - ${formatDate(wishlist.target_end_date)}`}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "travelers_count",
    header: "Travelers",
    cell: ({ row }) => {
      const count = row.original.travelers_count
      return (
        <div className="flex items-center gap-2">
          {/* <IconUsers className="size-4 text-purple-600" /> */}
          <span className="text-sm">
            {count ? `${count} traveler${count > 1 ? 's' : ''}` : "Not set"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "is_public",
    header: "Visibility",
    cell: ({ row }) => {
      const isPublic = row.original.is_public
      const isPrivate = row.original.is_private
      
      // Determine visibility based on both fields
      const visibility = isPublic ? "Public" : (isPrivate ? "Private" : "Not set")
      
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 ${
            isPublic
              ? "border-green-200 text-green-700 bg-green-50 dark:border-green-900 dark:text-green-400 dark:bg-green-950"
              : "border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-900"
          }`}
        >
          {isPublic ? (
            <IconEye className="size-3 mr-1" />
          ) : (
            <IconEyeOff className="size-3 mr-1" />
          )}
          {visibility}
        </Badge>
      )
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating
      if (!rating) {
        return <div className="text-sm text-muted-foreground">Not rated</div>
      }
      
      return (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            i < rating ? (
              <IconStarFilled key={i} className="size-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <IconStar key={i} className="size-4 text-gray-300" />
            )
          ))}
          <span className="ml-1 text-sm">{rating}/5</span>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at
      if (!date) return "-"
      
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      
      return (
        <div className="text-sm text-muted-foreground">
          {formattedDate}
        </div>
      )
    },
  },
 
]

// For backward compatibility
export const wishlistColumns = getWishlistColumns