import {
  IconCheck,
  IconX,
  IconClock,
  IconBan,
  
} from "@tabler/icons-react"
export const statusConfig = [
  {
    value: "pending",
    icon: IconClock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    label: "Pending Review"
  },
  {
    value: "approved",
    icon: IconCheck,
    color: "text-green-600",
    bgColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    label: "Approved"
  },
   {
    value: "rejected",
    icon: IconX,
    color: "text-red-600",
    bgColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    label: "Rejected"
  },
  {
    value: "suspended",
    icon: IconBan,
    color: "text-orange-600",
    bgColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    label: "Suspended"
  },
]

   // Get status config
export  const getStatusConfig = (status: string) => {
    return statusConfig.find((opt:any) => opt.value === status) || statusConfig[1]
}