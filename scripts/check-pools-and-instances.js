// Script to check pools and instances
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

async function checkPoolsAndInstances() {
  try {
    // Check pools
    const { data: pools, error: poolsError } = await supabase
      .from('pools')
      .select('*')
      .order('created_at', { ascending: false });

    if (poolsError) {
      console.error('Error fetching pools:', poolsError);
    } else {
      console.log(`Found ${pools?.length || 0} pools:`);
      pools?.forEach(pool => {
        console.log(`- Pool ${pool.id}: ${pool.name}, instances: ${pool.instances_number}/${pool.max_instances}`);
      });
    }

    // Check instances
    const { data: instances, error: instancesError } = await supabase
      .from('instances')
      .select(`
        *,
        owner:users(name, email)
      `)
      .order('created_at', { ascending: false });

    if (instancesError) {
      console.error('Error fetching instances:', instancesError);
    } else {
      console.log(`\nFound ${instances?.length || 0} instances:`);
      instances?.forEach(instance => {
        console.log(`- Instance ${instance.id}: ${instance.name}, pool_id: ${instance.pool_id || 'none'}, owner: ${instance.owner?.email || 'unknown'}`);
      });
    }

    // Check instances without pools
    const { data: instancesWithoutPool, error: withoutPoolError } = await supabase
      .from('instances')
      .select('id, name')
      .is('pool_id', null);

    if (withoutPoolError) {
      console.error('Error fetching instances without pool:', withoutPoolError);
    } else {
      console.log(`\nFound ${instancesWithoutPool?.length || 0} instances without a pool:`);
      instancesWithoutPool?.forEach(instance => {
        console.log(`- Instance ${instance.id}: ${instance.name}`);
      });
    }

    // Check foreign key constraint
    const { data: constraint, error: constraintError } = await supabase.rpc('exec_sql', {
      sql: `SELECT tc.constraint_name, tc.table_name, kcu.column_name, 
                  ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
           FROM information_schema.table_constraints AS tc 
           JOIN information_schema.key_column_usage AS kcu
             ON tc.constraint_name = kcu.constraint_name
           JOIN information_schema.constraint_column_usage AS ccu
             ON ccu.constraint_name = tc.constraint_name
           WHERE tc.constraint_type = 'FOREIGN KEY' 
             AND tc.table_name = 'instances'
             AND kcu.column_name = 'pool_id'`
    });

    if (constraintError) {
      console.error('Error checking foreign key constraint:', constraintError);
    } else {
      console.log('\nForeign key constraint:');
      console.log(constraint);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkPoolsAndInstances();
