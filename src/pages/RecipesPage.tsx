import {useCallback, useEffect, useState} from 'react';
import {useCategories, useRecipes, useSearchRecipes} from "../hooks/useRecipes";
import debounce from 'lodash.debounce';
import SearchComponent from "../components/SearchComponent";
import {useNavigate} from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import {Recipe} from "../types/recipeTypes";

const RecipesPage = ({addToFavorites, removeFromFavorites, selectedRecipes}: {
    addToFavorites: (recipe: Recipe) => void;
    removeFromFavorites: (recipe: Recipe) => void;
    selectedRecipes: Recipe[];
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [localSelectedRecipes, setLocalSelectedRecipes] = useState<Recipe[]>(selectedRecipes);

    const navigate = useNavigate();
    const recipesPerPage = 9;

    const {data: searchResults, isLoading: isSearchLoading, error: searchError} = useSearchRecipes(searchQuery);
    const {data: allRecipes, isLoading: isAllRecipesLoading, error: allRecipesError} = useRecipes();
    const {data: categories, isLoading: isCategoriesLoading} = useCategories();

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setSearchQuery(query);
            setCurrentPage(1);
        }, 500),
        []
    );

    const recipesToDisplay = searchQuery.length === 0 ? allRecipes : searchResults;

    const filteredRecipes = recipesToDisplay?.filter((recipe: Recipe) => {
        const matchesCategory = categoryFilter ? recipe.strCategory === categoryFilter : true;
        return matchesCategory;
    }) || [];

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const handleAddToFavorites = (recipe: Recipe, event: React.MouseEvent) => {
        event.stopPropagation();
        addToFavorites(recipe);
        const updatedFavorites = [...localSelectedRecipes, recipe];
        setLocalSelectedRecipes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const handleRemoveFromFavorites = (recipe: Recipe, event: React.MouseEvent) => {
        event.stopPropagation();
        removeFromFavorites(recipe);
        const updatedFavorites = localSelectedRecipes.filter((item) => item.idMeal !== recipe.idMeal);
        setLocalSelectedRecipes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    useEffect(() => {
        if (searchQuery === '') {
            setCurrentPage(1);
        }
    }, [searchQuery]);

    if (isSearchLoading || isAllRecipesLoading || isCategoriesLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress size={60} color="primary"/>
            </div>
        );
    }

    if (searchError || allRecipesError) return <p className="text-red-500">Something went wrong...</p>;

    return (
        <div className="p-6 bg-gray-100 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Recipes</h1>

            <SearchComponent
                onSearch={(query: string) => debouncedSearch(query)}
                value={searchQuery}
                onClear={handleClearSearch}
            />

            <select
                value={categoryFilter}
                onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                }}
                className="mb-6 p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
                <option value="">All Categories</option>
                {categories?.map((category: any) => (
                    <option key={category.strCategory} value={category.strCategory}>
                        {category.strCategory}
                    </option>
                ))}
            </select>

            {filteredRecipes.length === 0 && !isSearchLoading && !isAllRecipesLoading && (
                <p className="text-gray-500 text-center">No recipes found for your search.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
                {currentRecipes.map((recipe: Recipe) => (
                    <div
                        key={recipe.idMeal}
                        className="border p-6 rounded-lg shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-50 cursor-pointer"
                        onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
                    >
                        <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="w-full h-48 object-cover rounded-lg mb-4 transition-all duration-200"
                        />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{recipe.strMeal}</h3>
                        <p className="text-gray-600 text-sm mb-4">{recipe.strCategory} - {recipe.strArea}</p>

                        <button
                            onClick={(event) =>
                                localSelectedRecipes.some((selected) => selected.idMeal === recipe.idMeal)
                                    ? handleRemoveFromFavorites(recipe, event)
                                    : handleAddToFavorites(recipe, event)
                            }
                            className={`mt-4 py-2 px-6 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out transform ${
                                localSelectedRecipes.some((selected) => selected.idMeal === recipe.idMeal)
                                    ? "bg-green-500 hover:bg-green-600 scale-105 shadow-lg"
                                    : "bg-blue-500 hover:bg-blue-600 scale-105 shadow-lg"
                            }`}
                        >
                            {localSelectedRecipes.some((selected) => selected.idMeal === recipe.idMeal)
                                ? "Added to Favorites"
                                : "Add to Favorites"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => paginate(value)}
                    showFirstButton
                    showLastButton
                    siblingCount={2}
                    boundaryCount={1}
                    className="pagination"
                />
            </div>
        </div>
    );
};

export default RecipesPage;
