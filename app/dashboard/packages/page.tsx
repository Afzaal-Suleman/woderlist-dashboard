"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useState, useEffect } from "react";
import { PackageDataTable } from "@/components/data-table/packageComp/PackagesDataTable";
import { fetchPackages } from "@/server/fetch/fetchPackages";
import { Package } from "@/types/packages";

export default function Page() {
  const [shoutout, setShoutout] = useState<Package[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadApiData, setIsLoading] = useState(false);

  useEffect(() => {
    loadShoutout(currentPage, pageSize);
  }, []);

  const loadShoutout = async (page: number, perPage: number) => {
    setIsLoading(true);
    try {
      const { data, count, error } = await fetchPackages(page, perPage);
      if (!error) {
        setShoutout(data || []);
        setTotalCount(count || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // For server-side pagination
  const handlePageChange = async (page: number, perPage: number) => {
    const oneBasedPage = page + 1; // Convert 0-based to 1-based
    setCurrentPage(oneBasedPage);
    setPageSize(perPage);
    await loadShoutout(oneBasedPage, perPage);
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

          <PackageDataTable
            data={shoutout}
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
  );
}