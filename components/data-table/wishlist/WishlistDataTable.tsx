"use client"

import { DataTable } from "@/components/data-table"
import { getWishlistColumns } from "./wishlist-column"
import { useState, useEffect } from "react"
import { WishlistViewModal } from "./wishlist-view-modal"
import { Wishlist } from "@/types/whishlist"
import { getStatusBadge } from "@/utils/statusOptions"
import { formatBudget } from "@/utils/formatCurrency"
// Define the extended type for table display
export type WishlistForTable = Wishlist & {
  travelerName?: string
  statusBadge?: string
  budgetDisplay?: string
}

interface WishlistDataTableProps {
  data: Wishlist[]
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  serverSidePagination?: boolean
  loadApiData?: boolean
  onPageChange?: (page: number, pageSize: number) => void
  onEditWishlist?: (wishlistId: string) => void
  onDeleteWishlist?: (wishlistId: string) => void
  onTogglePublic?: (wishlistId: string, isPublic: boolean) => void
}

export function WishlistDataTable({
  data,
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  serverSidePagination = false,
  loadApiData,
  onPageChange,
  onEditWishlist,
  onDeleteWishlist,
  onTogglePublic
}: WishlistDataTableProps) {
  const [wishlistModal, setWishlistModal] = useState<{
    isOpen: boolean
    wishlistId: string | null
  }>({
    isOpen: false,
    wishlistId: null
  })

  const [wishlists, setWishlists] = useState<WishlistForTable[]>(
    data.map(wishlist => ({
      ...wishlist,
      travelerName: wishlist.traveler_profiles?.profiles?.full_name || "Unknown Traveler",
      statusBadge: getStatusBadge(wishlist.status),
      budgetDisplay: formatBudget(wishlist.estimated_budget, wishlist.currency)
    }))
  )

  // Update wishlists when data changes
  useEffect(() => {
    setWishlists(
      data.map(wishlist => ({
        ...wishlist,
        travelerName: wishlist.traveler_profiles?.profiles?.full_name || "Unknown Traveler",
        statusBadge: getStatusBadge(wishlist.status),
        budgetDisplay: formatBudget(wishlist.estimated_budget, wishlist.currency)
      }))
    )
  }, [data])



  // Function to open view modal
  const openViewModal = (wishlist: WishlistForTable) => {
    setWishlistModal({
      isOpen: true,
      wishlistId: wishlist.id
    })
  }

  // Function to close view modal
  const closeWishlistModal = () => {
    setWishlistModal({
      isOpen: false,
      wishlistId: null
    })
  }

  // Handle edit wishlist
  const handleEditWishlist = (wishlist: WishlistForTable) => {
    if (onEditWishlist) {
      onEditWishlist(wishlist.id)
    }
  }

  // Handle delete wishlist
  const handleDeleteWishlist = (wishlist: WishlistForTable) => {
    if (onDeleteWishlist) {
      onDeleteWishlist(wishlist.id)
    }
  }

  // Handle add new wishlist
  const handleAddWishlist = () => {
    // This would typically open a create modal or navigate to a create page
    console.log("Add new wishlist clicked")
    // You could implement a callback prop for this
  }

  // Handle status change
  const handleStatusChange = (wishlistId: string, newStatus: string) => {
    // Update the status locally
    setWishlists(prev => prev.map(w =>
      w.id === wishlistId
        ? {
          ...w,
          status: newStatus as any,
          statusBadge: getStatusBadge(newStatus)
        }
        : w
    ))
    // You might want to make an API call here
    console.log(`Status changed for wishlist ${wishlistId}: ${newStatus}`)
  }

  // Handle toggle public/private
  const handleTogglePublic = (wishlistId: string, isPublic: boolean) => {
    // Update the privacy status locally
    setWishlists(prev => prev.map(w =>
      w.id === wishlistId
        ? { ...w, is_public: isPublic }
        : w
    ))

    // Call the callback if provided
    if (onTogglePublic) {
      onTogglePublic(wishlistId, isPublic)
    }
  }

  return (
    <div className="space-y-4">
      <DataTable<WishlistForTable>
        data={wishlists}
        columns={getWishlistColumns}
        title="Wishlists"
        description="Manage travel wishlists and dream destinations"
        // addButtonLabel="Add Wishlist"
        // onAddNew={handleAddWishlist}
        onEdit={handleEditWishlist}
        onDelete={handleDeleteWishlist}
        onpenViewModal={openViewModal}
        loadApiData={loadApiData}

        // Pagination props
        serverSidePagination={serverSidePagination}
        totalCount={totalCount}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
        onPageChange={onPageChange}
      />

      <WishlistViewModal
        isOpen={wishlistModal.isOpen}
        onClose={closeWishlistModal}
        wishlistId={wishlistModal.wishlistId}
        onEdit={onEditWishlist}
        onDelete={onDeleteWishlist}
        onTogglePublic={handleTogglePublic}
      />
    </div>
  )
}