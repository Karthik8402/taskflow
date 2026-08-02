import type { Database } from './database.types'

export type TodoCategory = 'daily' | 'weekly' | 'monthly'
export type TodoPriority = 'low' | 'medium' | 'high'

export type Todo = Database['public']['Tables']['todos']['Row']
export type TodoInsert = Database['public']['Tables']['todos']['Insert']
export type TodoUpdate = Database['public']['Tables']['todos']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type StatusFilter = 'all' | 'pending' | 'completed'

export interface TodoFilter {
  search: string
  category: TodoCategory | 'all'
  priority: TodoPriority | 'all'
  status: StatusFilter
}

export interface StatsSummary {
  total: number
  completed: number
  pending: number
  completionPercentage: number
  daily: { total: number; completed: number }
  weekly: { total: number; completed: number }
  monthly: { total: number; completed: number }
  highPriorityCount: number
}
