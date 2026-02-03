export type SubscriptionTier =
  | "free"
  | "basic"
  | "pro"
  | "enterprise"
export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  description: string | null
  monthly_price: number
  annual_price: number | null
  max_packages: number | null
  commission_rate: number
  features: Record<string, any> | null
  is_active: boolean | null
  sort_order: number | null
  created_at: string
  updated_at: string
}
