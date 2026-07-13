import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtokwwzrfanbuzfbswbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0b2t3d3pyZmFuYnV6ZmJzd2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzI4NzcsImV4cCI6MjA5OTM0ODg3N30.oixFPWR4aEAgMegZzHf-tQ2ZBuScghYkX--aj8eddag';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);