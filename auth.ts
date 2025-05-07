
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


      // check if the user have a instance
      // const hasInstance = async () => {
      //   const supabase = createSupabaseServiceRole()
      //   const {data:user} = await supabase
      //     .from('users')
      //     .select('id')
      //     .eq('email', auth?.user?.email)
      //     .single()
      //   if (!user) {
      //     console.error('Error fetching user with email ' + auth?.user?.email + ':', user)
      //     return Response.redirect(new URL('/signup', nextUrl))
      //   }else{
      //     console.log("USER::", user)
      //   }
      //   const { data, error } = await supabase
      //     .from('instances')
      //     .select('id')
      //     .eq('owner_id', user?.id)
      //     .single()
      //   if (error) {
      //     console.error('Error fetching instance of userId ' + user?.id + ':', error)
      //     return Response.redirect(new URL('/signup', nextUrl))
      //   }
      //   if (!data) {
      //     return Response.redirect(new URL('/signup', nextUrl))
      //   }
      // }
      // if (isLoggedIn && nextUrl.pathname === '/dashboard') {
      //   return hasInstance()
      // }
    

      if (isDashboardPath) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === '/signin') {
        // return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
})
