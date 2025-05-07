"use client"

import { motion } from "framer-motion"

export function BackgroundEffects() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-1/3 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      ></motion.div>

      {/* Stars/dots */}
      {[
        { size: "h-2 w-2", opacity: "bg-primary/30", position: "top-[10%] left-[20%]", delay: 0.2 },
        { size: "h-1 w-1", opacity: "bg-primary/20", position: "top-[30%] left-[80%]", delay: 0.3 },
        { size: "h-1.5 w-1.5", opacity: "bg-primary/25", position: "top-[70%] left-[10%]", delay: 0.4 },
        { size: "h-1 w-1", opacity: "bg-primary/20", position: "top-[50%] left-[40%]", delay: 0.5 },
        { size: "h-2 w-2", opacity: "bg-primary/30", position: "top-[20%] left-[60%]", delay: 0.6 }
      ].map((dot, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{
            duration: 0.6,
            delay: dot.delay,
            scale: { duration: 0.8 }
          }}
          className={`absolute ${dot.size} rounded-full ${dot.opacity} ${dot.position} animate-pulse`}
        ></motion.div>
      ))}
    </div>
  )
}
