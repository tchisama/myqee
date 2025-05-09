// Script to create combined schema for instances and pools
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

async function createCombinedSchema() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('./supabase/combined-schema.sql', 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }

    console.log('Combined schema created successfully');
    
    // Check the structure of the instances table
    const { data: instanceColumns, error: instanceColumnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'instances' AND table_schema = 'public'`
    });

    if (instanceColumnsError) {
      console.error('Error fetching instance columns:', instanceColumnsError);
      return;
    }

    console.log('Instances table structure:', instanceColumns);
    
    // Check the structure of the pools table
    const { data: poolColumns, error: poolColumnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'pools' AND table_schema = 'public'`
    });

    if (poolColumnsError) {
      console.error('Error fetching pool columns:', poolColumnsError);
      return;
    }

    console.log('Pools table structure:', poolColumns);
    
    // Check if the functions were created
    const { data: functions, error: functionsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT proname, proargnames FROM pg_proc 
            WHERE proname IN ('create_instance', 'find_or_create_pool_for_instance', 'assign_instance_to_pool', 'get_available_pools', 'get_pool_instances')
            AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')`
    });

    if (functionsError) {
      console.error('Error fetching functions:', functionsError);
      return;
    }

    console.log('Created functions:', functions);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createCombinedSchema();
