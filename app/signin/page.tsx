"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      // Use next-auth/react signIn method
      await signIn("google", {
        callbackUrl: "/dashboard"
      })
    } catch (error) {
      console.error("Authentication error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>

        {/* Stars/dots */}
        <div className="absolute h-2 w-2 rounded-full bg-primary/30 top-[10%] left-[20%] animate-pulse"></div>
        <div className="absolute h-1 w-1 rounded-full bg-primary/20 top-[30%] left-[80%] animate-pulse"></div>
        <div className="absolute h-1.5 w-1.5 rounded-full bg-primary/25 top-[70%] left-[10%] animate-pulse"></div>
        <div className="absolute h-1 w-1 rounded-full bg-primary/20 top-[50%] left-[40%] animate-pulse"></div>
        <div className="absolute h-2 w-2 rounded-full bg-primary/30 top-[20%] left-[60%] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 h-20 w-auto scale-100 transition-all duration-300 ">
            <Image
              src="/qee-nano.png"
              alt="QEE Logo"
              width={400}
              height={200}
              className="h-full w-auto object-contain drop-shadow-md"
              priority
            />
          </div>
          <p className="mt-2 text-base text-slate-600">
            Sign in to access your dashboard
          </p>
        </div>

        <Card className="overflow-hidden border-primary/10 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-500">
              Continue with Google to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pb-6">
            <Button
              className={cn(
                "w-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
                "flex items-center gap-2 shadow-sm transition-all duration-300 hover:shadow",
                "relative overflow-hidden group"
              )}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  // <LogIn className="h-4 w-4 text-primary" />
                  <Image
                    src="/icons/google-logo.svg"
                    alt="Google Logo"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                )}
                Sign in with Google
              </span>
            </Button>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <Shield className="h-3 w-3 text-primary/70" />
              <span>Secure authentication</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="text-center text-sm text-slate-500">
              By continuing, you agree to our{" "}
              <Link href="#" className="font-medium text-primary hover:underline transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-primary hover:underline transition-colors">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline transition-colors">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            Need help?{" "}
            <Link href="#" className="font-medium text-primary hover:underline transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
