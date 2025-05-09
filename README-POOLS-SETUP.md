# Pool Management System Setup

This document provides instructions for setting up the pool management system for the QEE application.

## Database Schema

The pool management system consists of two main tables:

1. `instances` table with a `pool_id` column
2. `pools` table to store information about Odoo pools

## Setup Instructions

Follow these steps to set up the pool management system:

* Create the instances table with the pool_id column:

```bash
node scripts/create-simple-instances.js
```

* Create the pools table:

```bash
node scripts/create-simple-pools.js
```

* Add the foreign key constraint between instances and pools:

```bash
node scripts/add-foreign-key.js
```

* Assign existing instances to pools:

```bash
node scripts/assign-instances-to-pools.js
```

## Troubleshooting

If you encounter issues with the setup, try the following:

* Check if the instances table exists and has the pool_id column:

```bash
node scripts/add-pool-id-to-instances.js
```

* Verify that the foreign key constraint exists:

```bash
node scripts/add-foreign-key.js
```

## Automatic Pool Assignment

The signup page has been updated to automatically create a pool if needed and assign new instances to it. The process works as follows:

1. When a new instance is created, the system checks if any pools exist
2. If no pools exist or all pools are at capacity, a new pool is created
3. The instance is assigned to the pool
4. The instances_number counter in the pool is updated

This ensures that every new instance is automatically assigned to a pool.

## Manual Instance Creation

When creating a new instance, you can assign it to a pool by setting the pool_id field:

```javascript
const { data, error } = await supabase
  .from('instances')
  .insert({
    name: 'Instance Name',
    logo_url: 'https://example.com/logo.png',
    language: 'en',
    owner_id: userId,
    pool_id: poolId // Optional, can be null
  })
  .select();
```

## Maintenance Scripts

Several scripts have been created to help test and manage the pool system:

* `scripts/check-pools-and-instances.js` - Check the current state of pools and instances
* `scripts/create-test-user.js` - Create a test user
* `scripts/create-test-data.js` - Create a test pool and instance
* `scripts/assign-instances-to-pools.js` - Assign instances without a pool to a new or existing pool
* `scripts/fix-pool-capacity.js` - Fix pools that exceed their capacity by moving instances to new pools

If you encounter issues with pools exceeding their capacity (e.g., a pool showing 11/10 instances), run the fix-pool-capacity script:

```bash
node scripts/fix-pool-capacity.js
```

This script will:

1. Check all pools for capacity issues
2. Update the instances_number counter to match the actual count of instances
3. Move overflow instances to a new or existing pool with available capacity

## Pool Management

After setting up the database schema, you can use the admin interface at `/admin/pools` to manage pools and assign instances to them.
