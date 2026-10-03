import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_SUPABASE_URL) || 
                    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
                    'https://gyxhbcowrhubfsoqjtuu.supabase.co';

const supabaseKey = (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_SUPABASE_ANON_KEY) || 
                    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
                    'sb_publishable_tcvoR4pkbdw0WFvHi6oMBg_UeVbFxgz';

export const supabase = createClient(supabaseUrl, supabaseKey);

