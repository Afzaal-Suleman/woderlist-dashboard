// types/profile.ts
export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

// types/agency.ts
export interface AgencyProfile {
  id: string;
  business_name: string;
  user_id: string;
  approved_by: string | null;
  user_profile: Profile | null;
  approver_profile: Profile | null;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
  city?:string;
  country?:string;
  tour_type?:string;
  registration_number?:string;
  cover_image_url?:string;
  instagram?:string;
  contact_name?:string;
  logo_url?:string;
  id_verification_url?: string
  tourism_permit_url?: string
  license_url?: string
  approved_at?:string
  destinations_covered?:string
  rejection_reason?:string
  languages?:string
  total_bookings?:string
  average_rating?:string
  total_reviews?:string
}

// types/package.ts
export interface Package {
  id: string;
  title: string;
  destination: string;
  short_description?: string | null;
  content?: string | null;
  created_at: string;
  updated_at: string;
  
  // Status from your actual data
  status: 'active' | 'inactive' | 'draft' | 'pending' | 'rejected'; // lowercase
  
  // Booking and capacity
  max_travelers: number;
  total_bookings: number;
  total_reviews: number;
  
  // Duration
  duration_days: number;
  duration_nights: number;
  
  // Age restrictions
  min_age?: number | null;
  max_age?: number | null;
  
  // Images
  images: string[];
  
  // Publication
  published_at?: string | null;
  
  // Relationships
  agency_profiles: AgencyProfile | null;
  
  // Fields from your previous structure (optional/legacy)
  limit?: string;
  target?: string;
  travelerName?: string;
  profileCity?: string;
  reviewer?: string;
  agency_id?: string | null;
  image_url?: string | null;
  price?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  tags?: string[];
  featured?: boolean;
  views_count?: number;
  bookings_count?: number;
}

// For table display with computed fields
export type PackageForTable = Package & {
  // Agency info
  agencyName: string;
  isApproved: boolean;
  
  // User/Author info (from agency_profiles.user_profile)
  travelerName: string;
  travelerEmail: string;
  profileCity: string;
  
  // Approver info (from agency_profiles.approver_profile)
  approverName: string;
  approverEmail: string;
  
  // Legacy/compatibility fields
  limit: string;
  target: string;
  reviewer: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: string | null;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

// Status Types
export type PackageStatus = 'active' | 'inactive' | 'draft' | 'pending' | 'rejected';

export const PACKAGE_STATUSES: Record<PackageStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
  pending: 'Pending',
  rejected: 'Rejected',
} as const;

// Status configuration for UI
export interface StatusConfig {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}



// Form Types
export interface PackageFormData {
  title: string;
  destination: string;
  short_description?: string;
  content?: string;
  status: PackageStatus;
  max_travelers: number;
  duration_days: number;
  duration_nights: number;
  min_age?: number;
  max_age?: number;
  images: string[];
  agency_id?: string;
  price?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

// Update Types
export interface UpdatePackageData {
  id: string;
  data: Partial<PackageFormData>;
}

// Filter Types
export interface PackageFilters {
  status?: PackageStatus | PackageStatus[];
  agency_id?: string;
  destination?: string;
  min_duration?: number;
  max_duration?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
}

// Sort Types
export type PackageSortField = 'created_at' | 'updated_at' | 'title' | 'destination' | 'total_bookings' | 'duration_days';
export type SortOrder = 'asc' | 'desc';

export interface PackageSortOptions {
  field: PackageSortField;
  order: SortOrder;
}

// Stats Types
export interface PackageStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  pending: number;
  rejected: number;
  total_bookings: number;
  avg_bookings: number;
  avg_duration: number;
}