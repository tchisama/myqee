// Script to add pool_id column to instances table
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

async function addPoolIdToInstances() {
  try {
    // Check if instances table exists
    const { data: tableExists, error: tableError } = await supabase.rpc('exec_sql', {
      sql: `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'instances'
      )`
    });

    if (tableError) {
      console.error('Error checking if instances table exists:', tableError);
      return;
    }

    console.log('Instances table exists:', tableExists);

    // Check if pool_id column exists
    const { data: columnExists, error: columnError } = await supabase.rpc('exec_sql', {
      sql: `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'instances' 
        AND column_name = 'pool_id'
      )`
    });

    if (columnError) {
      console.error('Error checking if pool_id column exists:', columnError);
      return;
    }

    console.log('pool_id column exists:', columnExists);

    // If pool_id column doesn't exist, add it
    if (!columnExists || !columnExists[0].exists) {
      const { error: addColumnError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.instances ADD COLUMN pool_id BIGINT`
      });

      if (addColumnError) {
        console.error('Error adding pool_id column:', addColumnError);
        return;
      }

      console.log('Added pool_id column to instances table');
    } else {
      console.log('pool_id column already exists');
    }

    // Check the structure of the instances table
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type FROM information_schema.columns
            WHERE table_name = 'instances' AND table_schema = 'public'`
    });

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return;
    }

    console.log('Instances table structure:', columns);

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addPoolIdToInstances();
