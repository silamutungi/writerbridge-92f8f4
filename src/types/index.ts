export type UserRole = 'writer' | 'client'

export interface Profile {
  id: string
  user_id: string
  full_name: string
  role: UserRole
  bio: string
  hourly_rate: number | null
  specialties: string[]
  portfolio_url: string | null
  avatar_url: string | null
  created_at: string
  deleted_at: string | null
}

export interface Job {
  id: string
  user_id: string
  title: string
  description: string
  budget_min: number
  budget_max: number
  category: string
  skills_required: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  deadline: string | null
  created_at: string
  deleted_at: string | null
}

export interface Proposal {
  id: string
  job_id: string
  writer_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  deleted_at: string | null
}

export interface Contract {
  id: string
  job_id: string
  client_id: string
  writer_id: string
  agreed_rate: number
  status: 'active' | 'completed' | 'disputed' | 'cancelled'
  escrow_amount: number
  escrow_released: boolean
  started_at: string
  completed_at: string | null
  created_at: string
  deleted_at: string | null
}

export interface Review {
  id: string
  contract_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string
  created_at: string
  deleted_at: string | null
}
