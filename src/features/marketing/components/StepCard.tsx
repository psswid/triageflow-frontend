interface StepCardProps {
  readonly step: number
  readonly title: string
  readonly description: string
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="relative pl-16">
      <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/25 ring-4 ring-white dark:ring-gray-950">
        {step}
      </div>
      <h2 className="text-xl font-semibold font-heading text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}
