interface NutritionRingProps {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function NutritionRing({
  value,
  max,
  label,
  color,
  size = "md",
}: NutritionRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const radius = size === "sm" ? 30 : size === "md" ? 45 : 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const viewBoxSize = (radius + strokeWidth) * 2;

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const labelSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={`relative ${sizeClasses[size]}`} data-testid={`nutrition-ring-${label.toLowerCase()}`}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-semibold ${textSizes[size]}`}>{Math.round(value)}</span>
        <span className={`text-muted-foreground ${labelSizes[size]}`}>{label}</span>
      </div>
    </div>
  );
}
