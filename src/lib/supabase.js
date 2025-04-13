import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ooehhrcpgvyyznkdktrz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZWhocmNwZ3Z5eXpua2RrdHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDEwMzUsImV4cCI6MjA1OTIxNzAzNX0.Taz4KaEszuruQCYjxajaRVw_8pYKokMwdYgg9i7StDQ"

export const supabase = createClient(supabaseUrl, supabaseKey);