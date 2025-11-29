import type { Recipe } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Flame,
  Coins,
  ChefHat,
  UtensilsCrossed,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecipeCardProps {
  recipe: Recipe;
  onAddToMeal?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onAddToMeal }: RecipeCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer overflow-hidden hover-elevate group" data-testid={`recipe-card-${recipe.id}`}>
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-primary/30" />
            </div>
            {recipe.isBudgetFriendly && (
              <Badge className="absolute top-2 right-2 bg-emerald-500 text-white">
                <Coins className="h-3 w-3 mr-1" />
                Budget-Friendly
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="h-4 w-4" />
                <span>{recipe.calories} kcal</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Prep: {recipe.prepTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <span>Cook: {recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span>{recipe.costEstimate}</span>
              </div>
            </div>

            <p className="text-muted-foreground">{recipe.description}</p>

            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-md bg-orange-500/10 p-3 text-center">
                <p className="text-lg font-semibold">{recipe.calories}</p>
                <p className="text-xs text-muted-foreground">calories</p>
              </div>
              <div className="rounded-md bg-red-500/10 p-3 text-center">
                <p className="text-lg font-semibold">{recipe.protein}g</p>
                <p className="text-xs text-muted-foreground">protein</p>
              </div>
              <div className="rounded-md bg-amber-500/10 p-3 text-center">
                <p className="text-lg font-semibold">{recipe.carbs}g</p>
                <p className="text-xs text-muted-foreground">carbs</p>
              </div>
              <div className="rounded-md bg-blue-500/10 p-3 text-center">
                <p className="text-lg font-semibold">{recipe.fats}g</p>
                <p className="text-xs text-muted-foreground">fats</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Ingredients</h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Instructions</h4>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {onAddToMeal && (
              <Button
                className="w-full"
                onClick={() => onAddToMeal(recipe)}
                data-testid={`button-add-recipe-${recipe.id}`}
              >
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Add to Meal Log
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
