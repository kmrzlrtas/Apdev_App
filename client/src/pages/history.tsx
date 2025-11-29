import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealCard } from "@/components/meal-card";
import { WeeklyTrendChart } from "@/components/nutrition-chart";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  UtensilsCrossed,
  Flame,
  Target,
} from "lucide-react";
import type { Meal, WeeklyTrend, DailySummary } from "@shared/schema";

export default function HistoryPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const startDate = period === "week" ? weekStart : monthStart;
  const endDate = period === "week" ? weekEnd : monthEnd;

  const { data: meals, isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals", { 
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd")
    }],
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<WeeklyTrend[]>({
    queryKey: ["/api/meals/trends", { period }],
  });

  const { data: todaySummary } = useQuery<DailySummary>({
    queryKey: ["/api/meals/summary", { date: format(today, "yyyy-MM-dd") }],
  });

  const { data: yesterdaySummary } = useQuery<DailySummary>({
    queryKey: ["/api/meals/summary", { date: format(subDays(today, 1), "yyyy-MM-dd") }],
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      await apiRequest("DELETE", `/api/meals/${mealId}`);
    },
    onSuccess: () => {
      toast({
        title: "Meal Deleted",
        description: "The meal has been removed from your log.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meals/summary"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not delete the meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const totalCalories = meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  const totalProtein = meals?.reduce((sum, meal) => sum + meal.protein, 0) || 0;
  const avgDailyCalories = Math.round(totalCalories / (period === "week" ? 7 : 30));

  const calorieDiff =
    todaySummary && yesterdaySummary
      ? todaySummary.totalCalories - yesterdaySummary.totalCalories
      : 0;

  const groupMealsByDate = (meals: Meal[]) => {
    const grouped: Record<string, Meal[]> = {};
    meals.forEach((meal) => {
      if (!grouped[meal.date]) {
        grouped[meal.date] = [];
      }
      grouped[meal.date].push(meal);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  const groupedMeals = meals ? groupMealsByDate(meals) : [];

  return (
    <div className="p-6 space-y-6" data-testid="page-history">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Meal History</h1>
          <p className="text-muted-foreground">
            Track your nutrition progress over time
          </p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
          <TabsList>
            <TabsTrigger value="week" data-testid="tab-week">This Week</TabsTrigger>
            <TabsTrigger value="month" data-testid="tab-month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-calories">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {period === "week" ? "this week" : "this month"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-daily">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailyCalories} kcal</div>
            <p className="text-xs text-muted-foreground">average per day</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-protein">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Protein</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProtein}g</div>
            <p className="text-xs text-muted-foreground">
              {period === "week" ? "this week" : "this month"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-daily-change">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Daily Change</CardTitle>
            {calorieDiff > 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : calorieDiff < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calorieDiff > 0 ? "+" : ""}
              {calorieDiff} kcal
            </div>
            <p className="text-xs text-muted-foreground">vs yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {trendsLoading ? (
          <>
            <Skeleton className="h-[280px]" />
            <Skeleton className="h-[280px]" />
          </>
        ) : trends && trends.length > 0 ? (
          <>
            <WeeklyTrendChart data={trends} metric="calories" />
            <WeeklyTrendChart data={trends} metric="protein" />
          </>
        ) : null}
      </div>

      <Card data-testid="card-meal-history">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Meal Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mealsLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : groupedMeals.length > 0 ? (
            <div className="space-y-6">
              {groupedMeals.map(([date, dateMeals]) => {
                const dayCalories = dateMeals.reduce((sum, m) => sum + m.calories, 0);
                return (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {format(new Date(date), "EEEE, MMMM d")}
                      </h3>
                      <Badge variant="secondary">
                        {dayCalories} kcal
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {dateMeals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          onDelete={(id) => deleteMealMutation.mutate(id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No meals logged yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start tracking your meals to see your history
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
