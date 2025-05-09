// Script to check and fix pool capacity issues
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

async function fixPoolCapacity() {
  try {
    // Get all pools
    const { data: pools, error: poolsError } = await supabase
      .from('pools')
      .select('*')
      .order('created_at', { ascending: true });

    if (poolsError) {
      console.error('Error fetching pools:', poolsError);
      return;
    }

    console.log(`Found ${pools?.length || 0} pools`);

    // Check each pool for capacity issues
    for (const pool of pools) {
      console.log(`Checking pool ${pool.id}: ${pool.name}, instances: ${pool.instances_number}/${pool.max_instances}`);

      // Count actual instances in the pool
      const { count: actualCount, error: countError } = await supabase
        .from('instances')
        .select('*', { count: 'exact', head: true })
        .eq('pool_id', pool.id);

      if (countError) {
        console.error(`Error counting instances in pool ${pool.id}:`, countError);
        continue;
      }

      console.log(`  Actual instance count: ${actualCount}`);

      // Update the instances_number if it doesn't match the actual count
      if (actualCount !== pool.instances_number) {
        console.log(`  Updating pool ${pool.id} instances_number from ${pool.instances_number} to ${actualCount}`);
        
        const { error: updateError } = await supabase
          .from('pools')
          .update({ 
            instances_number: actualCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', pool.id);

        if (updateError) {
          console.error(`  Error updating pool ${pool.id} instances_number:`, updateError);
        } else {
          console.log(`  Updated pool ${pool.id} instances_number to ${actualCount}`);
        }
      }

      // Check if the pool is over capacity
      if (actualCount > pool.max_instances) {
        console.log(`  Pool ${pool.id} is over capacity: ${actualCount}/${pool.max_instances}`);
        
        // Get the instances in this pool
        const { data: instances, error: instancesError } = await supabase
          .from('instances')
          .select('*')
          .eq('pool_id', pool.id)
          .order('created_at', { ascending: false });

        if (instancesError) {
          console.error(`  Error fetching instances in pool ${pool.id}:`, instancesError);
          continue;
        }

        // Get or create a new pool for the overflow instances
        let newPoolId;
        
        // Check if there's an existing pool with capacity
        const { data: availablePools, error: availablePoolsError } = await supabase
          .from('pools')
          .select('*')
          .lt('instances_number', 'max_instances')
          .neq('id', pool.id)
          .order('instances_number', { ascending: true })
          .limit(1);

        if (availablePoolsError) {
          console.error('  Error finding available pools:', availablePoolsError);
          continue;
        }

        if (availablePools && availablePools.length > 0) {
          newPoolId = availablePools[0].id;
          console.log(`  Using existing pool ${newPoolId} for overflow instances`);
        } else {
          // Create a new pool
          const { count: poolCount, error: countError } = await supabase
            .from('pools')
            .select('*', { count: 'exact', head: true });

          if (countError) {
            console.error('  Error counting pools:', countError);
            continue;
          }

          const poolNumber = (poolCount || 0) + 1;
          
          const { data: newPool, error: newPoolError } = await supabase
            .from('pools')
            .insert({
              name: `Production Pool ${poolNumber}`,
              description: 'Automatically created pool for overflow instances',
              server_url: `https://odoo-server-${poolNumber}.example.com`,
              max_instances: 10,
              instances_number: 0,
              status: 'active'
            })
            .select();

          if (newPoolError) {
            console.error('  Error creating new pool:', newPoolError);
            continue;
          }

          newPoolId = newPool[0].id;
          console.log(`  Created new pool ${newPoolId} for overflow instances`);
        }

        // Move overflow instances to the new pool
        const overflowCount = actualCount - pool.max_instances;
        const overflowInstances = instances.slice(0, overflowCount);
        
        console.log(`  Moving ${overflowInstances.length} instances from pool ${pool.id} to pool ${newPoolId}`);
        
        for (const instance of overflowInstances) {
          const { error: updateError } = await supabase
            .from('instances')
            .update({ pool_id: newPoolId })
            .eq('id', instance.id);

          if (updateError) {
            console.error(`  Error moving instance ${instance.id} to pool ${newPoolId}:`, updateError);
          } else {
            console.log(`  Moved instance ${instance.id} to pool ${newPoolId}`);
          }
        }

        // Update the instances_number in both pools
        const { error: updateOldPoolError } = await supabase
          .from('pools')
          .update({ 
            instances_number: pool.max_instances,
            updated_at: new Date().toISOString()
          })
          .eq('id', pool.id);

        if (updateOldPoolError) {
          console.error(`  Error updating old pool ${pool.id} instances_number:`, updateOldPoolError);
        }

        // Get current count for the new pool
        const { count: newPoolCount, error: newPoolCountError } = await supabase
          .from('instances')
          .select('*', { count: 'exact', head: true })
          .eq('pool_id', newPoolId);

        if (newPoolCountError) {
          console.error(`  Error counting instances in new pool ${newPoolId}:`, newPoolCountError);
        } else {
          const { error: updateNewPoolError } = await supabase
            .from('pools')
            .update({ 
              instances_number: newPoolCount,
              updated_at: new Date().toISOString()
            })
            .eq('id', newPoolId);

          if (updateNewPoolError) {
            console.error(`  Error updating new pool ${newPoolId} instances_number:`, updateNewPoolError);
          } else {
            console.log(`  Updated new pool ${newPoolId} instances_number to ${newPoolCount}`);
          }
        }
      }
    }

    // Final check
    const { data: updatedPools, error: updatedPoolsError } = await supabase
      .from('pools')
      .select('*')
      .order('created_at', { ascending: true });

    if (updatedPoolsError) {
      console.error('Error fetching updated pools:', updatedPoolsError);
      return;
    }

    console.log('\nFinal pool status:');
    for (const pool of updatedPools) {
      console.log(`Pool ${pool.id}: ${pool.name}, instances: ${pool.instances_number}/${pool.max_instances}`);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

fixPoolCapacity();
