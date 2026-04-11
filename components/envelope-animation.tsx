"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EnvelopeAnimationProps {
  guestName: string
  onOpen: () => void
}

export function EnvelopeAnimation({ guestName, onOpen }: EnvelopeAnimationProps) {
  const [isOpening, setIsOpening] = useState(false)

  const handleOpen = () => {
    if (isOpening) return
    setIsOpening(true)
    // Trigger onOpen after the animation completes
    setTimeout(onOpen, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      {/* Decorative corner flourishes */}
      <div className="absolute top-8 left-8 text-primary/20 text-6xl font-serif select-none">&#10087;</div>
      <div className="absolute top-8 right-8 text-primary/20 text-6xl font-serif select-none scale-x-[-1]">&#10087;</div>
      <div className="absolute bottom-8 left-8 text-primary/20 text-6xl font-serif select-none scale-y-[-1]">&#10087;</div>
      <div className="absolute bottom-8 right-8 text-primary/20 text-6xl font-serif select-none scale-[-1]">&#10087;</div>

      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Envelope body */}
        <motion.div
          className="relative w-[340px] h-[240px] sm:w-[420px] sm:h-[300px] cursor-pointer"
          onClick={handleOpen}
          animate={isOpening ? { y: 100, opacity: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.5, ease: "easeIn" }}
        >
          {/* Envelope back */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/80 to-primary shadow-2xl" />

          {/* Envelope inner (visible when flap opens) */}
          <div className="absolute inset-x-2 top-2 bottom-0 rounded-t-lg bg-secondary/50" />

          {/* Card peeking out */}
          <AnimatePresence>
            {isOpening && (
              <motion.div
                className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-md shadow-md flex flex-col items-center justify-center p-6"
                initial={{ y: 0 }}
                animate={{ y: -280 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-serif text-lg sm:text-xl text-primary/60 tracking-widest uppercase">
                  You&apos;re Invited
                </p>
                <p className="font-serif text-2xl sm:text-3xl text-foreground mt-2">
                  Jackson & Audrey
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope front bottom flap */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] rounded-b-lg bg-gradient-to-t from-primary to-primary/90 shadow-inner" />

          {/* Envelope front left triangle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            style={{
              background: "linear-gradient(to bottom right, transparent 49.5%, hsl(var(--primary) / 0.85) 50%)",
            }}
          />

          {/* Envelope front right triangle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            style={{
              background: "linear-gradient(to bottom left, transparent 49.5%, hsl(var(--primary) / 0.85) 50%)",
            }}
          />

          {/* Envelope flap (top triangle) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[50%] origin-top"
            style={{ transformStyle: "preserve-3d" }}
            animate={isOpening ? { rotateX: 180 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-0 rounded-t-lg"
              style={{
                background: "linear-gradient(to bottom, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.9) 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
            {/* Back of the flap (seen when it opens) */}
            <div
              className="absolute inset-0 rounded-t-lg"
              style={{
                background: "hsl(var(--secondary) / 0.8)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>

          {/* Wax seal */}
          <motion.div
            className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10"
            animate={
              isOpening
                ? { scale: 0, opacity: 0 }
                : {
                    scale: [1, 1.05, 1],
                  }
            }
            transition={
              isOpening
                ? { duration: 0.3, ease: "easeIn" }
                : {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-lg flex items-center justify-center border-2 border-accent/60">
              <span className="font-serif text-white text-lg sm:text-xl font-light tracking-wider">
                J&A
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Guest name and hint */}
        <motion.div
          className="text-center mt-8"
          animate={isOpening ? { opacity: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <p className="font-serif text-lg text-muted-foreground">
            For <span className="text-foreground font-medium">{guestName}</span>
          </p>
          <motion.p
            className="text-sm text-muted-foreground/60 mt-3"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Tap to open
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
