interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  gradientId?: string
  label?: string
  subtitle?: string
}

export function ProgressRing({
  percentage,
  size = 130,
  strokeWidth = 10,
  gradientId = 'progressGradient',
  label,
  subtitle,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800"
          fill="transparent"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {label}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {subtitle}
        </span>
      )}
    </div>
  )
}
