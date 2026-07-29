// Placeholder brand mark until the official Dalmia Cement (Bharat) Limited
// logo file is provided — swap the rendered content here once available.

const SIZES = {
  sm: 'h-8 w-8 rounded-lg text-sm',
  md: 'h-12 w-12 rounded-xl text-lg',
  lg: 'h-16 w-16 rounded-xl text-2xl',
} as const

const VARIANTS = {
  brand: 'bg-brand-600',
  admin: 'bg-accent-orange',
} as const

export default function Logo({
  size = 'sm',
  variant = 'brand',
}: {
  size?: keyof typeof SIZES
  variant?: keyof typeof VARIANTS
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold text-white ${SIZES[size]} ${VARIANTS[variant]}`}
    >
      D
    </div>
  )
}
