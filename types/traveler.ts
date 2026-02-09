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
// types/profile.ts
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;

  // Add other profile fields if they exist
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// types/traveler.ts
export interface TravelerProfileA {
  id: string;
  user_id: string;
  interests: string[];
  countries_visited: number;
  total_trips: number;
  total_spent: number;
  total_reviews: number;
  average_rating: number;
  status: string;
  preferred_currency: string;
  travel_style: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile; // Related profile data
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
    avatar_url:string | null
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