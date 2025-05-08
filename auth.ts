
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createSupabaseServiceRole } from "./services/supabase.service"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session }) {
      if (session?.user) {
        try {
          // Create Supabase client with service role for admin privileges
          const supabase = createSupabaseServiceRole()

          // First try using the create_user_if_not_exists function
          try {
            const { error: functionError } = await supabase.rpc('create_user_if_not_exists', {
              p_email: session.user.email,
              p_name: session.user.name,
              p_img_url: session.user.image
            });

            if (functionError) {
              console.error('Error using create_user_if_not_exists:', functionError);

              // Fallback to direct query if the function call fails
              const { data, error: queryError } = await supabase
                .from('users')
                .select('email')
                .eq('email', session.user.email)
                .maybeSingle();

              if (queryError) {
                console.error('Error checking if user exists:', queryError);
              } else if (!data) {
                // User doesn't exist, insert them
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    email: session.user.email,
                    name: session.user.name,
                    img_url: session.user.image
                  });

                if (insertError) {
                  console.error('Error inserting user:', insertError);
                }
              }
            }
          } catch (error) {
            console.error('Error creating user in Supabase:', error)
          }
        } catch (err) {
          console.error('Error in session callback:', err)
        }
      }

      return session
    },
     authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboardPath = nextUrl.pathname.startsWith('/dashboard')
      const isAdminPath = nextUrl.pathname.startsWith('/admin')

      // Check if user is admin (has email pro.tchisama@gmail.com)
      const isAdmin = auth?.user?.email === 'pro.tchisama@gmail.com'

      console.log("Middleware check - Path:", nextUrl.pathname);
      console.log("Middleware check - User logged in:", isLoggedIn);
      console.log("Middleware check - User email:", auth?.user?.email);
      console.log("Middleware check - Is admin:", isAdmin);

      // Restrict admin paths to admin users only
      if (isAdminPath) {
        if (isLoggedIn && isAdmin) {
          console.log("Middleware - Admin access granted");
          return true;
        }
        // Redirect non-admin users to dashboard
        console.log("Middleware - Admin access denied, redirecting to dashboard");
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Handle dashboard paths
      if (isDashboardPath) {
        if (isLoggedIn) return true;
        // Redirect to signin if not logged in
        return Response.redirect(new URL('/signin', nextUrl));
      } else if (isLoggedIn && nextUrl.pathname === '/signin') {
        // Redirect to dashboard if already logged in and trying to access signin
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
})
