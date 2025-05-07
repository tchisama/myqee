// Script to check if profiles table exists
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfilesTable() {
  try {
    // List all tables in the public schema
    const { data, error } = await supabase.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error fetching tables:', error);
      return;
    }
    
    console.log('Tables in public schema:', data.map(t => t.table_name));
    
    // Check if profiles table exists
    const profilesTable = data.find(t => t.table_name === 'profiles');
    if (profilesTable) {
      console.log('Profiles table exists');
      
      // Get profiles table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error('Error fetching columns:', columnsError);
        return;
      }
      
      console.log('Profiles table structure:', columns);
    } else {
      console.log('Profiles table does not exist');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkProfilesTable();
