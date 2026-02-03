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
import { Shoutout } from "@/types/shoutout"

export const ShoutoutColumns: ColumnDef<Shoutout>[] = [
    {
        accessorKey: "traveler_profiles.full_name",
        header: "Author Name",
        cell: ({ row }) => {
            const data: Shoutout = row.original
            console.log(data, "traveler");

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{data?.traveler_profiles?.profiles?.full_name || "Unnamed Agency"}</span>
                    {data?.traveler_profiles && (
                        <span className="text-xs text-muted-foreground">{data.traveler_profiles.profiles?.email}</span>
                    )}
                </div>
            )
        },
        enableHiding: false,
    },
    {
        accessorKey: "traveler_profiles.title",
        header: "Title",
        cell: ({ row }) => {
            const title = row.original.title || "traveler"
            const displayText = title.length > 30 ? title.slice(0, 30) + "..." : title

            return (
                <div
                    className="w-28 truncate text-sm text-muted-foreground"
                    title={title} // show full text on hover
                >
                    {displayText}
                </div>
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
            return <div className="text-sm text-muted-foreground">{formattedDate}</div>
        },
    },
   
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const traveler = row.original.traveler_profiles
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button
    //                         variant="ghost"
    //                         className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
    //                         size="icon"
    //                     >
    //                         <IconBuilding className="size-4" />
    //                         <span className="sr-only">Open menu</span>
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end" className="w-40">
    //                     {/* <DropdownMenuItem
    //                         onClick={() => {
    //                             console.log("Edit agency:", traveler)
    //                             toast(`Editing ${traveler?.full_name || "agency"}`)
    //                         }}
    //                     >
    //                         <IconEdit className="mr-2 size-4" />
    //                         Edit Agency
    //                     </DropdownMenuItem> */}
    //                     {/* <DropdownMenuItem
    //                         onClick={() => {
    //                             console.log("Duplicate agency:", traveler)
    //                             toast(`Duplicating ${traveler?.full_name || "agency"}`)
    //                         }}
    //                     >
    //                         <IconCopy className="mr-2 size-4" />
    //                         Duplicate
    //                     </DropdownMenuItem> */}
    //                     {/* <DropdownMenuItem
    //                         onClick={() => {
    //                             if (traveler) {
    //                                 window.location.href = `mailto:${"a"}`
    //                             } else {
    //                                 toast.error("No email address available")
    //                             }
    //                         }}
    //                     >
    //                         <IconMail className="mr-2 size-4" />
    //                         Send Email
    //                     </DropdownMenuItem> */}
    //                     <DropdownMenuSeparator />
    //                     {/* <DropdownMenuItem
    //                         className="text-red-600 dark:text-red-400"
    //                         onClick={() => {
    //                             console.log("Delete agency:", traveler)
    //                             toast(`Deleting ${traveler?.full_name || "agency"}`)
    //                         }}
    //                     >
    //                         <IconTrash className="mr-2 size-4" />
    //                         Delete Agency
    //                     </DropdownMenuItem> */}
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]
