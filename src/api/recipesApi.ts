import axios from "axios";

const API_URL = "https://www.themealdb.com/api/json/v1/1/";

export const fetchAllRecipes = async () => {
    try {
        const allRecipes = [];
        for (let letter of "abcdefghijklmnopqrstuvwxyz") {
            const response = await axios.get(`${API_URL}search.php?f=${letter}`);
            if (response.data.meals) {
                allRecipes.push(...response.data.meals);
            }
        }
        return allRecipes;
    } catch (error) {
        console.error("Error fetching all recipes:", error);
        return [];
    }
};

export const fetchRecipesBySearch = async (searchQuery: string) => {
    try {
        const response = await axios.get(`${API_URL}search.php?s=${searchQuery}`);
        return response.data.meals;
    } catch (error) {
        console.error("Error fetching recipes by search query:", error);
        return null;
    }
};

export const fetchRecipeById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}lookup.php?i=${id}`);
        return response.data.meals ? response.data.meals[0] : null;
    } catch (error) {
        console.error(`Error fetching recipe with ID ${id}:`, error);
        return null;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}categories.php`);
        return response.data.categories || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
