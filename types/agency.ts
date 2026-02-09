export type Agency = {
  id: number
  created_at: string
  email: string | null
  full_name: string | null
  role: string | null
  status?: string
  target?: string
  limit?: string
}

export type UserRole = 'traveler' | 'superadmin' | 'agency'; 

export interface Profile {
  id: string;                
  email: string;             
  full_name?: string | null; 
  avatar_url?: string | null; 
  role: UserRole;            
  created_at: string;        
  updated_at: string;        
}
export type AgencyData = {
  id: string
  user_id: string
  business_name: string
  registration_number: string | null
  country: string
  city: string
  address: string | null
  contact_name: string
  phone: string | null
  website: string | null
  instagram: string | null
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  license_url: string | null
  id_verification_url: string | null
  tourism_permit_url: string | null
  tour_type: 'local' | 'international' | 'both'  // match your enum
  destinations_covered: string[]
  languages: string[]
  status: 'pending' | 'approved' | 'rejected' // match your enum
  rejection_reason: string | null
  approved_at: string | null  // timestamp in ISO format
  approved_by: string | null  // user id of approver
  average_rating: number
  total_reviews: number
  total_bookings: number
  created_at: string  // timestamp in ISO format
  updated_at: string  // timestamp in ISO format

  // embedded owner profile
  profiles: Profile,
}
