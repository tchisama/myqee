// Script to check instances table structure
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstancesTable() {
  try {
    // Get instances table structure using a raw SQL query
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'instances' AND table_schema = 'public'`
    });

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return;
    }

    console.log('Instances table structure:', columns);

    // Get a sample instance
    const { data: instanceData, error: instanceError } = await supabase
      .from('instances')
      .select('*')
      .limit(1);

    if (instanceError) {
      console.error('Error fetching instance:', instanceError);
      return;
    }

    console.log('Sample instance:', instanceData);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkInstancesTable();
