import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../types/recipeTypes";

const SelectedRecipesPage = ({ selectedRecipes }: { selectedRecipes: Recipe[] }) => {
    const [storedRecipes, setStoredRecipes] = useState<any[]>(selectedRecipes);

    useEffect(() => {
        localStorage.setItem("selectedRecipes", JSON.stringify(storedRecipes));
    }, [storedRecipes]);

    const normalizeIngredientName = (ingredient: string) => {
        return ingredient.toLowerCase().replace(/\s+/g, ' ').trim();
    };

    const getIngredients = () => {
        const ingredients: { [key: string]: boolean } = {};

        storedRecipes.forEach((recipe) => {
            Object.keys(recipe).forEach((key) => {
                if (key.includes('strIngredient') && recipe[key]) {
                    let ingredient = recipe[key];
                    ingredient = normalizeIngredientName(ingredient);
                    ingredients[ingredient] = true;
                }
            });
        });

        return ingredients;
    };

    useEffect(() => {
        const recipesFromStorage = JSON.parse(localStorage.getItem("selectedRecipes") || "[]");
        setStoredRecipes(recipesFromStorage);
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-center">Selected Recipes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {storedRecipes.map((recipe, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-200 ease-in-out">
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover rounded-md mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.strMeal}</h3>
                        <p className="text-gray-500 mb-3">{recipe.strCategory} - {recipe.strArea}</p>
                        <Link to={`/recipe/${recipe.idMeal}`} className="text-blue-500 hover:underline text-sm">View Recipe Details</Link>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold">Preparation Instructions:</h4>
                            <p className="text-gray-700">{recipe.strInstructions}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Ingredients for All Selected Recipes:</h2>
                <ul className="list-disc pl-6 text-lg text-gray-700">
                    {Object.keys(getIngredients()).map((ingredient, index) => (
                        <li key={index} className="text-gray-900">{ingredient}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelectedRecipesPage;
