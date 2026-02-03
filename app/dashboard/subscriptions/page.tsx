"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import SubscriptionsDataTable from '@/components/data-table/subscriptions/SubscriptionsDataTable'
import { fetchSubscriptionPlan } from '@/server/action/fetchSubscriptionPlan';
import { SubscriptionPlan } from '@/types/subscriptionPlan';


export default function page() {
  const [subscription, setSubscription] = useState<SubscriptionPlan[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadApiData, setIsLoading] = React.useState(false);

  useEffect(() => {
    loadSubscription(currentPage, pageSize);
  }, []);

  const loadSubscription = async (page: number, perPage: number) => {
    setIsLoading(true);
    try {
      const { data, count, error } = await fetchSubscriptionPlan(page, perPage);

      console.log(data, "data sub");
      
      if (!error) {
        setSubscription(data || []);
        setTotalCount(count || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // For server-side pagination
  const handlePageChange = async (page: number, perPage: number) => {
    setCurrentPage(page);
    setPageSize(perPage);
    await loadSubscription(page, perPage);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="px-4 lg:px-6">
            {/* <ChartAreaInteractive /> */}
          </div>

          {/* Option 1: Client-side pagination (default) */}
          {/* <AgenciesDataTable 
               data={agencies} 
               totalCount={totalCount}
             /> */}

          {/* Option 2: Server-side pagination */}

          <SubscriptionsDataTable
            data={subscription}
            totalCount={totalCount}
            initialPage={currentPage - 1}
            initialPageSize={pageSize}
            serverSidePagination={true}
            onPageChange={handlePageChange}
            loadApiData={loadApiData}
          />

        </div>
      </div>
    </div>
  )
}
