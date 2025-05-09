// Script to create a pool and assign instances to it
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

async function createPoolAndAssign() {
  try {
    // Get instances without a pool
    const { data: instances, error: instancesError } = await supabase
      .from('instances')
      .select('id, name')
      .is('pool_id', null);

    if (instancesError) {
      console.error('Error fetching instances:', instancesError);
      return;
    }

    console.log(`Found ${instances?.length || 0} instances without a pool`);

    if (!instances || instances.length === 0) {
      console.log('No instances to assign to pools');
      return;
    }

    // Create a new pool
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .insert({
        name: 'Production Pool 1',
        description: 'Manually created pool',
        server_url: 'https://odoo-server-1.example.com',
        max_instances: 10,
        instances_number: 0,
        status: 'active'
      })
      .select();

    if (poolError) {
      console.error('Error creating pool:', poolError);
      return;
    }

    const poolId = pool[0].id;
    console.log(`Created new pool with ID ${poolId}`);

    // Assign instances to the pool
    for (const instance of instances) {
      const { error: updateError } = await supabase
        .from('instances')
        .update({ pool_id: poolId })
        .eq('id', instance.id);

      if (updateError) {
        console.error(`Error assigning instance ${instance.id} to pool:`, updateError);
      } else {
        console.log(`Assigned instance ${instance.id} (${instance.name}) to pool ${poolId}`);
      }
    }

    // Update the instances_number in the pool
    const { error: updatePoolError } = await supabase
      .from('pools')
      .update({ 
        instances_number: instances.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', poolId);

    if (updatePoolError) {
      console.error('Error updating pool instances_number:', updatePoolError);
    } else {
      console.log(`Updated pool ${poolId} instances_number to ${instances.length}`);
    }

    // Check the result
    const { data: updatedPool, error: getPoolError } = await supabase
      .from('pools')
      .select('*')
      .eq('id', poolId)
      .single();

    if (getPoolError) {
      console.error('Error fetching updated pool:', getPoolError);
    } else {
      console.log(`Pool ${updatedPool.id}: ${updatedPool.name}, instances: ${updatedPool.instances_number}/${updatedPool.max_instances}`);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createPoolAndAssign();
