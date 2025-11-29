import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthTipCard } from "@/components/health-tip-card";
import {
  Apple,
  Heart,
  Dumbbell,
  Brain,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import type { HealthTip } from "@shared/schema";

const categories = [
  { value: "all", label: "All Tips", icon: BookOpen },
  { value: "nutrition", label: "Nutrition", icon: Apple },
  { value: "wellness", label: "Wellness", icon: Heart },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "mindfulness", label: "Mindfulness", icon: Brain },
];

export default function TipsPage() {
  const { data: tips, isLoading } = useQuery<HealthTip[]>({
    queryKey: ["/api/tips"],
  });

  const { data: dailyTip } = useQuery<HealthTip>({
    queryKey: ["/api/tips/daily"],
  });

  return (
    <div className="p-6 space-y-6" data-testid="page-tips">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Health Tips & Insights</h1>
        <p className="text-muted-foreground">
          Educational content for your wellness journey
        </p>
      </div>

      {dailyTip && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Today's Tip</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-xl mb-2">{dailyTip.title}</h3>
            <p className="text-muted-foreground">{dailyTip.content}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="flex items-center gap-1.5"
                data-testid={`tab-${category.value}`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value} className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : tips && tips.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tips
                  .filter(
                    (tip) =>
                      category.value === "all" || tip.category === category.value
                  )
                  .map((tip) => (
                    <HealthTipCard key={tip.id} tip={tip} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tips available</h3>
                <p className="text-sm text-muted-foreground">
                  Check back soon for new health insights!
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-emerald-500" />
              Nutrition Facts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <span className="text-emerald-500 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Protein Power</h4>
                <p className="text-sm text-muted-foreground">
                  Aim for 0.8g of protein per kg of body weight daily for muscle maintenance and repair.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <span className="text-emerald-500 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Fiber Focus</h4>
                <p className="text-sm text-muted-foreground">
                  Include 25-30g of fiber daily through vegetables, fruits, and whole grains.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <span className="text-emerald-500 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Hydration Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Drink at least 8 glasses of water daily for optimal bodily functions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Filipino Superfoods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-rose-500 font-bold">M</span>
              </div>
              <div>
                <h4 className="font-medium">Malunggay (Moringa)</h4>
                <p className="text-sm text-muted-foreground">
                  Rich in vitamins A, C, and E, plus calcium and potassium. Great for immune support.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-rose-500 font-bold">K</span>
              </div>
              <div>
                <h4 className="font-medium">Kamote (Sweet Potato)</h4>
                <p className="text-sm text-muted-foreground">
                  High in fiber, beta-carotene, and complex carbs. A great rice alternative.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-rose-500 font-bold">T</span>
              </div>
              <div>
                <h4 className="font-medium">Talbos ng Kamote</h4>
                <p className="text-sm text-muted-foreground">
                  Sweet potato leaves are packed with antioxidants and vitamins. Often free or very cheap!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
