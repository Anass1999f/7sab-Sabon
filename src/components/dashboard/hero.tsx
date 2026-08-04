"use client"

import { motion } from "framer-motion"
import { getGreeting } from "@/src/lib/utils"
import { USER_NAME } from "@/src/lib/constants"

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <h1 className="text-4xl font-bold tracking-tight">
        {getGreeting()}, {USER_NAME.split(" ")[0]} 👋
      </h1>
      <p className="text-muted-foreground mt-2">
        Track your goals and savings progress
      </p>
    </motion.div>
  )
}
