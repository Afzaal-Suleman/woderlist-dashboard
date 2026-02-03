// types/wishlists.ts
export type WishlistStatus = 'planning' | 'booked' | 'in_progress' | 'completed' | 'cancelled'

export interface Wishlist {
  id: string
  traveler_id: string
  destination: string
  destination_country: string | null
  status: WishlistStatus
  target_start_date: string | null
  target_end_date: string | null
  estimated_budget: number | null
  currency: string | null
  notes: string | null
  is_public: boolean | null
  actual_start_date: string | null
  actual_end_date: string | null
  travelers_count: number | null
  total_cost: number | null
  expenses: Record<string, number> | null
  tips: string | null
  photos: string[] | null
  rating: number | null
  created_at: string
  updated_at: string
  cover_image: string | null
  is_private: boolean | null
  traveler_profiles?: {
    id: string
    user_id: string
    profiles?: {
      full_name: string | null
      email: string
    }
  }
}

export interface WishlistResponse {
  data: Wishlist | null
  error: {
    message: string
  } | null
}