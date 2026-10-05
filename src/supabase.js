import { createClient } from '@supabase/supabase-js'

// Tus credenciales directas para solucionar el error de inmediato
const supabaseUrl = 'https://qpbuauzuqniamvnvtwkl.supabase.co'
const supabaseAnonKey = 'sb_publishable_PHHcoLCpNLCQe3Lh9GKz_A_OAGMeKap'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)