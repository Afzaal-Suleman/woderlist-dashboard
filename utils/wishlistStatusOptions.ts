import {
  IconCalendar,
  IconCheck,
  IconPlane,
  IconX,
  IconClock,
} from "@tabler/icons-react"

export type WishlistStatus = 'planning' | 'booked' | 'in_progress' | 'completed' | 'cancelled'
type BadgeColor =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
interface StatusConfig {
  label: string
  icon: any
  color: BadgeColor
  bgColor: string
}

export const getStatusConfig = (status: WishlistStatus): StatusConfig => {
  const configs: Record<WishlistStatus, StatusConfig> = {
    planning: {
      label: "Planning",
      icon: IconCalendar,
      color: "blue",
      bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    booked: {
      label: "Booked",
      icon: IconCheck,
      color: "green",
      bgColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    in_progress: {
      label: "In Progress",
      icon: IconPlane,
      color: "orange",
      bgColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    },
    completed: {
      label: "Completed",
      icon: IconCheck,
      color: "purple",
      bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    cancelled: {
      label: "Cancelled",
      icon: IconX,
      color: "red",
      bgColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
  }

  return configs[status] || configs.planning
}