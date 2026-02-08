import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqfntftbughorckugceu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZm50ZnRidWdob3Jja3VnY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzI2NjAsImV4cCI6MjA4MzA0ODY2MH0.BsDaU4QxerYBDKM_0bPFxVEkoyT2emuysDhj4bAxc_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
