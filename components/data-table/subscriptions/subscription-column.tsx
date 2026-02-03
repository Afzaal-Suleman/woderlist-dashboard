"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconEdit,
  IconTrash,
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
import { SubscriptionPlan } from "@/types/subscriptionPlan"
import { formatCurrency } from "@/utils/formatCurrency"

export const SubscriptionPlanColumns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name",
    cell: ({ row }) => {
      const plan = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{plan.name}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {plan.tier}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "monthly_price",
    header: "Monthly",
    cell: ({ row }) => {
      const price = row.original.monthly_price
      return (
        <span className="text-sm text-muted-foreground">
          {formatCurrency(price, "PKR")}
        </span>
      )
    },
  },

  {
    accessorKey: "annual_price",
    header: "Annual",
    cell: ({ row }) => {
      const price = row.original.annual_price
      return price ? (
        <span className="text-sm text-muted-foreground">
          {formatCurrency(price, "PKR")}
        </span>
      ) : (
        "-"
      )
    },
  },

  {
    accessorKey: "max_packages",
    header: "Packages",
    cell: ({ row }) => {
      const max = row.original.max_packages
      return (
        <span className="text-sm text-muted-foreground">
          {max ?? "Unlimited"}
        </span>
      )
    },
  },

  {
    accessorKey: "commission_rate",
    header: "Commission",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.original.commission_rate}%
        </Badge>
      )
    },
  },

  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active
      return isActive ? (
        <Badge className="gap-1" variant="secondary">
          <IconCircleCheckFilled className="size-3" />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <IconCircleXFilled className="size-3" />
          Inactive
        </Badge>
      )
    },
  },

  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const plan = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconEdit className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => console.log("Edit plan", plan)}
            >
              <IconEdit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => console.log("Delete plan", plan)}
            >
              <IconTrash className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
