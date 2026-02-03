"use client"

import { DataTable } from "@/components/data-table";
import { SubscriptionPlan } from "@/types/subscriptionPlan";
import { SubscriptionPlanColumns } from "./subscription-column";
interface AgenciesDataTableProps {
  data: SubscriptionPlan[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  loadApiData?: boolean
  onPageChange?: (page: number, pageSize: number) => void
}

export default function SubscriptionsDataTable({ 
  data, 
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  onPageChange,
  loadApiData,
}: AgenciesDataTableProps) {

    const handleEditAgency = (plan: SubscriptionPlan) => {
        console.log("Edit agency:", plan)
      }
    
      const handleDeleteAgency = (plan:SubscriptionPlan ) => {
        // setSubscription(shoutout.filter(a => a.id !== agency.id))
      }
    return (
        <div>
            <DataTable
                data={data}
                columns={SubscriptionPlanColumns}
                title="Subscription Plan"
                description="Manage your Subscription Plan"
                loadApiData={loadApiData}
                // addButtonLabel=""
                // onAddNew={handleAddAgency}
                // onpenViewModal={}
                onEdit={handleEditAgency}
                onDelete={handleDeleteAgency}
                serverSidePagination={serverSidePagination}
                totalCount={totalCount}
                initialPage={initialPage}
                initialPageSize={initialPageSize}
                onPageChange={onPageChange}
            />
        </div>
    )
}
