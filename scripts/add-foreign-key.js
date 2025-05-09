// Script to add foreign key constraint between instances and pools
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

async function addForeignKey() {
  try {
    // Check if foreign key constraint exists
    const { data: constraintExists, error: constraintError } = await supabase.rpc('exec_sql', {
      sql: `SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'instances_pool_id_fkey' 
        AND table_name = 'instances'
      )`
    });

    if (constraintError) {
      console.error('Error checking if foreign key constraint exists:', constraintError);
      return;
    }

    console.log('Foreign key constraint exists:', constraintExists);

    // If foreign key constraint doesn't exist, add it
    if (!constraintExists || !constraintExists[0].exists) {
      const { error: addConstraintError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE public.instances 
              ADD CONSTRAINT instances_pool_id_fkey 
              FOREIGN KEY (pool_id) REFERENCES public.pools(id)`
      });

      if (addConstraintError) {
        console.error('Error adding foreign key constraint:', addConstraintError);
        return;
      }

      console.log('Added foreign key constraint between instances and pools');
    } else {
      console.log('Foreign key constraint already exists');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addForeignKey();
