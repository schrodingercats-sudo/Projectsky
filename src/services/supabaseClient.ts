import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pbazwwgbugtqxxmpmilt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiYXp3d2didWd0cXh4bXBtaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDkxODgsImV4cCI6MjA4MzUyNTE4OH0.lclLmmCql2sbbx5Jgl3tHxzhCwmF-mGidvjXLivQsuI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
