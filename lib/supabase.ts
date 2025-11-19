import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Submission = {
  id: string
  user: 'hubby' | 'wifey'
  date: string
  question: string
  answer: string
  created_at: string
}

export type LoveNote = {
  id: string
  from_user: 'hubby' | 'wifey'
  to_user: 'hubby' | 'wifey'
  date: string
  note: string
  read: boolean
  created_at: string
}
