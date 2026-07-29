import { getCategoryColorClasses } from '../utils/categoryColor'

export default function CategoryChip({ category }: { category: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColorClasses(category)}`}>
      {category}
    </span>
  )
}
