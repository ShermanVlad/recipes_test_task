import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes, fetchRecipeById, fetchCategories, fetchRecipesBySearch } from "../api/recipesApi";

export const useRecipes = () => useQuery({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes
});

export const useSearchRecipes = (searchQuery: string) => {
    return useQuery({
        queryKey: ["recipes", searchQuery],
        queryFn: () => fetchRecipesBySearch(searchQuery),
        enabled: searchQuery.length > 0
    });
};

export const useRecipe = (id: string) => useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id)
});

export const useCategories = () => useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
});
