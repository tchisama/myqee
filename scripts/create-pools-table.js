// Script to create pools table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

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

async function createPoolsTable() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./supabase/pools.sql', 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }

    console.log('Pools table created successfully');
    
    // Check the structure of the pools table
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'pools' AND table_schema = 'public'`
    });

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return;
    }

    console.log('Pools table structure:', columns);
    
    // Check if instances table was updated with pool_id column
    const { data: instanceColumns, error: instanceColumnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'instances' AND table_schema = 'public' AND column_name = 'pool_id'`
    });

    if (instanceColumnsError) {
      console.error('Error fetching instance columns:', instanceColumnsError);
      return;
    }

    console.log('Instance table pool_id column:', instanceColumns);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createPoolsTable();
