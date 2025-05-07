# Supabase Setup for QEE

This guide provides simple instructions for setting up Supabase for the QEE application.

## Setting Up the Database

1. Go to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of `supabase/setup.sql` into the query editor
6. Run the query to create the necessary tables, functions, and policies

## Environment Variables

Make sure your `.env.local` file has the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Replace the placeholders with your actual Supabase credentials.

## Verification

After setting up the database, restart your application and verify that users are being created correctly in Supabase when they sign in.
