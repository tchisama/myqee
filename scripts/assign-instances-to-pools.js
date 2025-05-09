// Script to assign instances to pools
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

async function assignInstancesToPools() {
  try {
    // Get all instances without a pool
    const { data: instances, error: instancesError } = await supabase
      .from('instances')
      .select('id')
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

    // Get or create a pool
    let poolId;
    
    // Check if a pool exists
    const { data: pools, error: poolsError } = await supabase
      .from('pools')
      .select('id, instances_number, max_instances')
      .eq('status', 'active')
      .order('instances_number', { ascending: true })
      .limit(1);

    if (poolsError) {
      console.error('Error fetching pools:', poolsError);
      return;
    }

    if (pools && pools.length > 0) {
      poolId = pools[0].id;
      console.log(`Using existing pool with ID ${poolId}`);
    } else {
      // Create a new pool
      const { data: newPool, error: newPoolError } = await supabase
        .from('pools')
        .insert({
          name: 'Production Pool 1',
          description: 'Automatically created pool',
          server_url: 'https://odoo-server-1.example.com',
          max_instances: 10,
          instances_number: 0,
          status: 'active'
        })
        .select();

      if (newPoolError) {
        console.error('Error creating pool:', newPoolError);
        return;
      }

      poolId = newPool[0].id;
      console.log(`Created new pool with ID ${poolId}`);
    }

    // Assign instances to the pool
    for (const instance of instances) {
      const { error: updateError } = await supabase
        .from('instances')
        .update({ pool_id: poolId })
        .eq('id', instance.id);

      if (updateError) {
        console.error(`Error assigning instance ${instance.id} to pool:`, updateError);
      } else {
        console.log(`Assigned instance ${instance.id} to pool ${poolId}`);
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

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

assignInstancesToPools();
