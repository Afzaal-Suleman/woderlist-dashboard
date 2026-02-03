// "use client"

// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
// import { AgenciesDataTable } from "@/components/data-table/AgenciesDataTable";
// import { fetchAgencies } from "@/server/action/fetchAgencies";
// import { useState, useEffect } from "react";

// export default function Page() {
//   const [agencies, setAgencies] = useState<any>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     loadAgencies(currentPage, pageSize);
//   }, []);

//   const loadAgencies = async (page: number, perPage: number) => {
//     setIsLoading(true);
//     try {
//       const { data, count, error } = await fetchAgencies(page, perPage);
//       if (!error) {
//         setAgencies(data || []);
//         setTotalCount(count || 0);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // For server-side pagination
//   const handlePageChange = async (page: number, perPage: number) => {
//     setCurrentPage(page);
//     setPageSize(perPage);
//     await loadAgencies(page, perPage);
//   };

//   return (
//     <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           {/* <SectionCards /> */}
//           <div className="px-4 lg:px-6">
//             {/* <ChartAreaInteractive /> */}
//           </div>
          
//           {/* Option 1: Client-side pagination (default) */}
//           {/* <AgenciesDataTable 
//             data={agencies} 
//             totalCount={totalCount}
//           /> */}
          
//           {/* Option 2: Server-side pagination */}
          
//           <AgenciesDataTable 
//             data={agencies} 
//             totalCount={totalCount}
//             initialPage={currentPage - 1}
//             initialPageSize={pageSize}
//             serverSidePagination={true}
//             onPageChange={handlePageChange}
//           />
         
//         </div>
//       </div>
//     </div>
//   );
// }

// app/page.tsx or app/agencies/page.tsx
// app/page.tsx
// app/page.tsx
"use client"

import { AgenciesDataTable } from "@/components/data-table/agency/AgenciesDataTable";
import { fetchAgencies } from "@/server/action/fetchAgencies";
import { useEffect, useState } from "react";

export default function Page() {
  const [agencies, setAgencies] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadApiData, setLoading] = useState(false);

  const loadData = async (page: number, pageSize: number) => {
    console.log("Loading page:", page, "size:", pageSize);
    setLoading(true);
    try {
      const { data, count, error } = await fetchAgencies(page, pageSize);
      if (!error && data) {
        console.log("Received data:", data?.length || 0, "items, count:", count);
        setAgencies(data || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Error loading agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, 10);
  }, []);

  const handlePageChange = async (page: number, pageSize: number) => {
    console.log("Page change requested to:", page, "size:", pageSize);
    await loadData(page, pageSize);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AgenciesDataTable 
            data={agencies} 
            totalCount={totalCount}
            serverSidePagination={true}
            onPageChange={handlePageChange}
            loadApiData={loadApiData}
          />
        </div>
      </div>
    </div>
  );
}