"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconBan,
  IconClock,
  IconEdit,
  IconCopy,
  IconMail,
  IconTrash,
  IconBuilding,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { AgencyData } from "@/types/agency"


export const agencyColumns: ColumnDef<AgencyData>[] = [
  {
    accessorKey: "name",
    header: "Agency Name",
    cell: ({ row }) => {
      const agency = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{agency.profiles.full_name || "Unnamed Agency"}</span>
          {agency.profiles.email && (
            <span className="text-xs text-muted-foreground">{agency.profiles.email}</span>
          )}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="w-28">
        <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
          {row.original.profiles.role || "traveler"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      // Define status configurations
      const statusConfig = {
        approved: {
          icon: IconCircleCheckFilled,
          text: "Approved",
          className: "border-green-200 text-green-700 bg-green-50 dark:border-green-900 dark:text-green-400 dark:bg-green-950",
          iconClassName: "fill-green-500 dark:fill-green-400"
        },
        pending: {
          icon: IconClock,
          text: "Pending",
          className: "border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-900 dark:text-yellow-400 dark:bg-yellow-950",
          iconClassName: "fill-yellow-500 dark:fill-yellow-400"
        },
        suspended: {
          icon: IconCircleXFilled,
          text: "Suspended",
          className: "border-red-200 text-red-700 bg-red-50 dark:border-red-900 dark:text-red-400 dark:bg-red-950",
          iconClassName: "fill-red-500 dark:fill-red-400"
        },
        rejected: {
          icon: IconBan,
          text: "Rejected",
          className: "border-red-200 text-red-700 bg-red-50 dark:border-red-900 dark:text-red-400 dark:bg-red-950",
          iconClassName: "fill-red-500 dark:fill-red-400"
        }
      }

      // Get config for current status (default to pending if not found)
      const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending
      const Icon = config.icon

      return (
        <Badge
          variant="outline"
          className={`px-1.5 ${config.className}`}
        >
          <Icon className={`${config.iconClassName} mr-1 size-3`} />
          {config.text}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
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
  // {
  //   accessorKey: "target",
  //   header: () => <div className="w-full text-right">Target</div>,
  //   cell: ({ row }) => {
  //     const agency = row.original
  //     return (
  //       <form
  //         onSubmit={(e) => {
  //           e.preventDefault()
  //           const formData = new FormData(e.currentTarget)
  //           const targetValue = formData.get("target") as string

  //           toast.promise(
  //             new Promise((resolve) => {
  //               // Simulate API call
  //               setTimeout(() => {
  //                 console.log(`Updating target for agency ${agency.id} to ${targetValue}`)
  //                 resolve(true)
  //               }, 1000)
  //             }),
  //             {
  //               loading: `Saving target for ${agency.name || "agency"}`,
  //               success: "Target updated",
  //               error: "Error updating target",
  //             }
  //           )
  //         }}
  //       >
  //         {/* <Label htmlFor={`${agency.id}-target`} className="sr-only">
  //           Target
  //         </Label>
  //         <Input
  //           className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-20 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //           defaultValue={agency.target || "0"}
  //           id={`${agency.id}-target`}
  //           name="target"
  //         /> */}
  //       </form>
  //     )
  //   },
  // },

  // {
  //   accessorKey: "reviewer",
  //   header: "Manager",
  //   cell: ({ row }) => {
  //     const agency = row.original
  //     // You can add a reviewer field to your Agency type if needed
  //     const manager = "Not assigned" // Default value

  //     if (manager !== "Not assigned") {
  //       return manager
  //     }

  //     return (
  //       <>
  //         <Label htmlFor={`${agency.id}-manager`} className="sr-only">
  //           Manager
  //         </Label>
  //         <Select
  //           onValueChange={(value) => {
  //             toast.promise(
  //               new Promise((resolve) => {
  //                 setTimeout(() => {
  //                   console.log(`Assigning manager ${value} to agency ${agency.id}`)
  //                   resolve(true)
  //                 }, 500)
  //               }),
  //               {
  //                 loading: "Assigning manager...",
  //                 success: "Manager assigned",
  //                 error: "Error assigning manager",
  //               }
  //             )
  //           }}
  //         >
  //           <SelectTrigger
  //             className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
  //             size="sm"
  //             id={`${agency.id}-manager`}
  //           >
  //             <SelectValue placeholder="Assign manager" />
  //           </SelectTrigger>
  //           <SelectContent align="end">
  //             <SelectItem value="John Doe">John Doe</SelectItem>
  //             <SelectItem value="Jane Smith">Jane Smith</SelectItem>
  //             <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </>
  //     )
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const agency = row.original
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
  //         <DropdownMenuContent align="end" className="w-40">
  //           <DropdownMenuItem
  //             onClick={() => {
  //               console.log("Edit agency:", agency)
  //               // Add your edit logic here
  //               toast(`Editing ${agency.name || "agency"}`)
  //             }}
  //           >
  //             <IconEdit className="mr-2 size-4" />
  //             Edit Agency
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               console.log("Duplicate agency:", agency)
  //               toast(`Duplicating ${agency.name || "agency"}`)
  //             }}
  //           >
  //             <IconCopy className="mr-2 size-4" />
  //             Duplicate
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               if (agency.email) {
  //                 window.location.href = `mailto:${agency.email}`
  //               } else {
  //                 toast.error("No email address available")
  //               }
  //             }}
  //           >
  //             <IconMail className="mr-2 size-4" />
  //             Send Email
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //             className="text-red-600 dark:text-red-400"
  //             onClick={() => {
  //               console.log("Delete agency:", agency)
  //               toast(`Deleting ${agency.name || "agency"}`)
  //             }}
  //           >
  //             <IconTrash className="mr-2 size-4" />
  //             Delete Agency
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]