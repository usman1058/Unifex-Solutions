export const easeExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeExpo } },
}

export const stagger = {
  hidden: { opacity: 0 },
  visible: (staggerChildren = 0.12) => ({
    opacity: 1,
    transition: { staggerChildren },
  }),
}

export const hoverLift = {
  initial: { y: 0 },
  hover: { y: -6, transition: { duration: 0.35, ease: easeExpo } },
}

export const parallaxY = (distance: number) => ({
  initial: { y: 0 },
  animate: { y: [-distance, distance], transition: { duration: 10, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' } },
})

