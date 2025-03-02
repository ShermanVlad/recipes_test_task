import { Link, Route, Routes } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage';
import RecipePage from './pages/RecipePage';
import SelectedRecipesPage from './pages/SelectedRecipesPage';
import { useState, useEffect } from 'react';
import {Recipe} from "./types/recipeTypes";

const App = () => {
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>(
        JSON.parse(localStorage.getItem('favorites') || '[]')
    );

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(selectedRecipes));
    }, [selectedRecipes]);

    const addToFavorites = (recipe: Recipe) => {
        setSelectedRecipes((prev) => [...prev, recipe]);
    };

    const removeFromFavorites = (recipe: Recipe) => {
        setSelectedRecipes((prev) => prev.filter((item) => item.idMeal !== recipe.idMeal));
    };

    return (
        <div className="App">
            <nav className="bg-gray-800 text-white p-4">
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/selected" className="mr-4">Favorites</Link>
            </nav>

            <Routes>
                <Route path="/" element={<RecipesPage addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} selectedRecipes={selectedRecipes}/>} />
                <Route path="/recipe/:id" element={<RecipePage addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} selectedRecipes={selectedRecipes}/>} />
                <Route path="/selected" element={<SelectedRecipesPage selectedRecipes={selectedRecipes} />} />
            </Routes>
        </div>
    );
};

export default App;
