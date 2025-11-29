import type { HealthTip } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Apple,
  Heart,
  Dumbbell,
  Brain,
  Lightbulb,
} from "lucide-react";

interface HealthTipCardProps {
  tip: HealthTip;
  variant?: "default" | "banner";
}

const categoryConfig = {
  nutrition: {
    icon: Apple,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    label: "Nutrition",
  },
  wellness: {
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    label: "Wellness",
  },
  fitness: {
    icon: Dumbbell,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    label: "Fitness",
  },
  mindfulness: {
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    label: "Mindfulness",
  },
};

export function HealthTipCard({ tip, variant = "default" }: HealthTipCardProps) {
  const config = categoryConfig[tip.category];
  const IconComponent = config.icon;

  if (variant === "banner") {
    return (
      <div
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4"
        data-testid={`health-tip-banner-${tip.id}`}
      >
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-2 ${config.bg}`}>
            <Lightbulb className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className={config.bg}>
                <IconComponent className={`h-3 w-3 mr-1 ${config.color}`} />
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">Daily Tip</span>
            </div>
            <h3 className="font-semibold mb-1">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover-elevate" data-testid={`health-tip-card-${tip.id}`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${config.bg} shrink-0`}>
            <IconComponent className={`h-4 w-4 ${config.color}`} />
          </div>
          <div className="min-w-0">
            <Badge variant="secondary" className={`mb-2 ${config.bg}`}>
              {config.label}
            </Badge>
            <h3 className="font-medium mb-1">{tip.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{tip.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
