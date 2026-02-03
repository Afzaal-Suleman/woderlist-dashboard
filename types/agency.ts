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