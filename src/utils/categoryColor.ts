export const CATEGORY_COLORS: Record<string, string> = {
  'Compensation & Benefits': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Attendance & Leave': 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Payroll: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  'Employee Relations': 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  'Harassment & Misconduct': 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  'Performance Management': 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'Career & Development': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  'Recruitment & Onboarding': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  'HR Policies': 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  'Facilities & Administration': 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  'IT & HR Systems': 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  'Medical & Insurance': 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  'Safety, Health & Environment (SHE)': 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  'Welfare & Engagement': 'bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300',
  'Compliance & Ethics': 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  'Separation & Exit': 'bg-stone-100 text-stone-700 dark:bg-stone-500/15 dark:text-stone-300',
  'Suggestion / Improvement': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  'Housing / Quarters': 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
  Security: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  Transport: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300',
  Electrical: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  Mechanical: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  Civil: 'bg-stone-200 text-stone-800 dark:bg-stone-500/20 dark:text-stone-300',
  Purchase: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  Others: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
}

export function getCategoryColorClasses(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Others
}

export const CHART_PALETTE = [
  'bg-brand-600 dark:bg-brand-400',
  'bg-accent-orange dark:bg-orange-400',
  'bg-emerald-500 dark:bg-emerald-400',
  'bg-sky-500 dark:bg-sky-400',
  'bg-violet-500 dark:bg-violet-400',
  'bg-amber-500 dark:bg-amber-400',
  'bg-rose-500 dark:bg-rose-400',
  'bg-teal-500 dark:bg-teal-400',
]
