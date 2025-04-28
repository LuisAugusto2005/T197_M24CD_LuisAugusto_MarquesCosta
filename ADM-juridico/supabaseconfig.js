import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzumqfnuzpupmqczgidq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dW1xZm51enB1cG1xY3pnaWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY5MTQsImV4cCI6MjA2MTI1MjkxNH0._ilcsJBfaLWiGkn37Kca0rVZ1HAAUcj6c6Bm5FlP3po';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
