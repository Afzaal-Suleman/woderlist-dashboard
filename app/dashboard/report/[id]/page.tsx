"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from "next/navigation"
import { fetchReportsByuserIdAndEntity, fetchEntityTypeOptions } from '@/server/fetch/fetchReport'
import { Report } from '@/types/report'
import { fetchShoutoutsByIds } from '@/server/fetch/fetchShoutout'
import { ShoutoutDataTable } from '@/components/data-table/shoutout/ShoutoutDataTable'
import { Shoutout } from '@/types/shoutout'
import { fetchTravelerProfileByUserIds } from '@/server/fetch/fetchTravelers'
import { fetchAgencyProfileByUserIds } from '@/server/fetch/fetchAgencies'
import { TravelersDataTable } from '@/components/data-table/traveler/TravelersDataTable'
import { TravelerProfileA } from '@/types/traveler'
import { Package } from '@/types/packages'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProfileHeader } from '@/components/profile-header'
import { AgencyData } from '@/types/agency'
import { fetchPackagesByIds } from '@/server/fetch/fetchPackages'
import { PackageDataTable } from '@/components/data-table/packageComp/PackagesDataTable'
export default function SimpleScrollableTabs() {
    const params = useParams()
    const id = params.id
    const searchParams = useSearchParams()
    const role = searchParams.get('r')
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<string>('')
    const [reports, setReports] = useState<Report[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [loadApiData, setIsLoading] = useState(false)
    const [options, setOptions] = useState<{ label: string; value: string }[]>([])
    const [shoutouts, setShoutouts] = useState<Shoutout[]>([])
    const [travelers, setTravelers] = useState<TravelerProfileA[]>([])
    const [agencies, setAgencies] = useState<AgencyData[]>([])
    const [packages, setPackages] = useState<Package[]>([])

    const [isLoadingShoutouts, setIsLoadingShoutouts] = useState(false)
    const [isLoadingTravelers, setIsLoadingTravelers] = useState(false)
    const [isLoadingAgencies, setIsLoadingAgencies] = useState(false)

    const loadReport = useCallback(async (page: number, perPage: number, entityType?: string) => {
        if (!id || !entityType) return

        setIsLoading(true)
        try {
            // 1. Fetch reports
            const { data, count, error } = await fetchReportsByuserIdAndEntity(
                page,
                perPage,
                "entity_type",
                entityType,
                id.toString()
            )

            if (!error) {
                setReports(data || [])
                setTotalCount(count || 0)

                // 2. Fetch related entity data based on type
                if (data && data.length > 0) {
                    const entityIds = data.map(item => item.entity_id).filter(Boolean) as string[]

                    switch (entityType) {
                        case "shoutout":
                            setIsLoadingShoutouts(true)
                            try {
                                const { data: shoutoutsData, count } = await fetchShoutoutsByIds(entityIds)
                                setTotalCount(count)
                                setShoutouts(shoutoutsData || [])
                            } finally {
                                setIsLoadingShoutouts(false)
                            }
                            break;

                        case "traveler_profile":
                            setIsLoadingTravelers(true)
                            try {
                                const { data: travelersData, count } = await fetchTravelerProfileByUserIds(entityIds)
                                setTotalCount(count)
                                setTravelers(travelersData || [])
                            } finally {
                                setIsLoadingTravelers(false)
                            }
                            break;

                        case "agency_profile":
                            setIsLoadingAgencies(true)
                            try {
                                const { data: agenciesData } = await fetchAgencyProfileByUserIds(entityIds)
                                setAgencies(agenciesData || [])
                            } finally {
                                setIsLoadingAgencies(false)
                            }
                            break;
                        case "agency_package":
                            setIsLoadingAgencies(true)
                            try {
                                const { data: packagesData, count } = await fetchPackagesByIds(entityIds)
                                setPackages(packagesData || [])
                                setTotalCount(count)
                            } finally {
                                setIsLoadingAgencies(false)
                            }
                            break;

                        // Add more cases for other entity types
                        default:
                            // Clear all related data for other entity types
                            setShoutouts([])
                        // setTravelers([])
                        // setAgencies([])
                    }
                } else {
                    // No reports, clear related data
                    setShoutouts([])
                    // setTravelers([])
                    // setAgencies([])
                }
            }
        } catch (error) {
            console.error("Error loading report:", error)
        } finally {
            setIsLoading(false)
        }
    }, [id])
    // Load options on component mount
    useEffect(() => {
        const fetchOptions = async () => {
            if (!id) return
            const op = await fetchEntityTypeOptions(id.toString())

            if (op && op.length > 0) {
                setOptions(op)

                // Set initial active tab to the first option
                if (!activeTab) {
                    const firstTab = op[0].value
                    console.log("Setting initial tab to:", firstTab)
                    setActiveTab(firstTab)
                }
            }
        }

        fetchOptions()
    }, [id, activeTab])

    // Load reports when activeTab changes
    useEffect(() => {
        if (activeTab && id) {
            loadReport(currentPage, pageSize, activeTab)
        }
    }, [activeTab, currentPage, pageSize, loadReport, id])

    // Handle tab click
    const handleTabClick = (value: string) => {
        console.log("Tab clicked:", value)
        setActiveTab(value)
        // Reset to first page when switching tabs
        setCurrentPage(1)
    }
 const handlePageChange = async (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    await loadReport(page, pageSize, activeTab);
  };
    return (
        <div className="w-full space-y-4 p-4">
            <div className="container mx-auto px-6">
                {/* Full header */}
                {/* <ProfileHeader
                    role={role?? ""}
                    userId={id?.toString()?? ""}
                /> */}

                {/* Or compact version */}
                <ProfileHeader
                    role={role ?? ""}
                    userId={id?.toString() ?? ""}
                    variant="compact"
                />

                {/* Your other content */}
                <div className="mt-6">
                    {/* Other components */}
                </div>
            </div>

            {/* Scrollable tabs container */}
            <div className="relative">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="flex space-x-1 min-w-max py-2 px-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleTabClick(option.value)}
                                className={`
                                    relative flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg
                                    transition-all duration-200 whitespace-nowrap
                                    ${activeTab === option.value
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                {option.label}
                                {activeTab === option.value && (
                                    <span className="absolute inset-x-0 -bottom-1 mx-auto w-6 h-0.5 bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gradient overlay for mobile indication */}
                <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
            </div>

            {/* Content area */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-2">
                {/* <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold">
                            {options.find(opt => opt.value === activeTab)?.label || 'Select a tab'} Reports
                        </h2>
                        <span className="text-xs sm:text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            {activeTab || 'No tab selected'}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                        Manage all reports related to {activeTab?.replace('_', ' ') || 'selected content'}
                    </p>
                </div> */}

                {/* Reports data display */}
                <div className="">
                    {activeTab === "shoutout" &&
                        <ShoutoutDataTable
                            title={activeTab + " Reports"}
                            description={`Manage all reports related to ${activeTab?.replace('_', ' ') || 'selected content'}`}
                            onRowClick={(user) => router.push(`/dashboard/report/${id}/${user.id}/#`)}
                            data={shoutouts}
                            totalCount={totalCount}
                            initialPage={currentPage - 1}
                            loadApiData={loadApiData}
                            initialPageSize={pageSize}
                            serverSidePagination={true}
                            onPageChange={handlePageChange}
                        />}
                    {activeTab === "traveler_profile" &&
                        <TravelersDataTable
                            data={travelers}
                            totalCount={totalCount}
                            initialPage={currentPage - 1}
                            initialPageSize={pageSize}
                            serverSidePagination={true}
                            onPageChange={handlePageChange}
                            loadApiData={loadApiData}
                        />}
                    {activeTab === "agency_package" &&
                        <PackageDataTable
                            data={packages}
                            totalCount={totalCount}
                            initialPage={currentPage - 1}
                            initialPageSize={pageSize}
                            serverSidePagination={true}
                            onPageChange={handlePageChange}
                            loadApiData={loadApiData}
                        />}


                </div>
            </div>

            {/* Mobile hint */}
            <div className="text-center sm:hidden">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                    <span className="animate-bounce">←</span>
                    Scroll to see more tabs
                    <span className="animate-bounce">→</span>
                </p>
            </div>
        </div>
    )
}