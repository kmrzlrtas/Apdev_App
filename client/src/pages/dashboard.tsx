import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NutritionRing } from "@/components/nutrition-ring";
import { MealCard } from "@/components/meal-card";
import { HealthTipCard } from "@/components/health-tip-card";
import { MacroDistributionChart, WeeklyTrendChart } from "@/components/nutrition-chart";
import { AddMealDialog } from "@/components/add-meal-dialog";
import { Flame, Target, TrendingUp, UtensilsCrossed } from "lucide-react";
import type { Meal, HealthTip, DailySummary, WeeklyTrend } from "@shared/schema";

const DAILY_GOALS = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fats: 65,
};

export default function Dashboard() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayMeals, isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals", { date: today }],
  });

  const { data: dailySummary, isLoading: summaryLoading } = useQuery<DailySummary>({
    queryKey: ["/api/meals/summary", { date: today }],
  });

  const { data: weeklyTrends, isLoading: trendsLoading } = useQuery<WeeklyTrend[]>({
    queryKey: ["/api/meals/trends"],
  });

  const { data: dailyTip, isLoading: tipLoading } = useQuery<HealthTip>({
    queryKey: ["/api/tips/daily"],
  });

  const summary = dailySummary || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    mealCount: 0,
  };

  return (
    <div className="space-y-6 p-6" data-testid="page-dashboard">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <AddMealDialog />
      </div>

      {tipLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : dailyTip ? (
        <HealthTipCard tip={dailyTip} variant="banner" />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-calories-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary.totalCalories}</div>
                <p className="text-xs text-muted-foreground">
                  of {DAILY_GOALS.calories} kcal goal
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((summary.totalCalories / DAILY_GOALS.calories) * 100, 100)}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-protein-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary.totalProtein}g</div>
                <p className="text-xs text-muted-foreground">
                  of {DAILY_GOALS.protein}g goal
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((summary.totalProtein / DAILY_GOALS.protein) * 100, 100)}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-carbs-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary.totalCarbs}g</div>
                <p className="text-xs text-muted-foreground">
                  of {DAILY_GOALS.carbs}g goal
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((summary.totalCarbs / DAILY_GOALS.carbs) * 100, 100)}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-fats-summary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Fats</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary.totalFats}g</div>
                <p className="text-xs text-muted-foreground">
                  of {DAILY_GOALS.fats}g goal
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${Math.min((summary.totalFats / DAILY_GOALS.fats) * 100, 100)}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-nutrition-rings">
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-around gap-4">
                <NutritionRing
                  value={summary.totalCalories}
                  max={DAILY_GOALS.calories}
                  label="kcal"
                  color="hsl(var(--chart-1))"
                  size="lg"
                />
                <NutritionRing
                  value={summary.totalProtein}
                  max={DAILY_GOALS.protein}
                  label="protein"
                  color="hsl(var(--chart-2))"
                />
                <NutritionRing
                  value={summary.totalCarbs}
                  max={DAILY_GOALS.carbs}
                  label="carbs"
                  color="hsl(var(--chart-3))"
                />
                <NutritionRing
                  value={summary.totalFats}
                  max={DAILY_GOALS.fats}
                  label="fats"
                  color="hsl(var(--chart-4))"
                />
              </div>
            </CardContent>
          </Card>

          {trendsLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : weeklyTrends && weeklyTrends.length > 0 ? (
            <WeeklyTrendChart data={weeklyTrends} metric="calories" />
          ) : null}
        </div>

        <div className="space-y-6">
          <MacroDistributionChart
            protein={summary.totalProtein}
            carbs={summary.totalCarbs}
            fats={summary.totalFats}
          />

          <Card data-testid="card-today-meals">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
              <CardTitle className="text-lg">Today's Meals</CardTitle>
              <span className="text-sm text-muted-foreground">
                {summary.mealCount} meals
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {mealsLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : todayMeals && todayMeals.length > 0 ? (
                todayMeals.slice(0, 4).map((meal) => (
                  <MealCard key={meal.id} meal={meal} compact />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No meals logged today</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start tracking your nutrition!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
