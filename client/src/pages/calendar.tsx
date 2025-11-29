import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MealCard } from "@/components/meal-card";
import { AddMealDialog } from "@/components/add-meal-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Coffee,
  Sun,
  Moon,
  Cookie,
  UtensilsCrossed,
} from "lucide-react";
import type { Meal } from "@shared/schema";

const mealTypeConfig = {
  breakfast: { icon: Coffee, label: "Breakfast", color: "text-amber-500" },
  lunch: { icon: Sun, label: "Lunch", color: "text-emerald-500" },
  dinner: { icon: Moon, label: "Dinner", color: "text-blue-500" },
  snack: { icon: Cookie, label: "Snack", color: "text-purple-500" },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: monthMeals, isLoading: monthLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals", { 
      startDate: format(monthStart, "yyyy-MM-dd"),
      endDate: format(monthEnd, "yyyy-MM-dd")
    }],
  });

  const { data: selectedDayMeals, isLoading: dayLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals", { date: selectedDateStr }],
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

  const getMealsForDate = (date: Date) => {
    if (!monthMeals) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return monthMeals.filter((meal) => meal.date === dateStr);
  };

  const getCaloriesForDate = (date: Date) => {
    const meals = getMealsForDate(date);
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const groupMealsByType = (meals: Meal[]) => {
    const grouped: Record<string, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    meals.forEach((meal) => {
      grouped[meal.mealType].push(meal);
    });
    return grouped;
  };

  const groupedMeals = selectedDayMeals ? groupMealsByType(selectedDayMeals) : null;

  const today = new Date();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  return (
    <div className="flex flex-col lg:flex-row h-full" data-testid="page-calendar">
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Meal Calendar</h1>
          <AddMealDialog defaultDate={selectedDate} />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {paddingDays.map((_, index) => (
                <div key={`padding-${index}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const calories = getCaloriesForDate(day);
                const meals = getMealsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative aspect-square p-1 rounded-md transition-all
                      hover-elevate
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${isToday && !isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                      ${!isCurrentMonth ? "text-muted-foreground/50" : ""}
                    `}
                    data-testid={`button-calendar-day-${format(day, "yyyy-MM-dd")}`}
                  >
                    <span className="text-sm font-medium">{format(day, "d")}</span>
                    {meals.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {meals.length <= 3 ? (
                          meals.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1 rounded-full ${
                                isSelected ? "bg-primary-foreground" : "bg-primary"
                              }`}
                            />
                          ))
                        ) : (
                          <Badge
                            variant="secondary"
                            className={`h-4 px-1 text-[10px] ${
                              isSelected ? "bg-primary-foreground/20 text-primary-foreground" : ""
                            }`}
                          >
                            {meals.length}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-96 lg:border-l border-t lg:border-t-0 bg-muted/30 p-6 space-y-4 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {format(selectedDate, "EEEE")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
          </div>
          <AddMealDialog
            defaultDate={selectedDate}
            trigger={
              <Button size="icon" variant="outline" data-testid="button-add-meal-day">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </div>

        {dayLoading ? (
          <div className="space-y-4">
            {["breakfast", "lunch", "dinner", "snack"].map((type) => (
              <div key={type} className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : groupedMeals ? (
          <div className="space-y-4">
            {(Object.entries(mealTypeConfig) as [keyof typeof mealTypeConfig, typeof mealTypeConfig.breakfast][]).map(
              ([type, config]) => {
                const meals = groupedMeals[type];
                const IconComponent = config.icon;

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${config.color}`} />
                      <span className="text-sm font-medium">{config.label}</span>
                      {meals.length > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {meals.reduce((sum, m) => sum + m.calories, 0)} kcal
                        </Badge>
                      )}
                    </div>
                    {meals.length > 0 ? (
                      meals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          compact
                          onDelete={(id) => deleteMealMutation.mutate(id)}
                        />
                      ))
                    ) : (
                      <AddMealDialog
                        defaultDate={selectedDate}
                        defaultMealType={type}
                        trigger={
                          <button
                            className="w-full border border-dashed border-muted-foreground/30 rounded-md p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                            data-testid={`button-add-${type}`}
                          >
                            <Plus className="h-4 w-4 mx-auto mb-1" />
                            Add {config.label}
                          </button>
                        }
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No meals logged</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tap a meal type above to add one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
