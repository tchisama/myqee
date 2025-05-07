"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast } from "sonner"

interface GoogleSignInStepProps {
  onVerificationComplete?: () => void;
}

export function GoogleSignInStep({ onVerificationComplete }: GoogleSignInStepProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [, setIsVerified] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl");

  const {data:session} = useSession()

  // Check if user is already authenticated via Google
  useEffect(() => {
    if (session?.user?.email) {
      setIsLoggedIn(true)
      // In a real app, you would check if email is verified from the session
      // For now, we'll simulate that email is not verified yet
      setIsEmailVerified(false)
    }
  }, [searchParams, session])

  // Handle OTP verification
  const handleVerifyEmail = () => {
    // In a real app, you would send this OTP to your backend for verification
    if (otpValue.length === 6) {
      setIsEmailVerified(true)
      setIsVerified(true)
      if (onVerificationComplete) {
        onVerificationComplete()
      }
    }
  }

  // Simulate sending verification code
  const handleSendVerificationCode = () => {
    // In a real app, you would call an API to send the verification code
    toast.success("Verification code sent to your email")
  }

  // Handle changing email (sign out)
  const handleChangeEmail = async () => {
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    setIsEmailVerified(false);
    toast.success("Signed out successfully. You can sign in with a different email.");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-2"
    >
      {!isLoggedIn ? (
        // Google Sign-in Button - Simplified
        <div className="w-full max-w-md">
          <Button
            className={cn(
              " bg-white mx-auto mb-10 text-slate-800 hover:bg-slate-100 border border-slate-200",
              "flex items-center justify-center gap-2 "
            )}
            onClick={()=>{
              setIsLoading(true)
              signIn("google", {
                callbackUrl: callbackUrl || "/signup",
              }).catch(error => {
                console.error("Authentication error:", error)
                setIsLoading(false)
              })
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : (
              <Image
                src="/icons/google-logo.svg"
                alt="Google Logo"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            )}
            Sign in with Google
          </Button>
        </div>
      ) : isLoggedIn && !isEmailVerified ? (
        // Email Verification UI - Streamlined
        <div className="text-center w-full max-w-md">
          {/* User Info - Simplified */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 bg-muted/30 rounded-full px-3 py-1.5">
              <div className="h-5 w-5 rounded-full overflow-hidden border border-primary/20">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={20}
                    height={20}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    {session?.user?.name
                      ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : "U"}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeEmail}
                className="h-5 w-5 p-0 rounded-full"
                title="Change email"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-base font-medium mb-1">Verify Your Email</h3>
          <p className="text-slate-500 text-sm mb-4">Enter the verification code sent to your email</p>

          <div className="mb-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
              containerClassName="justify-center gap-1.5"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleVerifyEmail}
              disabled={otpValue.length !== 6}
              className="w-full mx-auto"
            >
              Verify Email
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={handleSendVerificationCode}
              className="text-xs mx-auto"
            >
              Resend code
            </Button>
          </div>
        </div>
      ) : (
        // Verification Success - Simplified
        <div className="text-center w-full max-w-md">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-base font-medium mb-1">Authentication Successful</h3>
          <p className="text-slate-500 text-sm mb-2">
            You have successfully verified your email
          </p>
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center gap-2 bg-muted/30 rounded-full px-3 py-1.5">
              <div className="h-5 w-5 rounded-full overflow-hidden border border-green-500/20">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={20}
                    height={20}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-green-500/10 flex items-center justify-center text-green-500 font-semibold text-xs">
                    {session?.user?.name
                      ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : "U"}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function GoogleSignInStepHeader() {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Image
        src="/icons/google-logo.svg"
        alt="Google Logo"
        width={16}
        height={16}
        className="h-4 w-4"
      />
      Sign In
    </motion.div>
  )
}

export function GoogleSignInStepDescription() {
  return (
    <motion.div
      key="step0-description"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      Sign in with your Google account to get started
    </motion.div>
  )
}
