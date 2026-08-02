import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Carte à inclinaison 3D : suit la souris avec une perspective réelle,
// et flotte doucement au repos. Effet sobre et élégant (pas de kitsch).
export default function TiltCard({ children, className = '', max = 9, float = true }) {
  const ref = useRef(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const spring = { stiffness: 150, damping: 18, mass: 0.4 }
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), spring)

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const reset = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={float ? { y: [0, -12, 0] } : undefined}
        transition={float ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
