 import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClock,
  IconEdit,
  IconBan,
} from "@tabler/icons-react"

  export const statusOptions = [
    { 
      value: "active", 
      label: "Active", 
      icon: IconCircleCheckFilled, 
      color: "text-green-600",
      bgColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    { 
      value: "paused", 
      label: "Paused", 
      icon: IconCircleXFilled, 
      color: "text-gray-600",
      bgColor: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    },
    // { 
    //   value: "Pending", 
    //   label: "Pending", 
    //   icon: IconClock, 
    //   color: "text-yellow-600",
    //   bgColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    // },
    { 
      value: "draft", 
      label: "Draft", 
      icon: IconEdit, 
      color: "text-blue-600",
      bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    // { 
    //   value: "Rejected", 
    //   label: "Rejected", 
    //   icon: IconBan, 
    //   color: "text-red-600",
    //   bgColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    // },
  ]


   // Get status config
export  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[1]
}

  