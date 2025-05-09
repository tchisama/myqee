// Script to create test data
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

async function createTestData() {
  try {
    // Get a user ID
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.error('No users found in the database');
      return;
    }

    const userId = users[0].id;
    console.log(`Using user ID: ${userId}`);

    // Create a test pool
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .insert({
        name: 'Test Pool',
        description: 'Test pool for development',
        server_url: 'https://test-odoo-server.example.com',
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
    console.log(`Created test pool with ID: ${poolId}`);

    // Create a test instance
    const { data: instance, error: instanceError } = await supabase
      .from('instances')
      .insert({
        name: 'Test Instance',
        logo_url: 'https://example.com/logo.png',
        language: 'en',
        owner_id: userId,
        pool_id: poolId
      })
      .select();

    if (instanceError) {
      console.error('Error creating instance:', instanceError);
      return;
    }

    const instanceId = instance[0].id;
    console.log(`Created test instance with ID: ${instanceId}`);

    // Update the instances_number in the pool
    const { error: updatePoolError } = await supabase
      .from('pools')
      .update({ 
        instances_number: 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', poolId);

    if (updatePoolError) {
      console.error('Error updating pool instances_number:', updatePoolError);
    } else {
      console.log(`Updated pool ${poolId} instances_number to 1`);
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

createTestData();
