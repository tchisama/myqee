# Pools Management System

This feature adds support for Odoo pools in the QEE application. Each pool represents an Odoo server that can host up to 10 instances.

## Database Schema

The pools system adds the following to the database:

1. A new `pools` table with the following columns:
   - `id`: Primary key
   - `name`: Pool name
   - `description`: Optional description
   - `server_url`: URL of the Odoo server
   - `max_instances`: Maximum number of instances allowed (default: 10)
   - `instances_number`: Current number of instances in the pool
   - `status`: Pool status (active, inactive)
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

2. The `instances` table with the following columns:
   - `id`: Primary key
   - `name`: Instance name
   - `logo_url`: URL to the instance logo
   - `language`: Instance language (default: 'en')
   - `owner_id`: Reference to the user who owns this instance
   - `pool_id`: Reference to the pool this instance belongs to
   - `created_at`: Creation timestamp
   - `updated_at`: Last update timestamp

3. Helper functions for pool and instance management:
   - `assign_instance_to_pool`: Assigns an instance to a pool if there's capacity and updates instance counts
   - `get_available_pools`: Returns pools with available capacity
   - `get_pool_instances`: Returns instances in a specific pool
   - `find_or_create_pool_for_instance`: Automatically finds an available pool or creates a new one
   - `create_instance`: Creates a new instance and optionally assigns it to a pool

## Setup Instructions

1. Run the SQL scripts to create the necessary tables and functions:

```bash
# Create the instances table
node scripts/create-instances-table.js

# Create the pools table and add pool_id to instances
node scripts/create-pools-table.js
```

After running the scripts, access the pools management interface at `/admin/pools`

## Admin Interface

The pools management system includes:

1. A pools list page at `/admin/pools` with:
   - Create, edit, and delete pool functionality
   - Pool status and capacity information
   - Search functionality

2. A pool details page at `/admin/pools/[id]` with:
   - Pool information
   - Capacity visualization
   - List of instances in the pool
   - Ability to add/remove instances from the pool

## Usage

1. Create a new pool with a name, description, server URL, and maximum capacity
2. Assign instances to pools using the pool details page
3. Monitor pool capacity and manage instance assignments

## Automatic Pool Assignment

When a new instance is created during signup:

1. The system automatically looks for an available pool with capacity below 80% (8 instances for a pool with max_instances=10)
2. If a suitable pool is found, the instance is assigned to it
3. If no suitable pool is found, a new pool is automatically created
4. The instances_number counter is maintained to track pool capacity

This ensures that:

- New instances are always assigned to a pool
- Pools don't exceed 80% capacity unless necessary
- New pools are created when needed

## Implementation Details

- Pools have a maximum capacity (default: 10 instances)
- Instances can only be assigned to one pool at a time
- Pools with assigned instances cannot be deleted
- Only admin users can manage pools
