"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { IconUser, IconBuilding, IconCircleCheckFilled } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserWithReportCount } from "@/server/fetch/fetchUsersWithReportCount";
import { useRouter } from "next/navigation"

export const UserWithReportCountColumns: ColumnDef<UserWithReportCount>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          {/* <IconUser className="size-4 text-blue-500" /> */}
          <span className="text-sm">{user.full_name || "No Name"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <span className="text-sm font-mono">{row.original.email}</span>
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      return <Badge className="capitalize">{role}</Badge>
    },
  },
  // {
  //   accessorKey: "reportCount",
  //   header: "Reports",
  //   cell: ({ row }) => {
  //     const count = row.original.reportCount
  //     return (
  //       <Badge
  //         variant="outline"
  //         className={`${
  //           count > 10
  //             ? "bg-red-50 text-red-600"
  //             : count > 5
  //             ? "bg-yellow-50 text-yellow-600"
  //             : "bg-green-50 text-green-600"
  //         }`}
  //       >
  //         {count} {count === 1 ? "report" : "reports"}
  //       </Badge>
  //     )
  //   },
  // },
  {
  accessorKey: "reportCount",
  sortingFn: "basic",
  header: ({ column }) => {
    const sorted = column.getIsSorted()

    return (
      <Button
        variant="ghost"
        onClick={column.getToggleSortingHandler()}
        className="h-8 px-2 flex items-center gap-1"
      >
        Reports
        {sorted === "asc" && <ArrowUp className="h-4 w-4" />}
        {sorted === "desc" && <ArrowDown className="h-4 w-4" />}
        {!sorted && <ArrowUpDown className="h-4 w-4" />}
      </Button>
    )
  },
  cell: ({ row }) => {
    const count = row.original.reportCount

    return (
      <Badge
        variant="outline"
        className={
          count > 10
            ? "bg-red-50 text-red-600"
            : count > 5
            ? "bg-yellow-50 text-yellow-600"
            : "bg-green-50 text-green-600"
        }
      >
        {count} {count === 1 ? "report" : "reports"}
      </Badge>
    )
  },
},
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original?.created_at)
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at)
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      )
    },
  },
