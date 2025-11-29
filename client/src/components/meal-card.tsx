import type { Meal } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Drumstick, Wheat, Droplets, Trash2 } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const mealTypeColors = {
  breakfast: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  lunch: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  dinner: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  snack: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const mealTypeLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function MealCard({ meal, onDelete, compact = false }: MealCardProps) {
  if (compact) {
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-card p-3 hover-elevate"
        data-testid={`meal-card-compact-${meal.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant="secondary" className={mealTypeColors[meal.mealType]}>
            {mealTypeLabels[meal.mealType]}
          </Badge>
          <div className="min-w-0">
            <p className="font-medium truncate">{meal.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{meal.time}</span>
              <span className="text-muted-foreground/50">|</span>
              <Flame className="h-3 w-3 text-orange-500" />
              <span>{meal.calories} kcal</span>
            </div>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(meal.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            data-testid={`button-delete-meal-${meal.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`meal-card-${meal.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={mealTypeColors[meal.mealType]}>
                {mealTypeLabels[meal.mealType]}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {meal.time}
              </span>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{meal.name}</h3>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(meal.id)}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              data-testid={`button-delete-meal-${meal.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded-md bg-orange-500/10 p-2">
            <Flame className="h-4 w-4 text-orange-500 mb-1" />
            <span className="text-sm font-semibold">{meal.calories}</span>
            <span className="text-[10px] text-muted-foreground">kcal</span>
          </div>
          <div className="flex flex-col items-center rounded-md bg-red-500/10 p-2">
            <Drumstick className="h-4 w-4 text-red-500 mb-1" />
            <span className="text-sm font-semibold">{meal.protein}g</span>
            <span className="text-[10px] text-muted-foreground">protein</span>
          </div>
          <div className="flex flex-col items-center rounded-md bg-amber-500/10 p-2">
            <Wheat className="h-4 w-4 text-amber-500 mb-1" />
            <span className="text-sm font-semibold">{meal.carbs}g</span>
            <span className="text-[10px] text-muted-foreground">carbs</span>
          </div>
          <div className="flex flex-col items-center rounded-md bg-blue-500/10 p-2">
            <Droplets className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-sm font-semibold">{meal.fats}g</span>
            <span className="text-[10px] text-muted-foreground">fats</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
