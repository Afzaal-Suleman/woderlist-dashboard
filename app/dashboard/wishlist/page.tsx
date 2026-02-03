"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useState, useEffect } from "react";
import { WishlistDataTable } from "@/components/data-table/wishlist/WishlistDataTable";
import { fetchWhishlist } from "@/server/action/fetchWhishlist";

export default function Page() {
  const [agencies, setAgencies] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAgencies(currentPage, pageSize);
  }, []);

  const loadAgencies = async (page: number, perPage: number) => {
    setIsLoading(true);
    try {
      const { data, count, error } = await fetchWhishlist(page, perPage);
      console.log(data, "fetchWhishlist");
      
      if (!error) {
        setAgencies(data || []);
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
    await loadAgencies(page, perPage);
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
          
          <WishlistDataTable 
            data={agencies} 
            totalCount={totalCount}
            initialPage={currentPage - 1}
            initialPageSize={pageSize}
            serverSidePagination={true}
            onPageChange={handlePageChange}
          />
         
        </div>
      </div>
    </div>
  );
}