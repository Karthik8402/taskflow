interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  label?: string
  subtitle?: string
}

export function ProgressRing({
  percentage,
  size = 140,
  strokeWidth = 12,
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
          className="text-gray-200 dark:text-gray-800"
          fill="transparent"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
            {label}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
          {subtitle}
        </span>
      )}
    </div>
  )
}
