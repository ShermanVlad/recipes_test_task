import {useParams} from "react-router-dom";
import {useRecipe} from "../hooks/useRecipes";
import {useState, useEffect} from "react";
import {Recipe} from "../types/recipeTypes";

const RecipePage = ({addToFavorites, removeFromFavorites, selectedRecipes}: {
    addToFavorites: (recipe: Recipe) => void;
    removeFromFavorites: (recipe: Recipe) => void;
    selectedRecipes: Recipe[];
}) => {
    const {id} = useParams<{ id: string }>();
    const {data: recipe, isLoading, error} = useRecipe(id || "");

    const [favorites, setFavorites] = useState<Recipe[]>(selectedRecipes);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    if (isLoading) return <p className="text-center text-xl font-semibold">Loading...</p>;
    if (error || !recipe) return <p className="text-center text-xl font-semibold text-red-500">Recipe not found</p>;

    const isFavorite = favorites.some((item) => item.idMeal === recipe.idMeal);

    const handleAddToFavorites = (recipe: Recipe) => {
        setFavorites((prevState) => {
            const updatedFavorites = [...prevState, recipe];
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
        addToFavorites(recipe);
    };

    const handleRemoveFromFavorites = (recipe: Recipe) => {
        setFavorites((prevState) => {
            const updatedFavorites = prevState.filter((item) => item.idMeal !== recipe.idMeal);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
        removeFromFavorites(recipe);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img src={recipe.strMealThumb} alt={recipe.strMeal}
                     className="w-full md:w-1/2 rounded-xl shadow-lg mb-6 md:mb-0"/>
                <div className="flex flex-col md:w-1/2">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{recipe.strMeal}</h2>
                    <p className="text-xl text-gray-600 mb-2"><b>Category:</b> {recipe.strCategory}</p>
                    <p className="text-xl text-gray-600 mb-2"><b>Area:</b> {recipe.strArea}</p>
                    <p className="text-xl text-gray-600 mb-2"><b>Tags:</b> {recipe.strTags}</p>

                    <div className="text-lg mb-6">
                        <b className="block mb-2">Ingredients:</b>
                        <ul className="list-disc pl-5 text-md text-gray-700">
                            {Array.from({length: 20}).map((_, index) => {
                                const ingredient = recipe[`strIngredient${index + 1}`];
                                const measure = recipe[`strMeasure${index + 1}`];
                                return ingredient && (
                                    <li key={index} className="mb-2">
                                        <span className="font-semibold">{measure} {ingredient}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => isFavorite ? handleRemoveFromFavorites(recipe) : handleAddToFavorites(recipe)}
                            className={` py-2 px-6 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out transform 
                            ${isFavorite ? 'bg-green-500 hover:bg-green-600 scale-105 shadow-lg' 
                                : 'bg-blue-500 hover:bg-blue-600 scale-105 shadow-lg'}`}
                        >
                            {isFavorite ? "Added to Favorites"
                                : "Add to Favorites"}
                        </button>
                        {recipe.strYoutube && (
                            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                                <span>Watch Recipe Video</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M6.943 2.397a1 1 0 0 1 1.314-.086l6 4.5a1 1 0 0 1 0 1.672l-6 4.5a1 1 0 0 1-1.528-.842v-3.78l-3.893 2.92a1 1 0 0 1-1.528-.842V5.157a1 1 0 0 1 1.528-.842L8.94 7.738V4.12a1 1 0 0 1 .003-.857z"/>
                                </svg>
                            </a>
                        )}
                    </div>

                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h3>
                <p className="whitespace-pre-wrap text-lg text-gray-700">{recipe.strInstructions}</p>
            </div>
        </div>
    );
};

export default RecipePage;
