"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconEdit,
  IconCopy,
  IconMail,
  IconTrash,
  IconBuilding,
  IconPackage,
  IconUser,
  IconCalendar,
  IconTarget,
  IconMapPin,
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
import { Package } from "@/types/packages"
import { PackageForTable } from "@/types/packages"


export const PackageColumns: ColumnDef<PackageForTable>[] = [
  {
    accessorKey: "agency_profiles.user_profile.full_name",
    header: "Author",
    cell: ({ row }) => {
      const data: PackageForTable = row.original
      const userProfile = data.agency_profiles?.user_profile
      
      return (
        <div className="flex items-center gap-3">
          {/* <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <IconUser className="size-4" />
          </div> */}
          <div className="flex flex-col">
            <span className="font-medium">
              {userProfile?.full_name || data.travelerName || "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground">
              {userProfile?.email || "No email"}
            </span>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Package Title",
    cell: ({ row }) => {
      const title = row.original.title || "Untitled Package"
      const displayText = title.length > 40 ? title.slice(0, 40) + "..." : title
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconPackage className="size-4 text-muted-foreground" /> */}
          <div 
            className="max-w-[200px] truncate font-medium" 
            title={title}
          >
            {displayText}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "agency_profiles.business_name",
    header: "Agency",
    cell: ({ row }) => {
      const agency = row.original.agency_profiles
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconBuilding className="size-4 text-muted-foreground" /> */}
          <Badge variant="outline" className="font-normal">
            {agency?.business_name || "No agency"}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "profileCity",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.destination
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconMapPin className="size-4 text-muted-foreground" /> */}
          <span className="text-sm">{location || "Unknown"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "paused"
      const isActive = status === "active"
      
      return (
        <Badge 
          variant={isActive ? "default" : "secondary"}
          className={`
            ${isActive ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300" : 
            "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"}
          `}
        >
          <div className="flex items-center gap-1">
            {isActive ? 
              <IconCircleCheckFilled className="size-3" /> : 
              <IconCircleXFilled className="size-3" />
            }
            {status}
          </div>
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "total_bookings",
    header: "Bookings",
    cell: ({ row }) => {
      const target = row.original.total_bookings || "0"
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconTarget className="size-4 text-muted-foreground" /> */}
          <span className="font-mono text-sm">{target}</span>
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
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      
      return (
        <div className="flex items-center gap-2">
          {/* <IconCalendar className="size-4 text-muted-foreground" /> */}
          <div className="flex flex-col">
            <span className="text-sm">{formattedDate}</span>
            {/* <span className="text-xs text-muted-foreground">
              {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span> */}
          </div>
        </div>
      )
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const pkg = row.original
  //     const userProfile = pkg.agency_profiles?.user_profile
      
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             variant="ghost"
  //             className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
  //             size="icon"
  //           >
  //             <IconBuilding className="size-4" />
  //             <span className="sr-only">Open menu</span>
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="w-48">
  //           <DropdownMenuItem
  //             onClick={() => {
  //               console.log("Edit package:", pkg)
  //               toast(`Editing ${pkg.title || "package"}`)
  //             }}
  //           >
  //             <IconEdit className="mr-2 size-4" />
  //             Edit Package
  //           </DropdownMenuItem>
            
  //           <DropdownMenuItem
  //             onClick={() => {
  //               console.log("Duplicate package:", pkg)
  //               toast(`Duplicating ${pkg.title || "package"}`)
  //             }}
  //           >
  //             <IconCopy className="mr-2 size-4" />
  //             Duplicate
  //           </DropdownMenuItem>
            
  //           {userProfile?.email && (
  //             <DropdownMenuItem
  //               onClick={() => {
  //                 window.location.href = `mailto:${userProfile.email}`
  //               }}
  //             >
  //               <IconMail className="mr-2 size-4" />
  //               Contact Author
  //             </DropdownMenuItem>
  //           )}
            
  //           <DropdownMenuSeparator />
            
  //           <DropdownMenuItem
  //             onClick={() => {
  //               navigator.clipboard.writeText(pkg.id)
  //               toast.success("Package ID copied to clipboard")
  //             }}
  //           >
  //             <IconCopy className="mr-2 size-4" />
  //             Copy ID
  //           </DropdownMenuItem>
            
  //           <DropdownMenuSeparator />
            
  //           <DropdownMenuItem
  //             className="text-red-600 dark:text-red-400"
  //             onClick={() => {
  //               console.log("Delete package:", pkg)
  //               toast(`Deleting ${pkg.title || "package"}`)
  //             }}
  //           >
  //             <IconTrash className="mr-2 size-4" />
  //             Delete Package
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
]