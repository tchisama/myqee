"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function SignupHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          stiffness: 200
        }}
        className="mb-4 h-20 w-auto"
      >
        <Image
          src="/qee-nano.png"
          alt="QEE Logo"
          width={400}
          height={200}
          className="h-full w-auto object-contain drop-shadow-md"
          priority
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-2 text-base text-slate-600"
      >
        Create your account to get started
      </motion.p>
    </motion.div>
  )
}
