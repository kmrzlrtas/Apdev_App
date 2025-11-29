import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Plus, Sparkles, CalendarIcon, Loader2 } from "lucide-react";
import type { AnalyzeMealResponse } from "@shared/schema";

const mealFormSchema = z.object({
  mealDescription: z.string().min(3, "Please describe your meal"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  date: z.date(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface AddMealDialogProps {
  defaultDate?: Date;
  defaultMealType?: "breakfast" | "lunch" | "dinner" | "snack";
  trigger?: React.ReactNode;
}

export function AddMealDialog({
  defaultDate,
  defaultMealType,
  trigger,
}: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState<AnalyzeMealResponse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      mealDescription: "",
      mealType: defaultMealType || "lunch",
      date: defaultDate || new Date(),
      time: format(new Date(), "HH:mm"),
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: { mealDescription: string; mealType: string }) => {
      const response = await apiRequest("POST", "/api/meals/analyze", data);
      return response as AnalyzeMealResponse;
    },
    onSuccess: (data) => {
      setAnalyzedMeal(data);
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMealMutation = useMutation({
    mutationFn: async (data: MealFormValues & AnalyzeMealResponse) => {
      return await apiRequest("POST", "/api/meals", {
        name: data.name,
        description: data.description,
        mealType: data.mealType,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
        fiber: data.fiber,
        sodium: data.sodium,
      });
    },
    onSuccess: () => {
      toast({
        title: "Meal Logged",
        description: "Your meal has been successfully added to your log.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meals/summary"] });
      setOpen(false);
      setAnalyzedMeal(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save your meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = async () => {
    const isValid = await form.trigger(["mealDescription", "mealType"]);
    if (isValid) {
      const values = form.getValues();
      analyzeMutation.mutate({
        mealDescription: values.mealDescription,
        mealType: values.mealType,
      });
    }
  };

  const handleSave = () => {
    if (analyzedMeal) {
      const values = form.getValues();
      saveMealMutation.mutate({
        ...values,
        ...analyzedMeal,
      });
    }
  };

  const resetDialog = () => {
    setAnalyzedMeal(null);
    form.reset({
      mealDescription: "",
      mealType: defaultMealType || "lunch",
      date: defaultDate || new Date(),
      time: format(new Date(), "HH:mm"),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-add-meal">
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {analyzedMeal ? "Review & Save Meal" : "Log Your Meal"}
          </DialogTitle>
        </DialogHeader>

        {!analyzedMeal ? (
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mealDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you eat?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., chicken adobo with rice, sinigang na baboy with vegetables..."
                        className="min-h-[100px] resize-none"
                        data-testid="input-meal-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-meal-type">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          data-testid="input-meal-time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            data-testid="button-meal-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                data-testid="button-analyze-meal"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Meal
                  </>
                )}
              </Button>
            </div>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-lg">{analyzedMeal.name}</h4>
                <p className="text-sm text-muted-foreground">{analyzedMeal.description}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-md bg-orange-500/10 p-2 text-center">
                  <p className="text-lg font-semibold">{analyzedMeal.calories}</p>
                  <p className="text-[10px] text-muted-foreground">kcal</p>
                </div>
                <div className="rounded-md bg-red-500/10 p-2 text-center">
                  <p className="text-lg font-semibold">{analyzedMeal.protein}g</p>
                  <p className="text-[10px] text-muted-foreground">protein</p>
                </div>
                <div className="rounded-md bg-amber-500/10 p-2 text-center">
                  <p className="text-lg font-semibold">{analyzedMeal.carbs}g</p>
                  <p className="text-[10px] text-muted-foreground">carbs</p>
                </div>
                <div className="rounded-md bg-blue-500/10 p-2 text-center">
                  <p className="text-lg font-semibold">{analyzedMeal.fats}g</p>
                  <p className="text-[10px] text-muted-foreground">fats</p>
                </div>
              </div>

              {analyzedMeal.healthInsight && (
                <div className="rounded-md bg-primary/10 p-3">
                  <p className="text-sm">
                    <span className="font-medium text-primary">Health Insight:</span>{" "}
                    {analyzedMeal.healthInsight}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAnalyzedMeal(null)}
                data-testid="button-edit-meal"
              >
                Edit
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={saveMealMutation.isPending}
                data-testid="button-save-meal"
              >
                {saveMealMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Meal"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
