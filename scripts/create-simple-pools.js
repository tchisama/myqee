// Script to create a simple pools table
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

async function createSimplePoolsTable() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./supabase/simple-pools.sql', 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }

    console.log('Simple pools table created successfully');
    
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
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createSimplePoolsTable();
