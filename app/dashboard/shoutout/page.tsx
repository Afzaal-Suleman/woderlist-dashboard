"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useState, useEffect } from "react";
import { ShoutoutDataTable } from "@/components/data-table/shoutout/ShoutoutDataTable";
import { fetchShoutout } from "@/server/fetch/fetchShoutout";
import { Shoutout } from "@/types/shoutout";

export default function Page() {
  const [shoutout, setShoutout] = useState<Shoutout[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadShoutout(currentPage, pageSize);
  }, []);

  const loadShoutout = async (page: number, perPage: number) => {
    setIsLoading(true);
    try {
      const { data, count, error } = await fetchShoutout(page, perPage);
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
    const oneBasedPage = page + 1; 
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
          {/* <ShoutoutDataTable 
            data={shoutout} 
            totalCount={totalCount}
          /> */}

          {/* Option 2: Server-side pagination */}

          <ShoutoutDataTable
            title="Shoutout"
            description="Manage your shoutout"
            data={shoutout}
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