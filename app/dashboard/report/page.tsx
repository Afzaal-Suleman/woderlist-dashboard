"use client"
import { useEffect, useState, useCallback } from "react";
import { fetchUsersWithReportCount } from "@/server/fetch/fetchUsersWithReportCount";
import { Report } from "@/types/report";
import SelectInput from "@/components/SelectInput";
import { ReportDataTable } from "@/components/data-table/report/UserWithReportCount/ReportDataTable";
import { UserWithReportCount } from "@/server/fetch/fetchUsersWithReportCount";
export default function Page() {

  const options = [
    { label: 'Shoutout', value: 'shoutout' },
    { label: 'Shoutout reply', value: 'shoutout_reply' },
    { label: 'Traveler_profile', value: 'traveler_profile' },
    { label: 'Agency_profile', value: 'agency_profile' },
    { label: 'Agency_package', value: 'agency_package' },
    { label: 'Traveler_request', value: 'traveler_request' },
  ];

  const [reports, setReports] = useState<UserWithReportCount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadApiData, setIsLoading] = useState(false);
  const [value, setValue] = useState<{ label: string; value: string } | null>(null);

  // useCallback ensures this function is stable between renders
  const loadReport = useCallback(async (page: number, perPage: number, entityType?: string | null) => {
    setIsLoading(true);
    try {
      // const { data, count, error } = await fetchReport(
      //   page,
      //   perPage,
      //   entityType ? "entity_type" : "",
      //   entityType
      // );
      const { data, error, count } = await fetchUsersWithReportCount();


      if (!error) {
        setReports(data || []);
        setTotalCount(count || 0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);


  // effect triggers whenever value changes
  useEffect(() => {
    const entityType = value?.value || null;
    loadReport(currentPage, pageSize, entityType);
  }, [value, currentPage, pageSize, loadReport]);

  // For server-side pagination
  const handlePageChange = async (page: number, perPage: number) => {
    setCurrentPage(page);
    setPageSize(perPage);
    await loadReport(page, perPage);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="px-4 lg:px-6 z-10">
            {/* <ChartAreaInteractive /> */}
            {/* <SelectInput
              options={options}
              value={value}
              onChange={setValue}
              placeholder="Select report reason"
            /> */}
          </div>

          {/* Option 1: Client-side pagination (default)  */}
          <ReportDataTable
            data={reports}
            totalCount={totalCount}
            loadApiData={loadApiData}

          />

          {/* Option 2: Server-side pagination */}

          {/* <ReportDataTable
            data={reports}
            totalCount={totalCount}
            initialPage={currentPage - 1}
            initialPageSize={pageSize}
            serverSidePagination={true}
            onPageChange={handlePageChange}
          /> */}

        </div>
      </div>
    </div>
  );


}