//   {
//     id: "actions",
//     accessorKey: "view_at",
//     header: "Actions",
//    cell: ({ row }) => {
//   const router = useRouter()
//   const user = row.original
//   return (
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={(e) => {
//         e.stopPropagation()
//         router.push(`/dashboard/report/${user.id}`)
//       }}
//     >
//       View
//     </Button>
//   )
// }
// ,
//   },
]



// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import {
//     IconCircleCheckFilled,
//     IconCircleXFilled,
//     IconUser,
//     IconBuilding,
//     IconFlag,
//     IconCheck,
//     IconX,
//     IconClock,
// } from "@tabler/icons-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { toast } from "sonner"
// import { Report } from "@/types/report"
// import { UserWithReportCount } from "@/server/fetch/fetchUsersWithReportCount";

// export const ReportColumns: ColumnDef<UserWithReportCount>[] = [
//     {
//         accessorKey: "reporter_id",
//         header: "Reporter",
//         cell: ({ row }) => {
//             const data = row.original
//             const reporterType = data.reporter_type
            
//             return (
//                 <div className="flex items-center gap-2">
//                     {/* {reporterType === 'traveler' ? (
//                         <IconUser className="size-4 text-blue-500" />
//                     ) : (
//                         <IconBuilding className="size-4 text-green-500" />
//                     )} */}
//                     <span className="text-sm capitalize">{reporterType}</span>
//                     <span className="text-xs text-muted-foreground font-mono">
//                         {/* {data.reporter_id?.substring(0, 6)}... */}
//                     </span>
//                 </div>
//             )
//         },
//     },
//     {
//         accessorKey: "entity_type",
//         header: "Reported Entity",
//         cell: ({ row }) => {
//             const data = row.original
//             const entityType = data.entity_type
//             const entityId = data.entity_id
            
//             return (
//                 <div className="flex flex-col">
//                     <span className="text-sm font-medium capitalize">
//                         {entityType.replace('_', ' ')}
//                     </span>
//                     <span className="text-xs text-muted-foreground font-mono">
//                         {/* ID: {entityId?.substring(0, 8)}... */}
//                     </span>
//                 </div>
//             )
//         },
//     },
//     {
//         accessorKey: "reason",
//         header: "Reason",
//         cell: ({ row }) => {
//             const reason = row.original.reason
//             return (
//                 <Badge variant="outline" className="capitalize">
//                     {reason.replace('_', ' ')}
//                 </Badge>
//             )
//         },
//     },
//     {
//         accessorKey: "description",
//         header: "Description",
//         cell: ({ row }) => {
//             const description = row.original.description
//             if (!description) return <span className="text-muted-foreground italic">No description</span>
            
//             const displayText = description.length > 50 ? description.slice(0, 50) + "..." : description
//             return (
//                 <div className="text-sm" title={description}>
//                     {displayText}
//                 </div>
//             )
//         },
//     },
//     {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//             const status = row.original.status
//             const getStatusConfig = (status: string) => {
//                 switch (status) {
//                     case 'pending':
//                         return { icon: IconClock, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Pending' }
//                     case 'reviewing':
//                         return { icon: IconFlag, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Reviewing' }
//                     case 'resolved':
//                         return { icon: IconCheck, color: 'text-green-500', bg: 'bg-green-50', text: 'Resolved' }
//                     case 'dismissed':
//                         return { icon: IconX, color: 'text-gray-500', bg: 'bg-gray-50', text: 'Dismissed' }
//                     default:
//                         return { icon: IconClock, color: 'text-gray-500', bg: 'bg-gray-50', text: status }
//                 }
//             }
            
//             const config = getStatusConfig(status)
//             const Icon = config.icon
            
//             return (
//                 <Badge variant="outline" className={`${config.bg} border-0 gap-1`}>
//                     <Icon className={`size-3 ${config.color}`} />
//                     <span className="capitalize">{config.text}</span>
//                 </Badge>
//             )
//         },
//     },
//     {
//         accessorKey: "created_at",
//         header: "Created Date",
//         cell: ({ row }) => {
//             const date = row.original.created_at
//             if (!date) return "-"
//             const formattedDate = new Date(date).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//             })
//             return <div className="text-sm text-muted-foreground">{formattedDate}</div>
//         },
//     },
//     {
//         accessorKey: "reviewed_at",
//         header: "Reviewed Date",
//         cell: ({ row }) => {
//             const date = row.original.reviewed_at
//             if (!date) return <span className="text-muted-foreground italic">Not reviewed</span>
//             const formattedDate = new Date(date).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//             })
//             return <div className="text-sm text-muted-foreground">{formattedDate}</div>
//         },
//     },
//     // {
//     //     id: "actions",
//     //     cell: ({ row }) => {
//     //         const report = row.original
            
//     //         return (
//     //             <DropdownMenu>
//     //                 <DropdownMenuTrigger asChild>
//     //                     <Button
//     //                         variant="ghost"
//     //                         className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
//     //                         size="icon"
//     //                     >
//     //                         <IconFlag className="size-4" />
//     //                         <span className="sr-only">Open menu</span>
//     //                     </Button>
//     //                 </DropdownMenuTrigger>
//     //                 <DropdownMenuContent align="end" className="w-48">
//     //                     <DropdownMenuItem
//     //                         onClick={() => {
//     //                             console.log("Review report:", report)
//     //                             toast(`Reviewing report ${report.id.substring(0, 8)}...`)
//     //                         }}
//     //                     >
//     //                         <IconFlag className="mr-2 size-4" />
//     //                         Review Report
//     //                     </DropdownMenuItem>
                        
//     //                     <DropdownMenuSeparator />
                        
//     //                     <DropdownMenuItem
//     //                         onClick={() => {
//     //                             console.log("Mark as resolved:", report)
//     //                             toast(`Marking report ${report.id.substring(0, 8)}... as resolved`)
//     //                         }}
//     //                     >
//     //                         <IconCheck className="mr-2 size-4 text-green-600" />
//     //                         <span className="text-green-600">Mark as Resolved</span>
//     //                     </DropdownMenuItem>
                        
//     //                     <DropdownMenuItem
//     //                         onClick={() => {
//     //                             console.log("Dismiss report:", report)
//     //                             toast(`Dismissing report ${report.id.substring(0, 8)}...`)
//     //                         }}
//     //                     >
//     //                         <IconX className="mr-2 size-4 text-red-600" />
//     //                         <span className="text-red-600">Dismiss Report</span>
//     //                     </DropdownMenuItem>
                        
//     //                     <DropdownMenuSeparator />
                        
//     //                     <DropdownMenuItem
//     //                         onClick={() => {
//     //                             navigator.clipboard.writeText(report.id)
//     //                             toast.success("Report ID copied to clipboard")
//     //                         }}
//     //                     >
//     //                         {/* <IconCopy className="mr-2 size-4" />
//     //                         Copy Report ID */}
//     //                     </DropdownMenuItem>
//     //                 </DropdownMenuContent>
//     //             </DropdownMenu>
//     //         )
//     //     },
//     // },
// ]