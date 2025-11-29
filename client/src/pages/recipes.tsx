import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCard } from "@/components/recipe-card";
import { Search, Filter, Coins, Clock, ChefHat } from "lucide-react";
import type { Recipe } from "@shared/schema";

const filterTags = [
  "All",
  "Budget-Friendly",
  "Quick & Easy",
  "High Protein",
  "Low Carb",
  "Vegetarian",
  "Traditional",
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = recipes?.filter((recipe) => {
    const matchesSearch =
      searchQuery === "" ||
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((i) =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Budget-Friendly" && recipe.isBudgetFriendly) ||
      (activeFilter === "Quick & Easy" &&
        recipe.prepTime + recipe.cookTime <= 30) ||
      recipe.tags.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6" data-testid="page-recipes">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Filipino Recipes</h1>
          <p className="text-muted-foreground">
            Affordable and nutritious meal ideas with local ingredients
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-recipe-search"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeFilter === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveFilter(tag)}
              data-testid={`filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tag === "Budget-Friendly" && <Coins className="h-3 w-3 mr-1" />}
              {tag === "Quick & Easy" && <Clock className="h-3 w-3 mr-1" />}
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredRecipes && filteredRecipes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ChefHat className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {searchQuery || activeFilter !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Check back soon for new recipe ideas!"}
          </p>
          {(searchQuery || activeFilter !== "All") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
