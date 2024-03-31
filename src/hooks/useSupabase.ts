import { useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function useSupabase() {
  return useMemo(createClient, [])
}
