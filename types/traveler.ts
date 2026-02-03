export type Traveler = {
  id: number
  created_at: string
  email: string | null
  full_name: string | null
  role: string | null
  status?: string
  target?: string
  limit?: string
}

export interface TravelerProfile {
  id: string
  user_id: string
  interests: string[] | null
  countries_visited: number | null
  total_trips: number | null
  total_spent: number | null
  preferred_currency: string | null
  travel_style: string | null
  created_at: string
  updated_at: string
  user_profile?: {
    id: string
    full_name: string | null
    email: string
    phone: string | null
    city: string | null
    country: string | null
  }
}

export interface TravelerProfileResponse {
  data: TravelerProfile | null
  error: {
    message: string
  } | null
}