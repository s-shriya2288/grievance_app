const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
} as const

export default function Logo({ size = 'sm' }: { size?: keyof typeof SIZES }) {
  return (
    <img
      src="/brand/dalmia-icon.png"
      alt="Dalmia Bharat"
      className={`shrink-0 object-contain ${SIZES[size]}`}
    />
  )
}
