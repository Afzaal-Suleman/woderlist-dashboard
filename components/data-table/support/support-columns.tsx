"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { IconCalendar } from "@tabler/icons-react"
import { SupportTicketWithProfile } from "@/types/support"

export const SupportColumns: ColumnDef<SupportTicketWithProfile>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const t = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium truncate">{t.subject}</span>
          <span className="text-xs text-muted-foreground truncate">{t.description}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "userId",
    header: "Reporter",
    cell: ({ row }) => {
      const t = row.original
      return <div className="text-sm text-muted-foreground">{t.userId}</div>
    },
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
      const t = row.original
      return <div className="text-sm text-muted-foreground">{t.categoryId || "-"}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const d = row.original.created_at
      return (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <IconCalendar className="size-4" />
          <span>{new Date(d).toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status
      const cls = s === "open" ? "bg-red-50 text-red-700" : s === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
      return <Badge className={cls}>{s}</Badge>
    },
  },
]

export default SupportColumns
