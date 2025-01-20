import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'f71447ab509a4e3bbae6171487a344a8';
const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const RECIPE_DETAIL_URL = 'https://api.spoonacular.com/recipes';

// Define types for the slice state
interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

interface RecipeDetail {
    id: number;
    title: string;
    image: string;
    ingredients: Ingredient[];
    instructions: string;
}

interface Recipe {
    id: number;
    title: string;
    image: string;
}

interface RecipesState {
    recipes: { [query: string]: Recipe[] }; // Cache recipes by query
    selectedRecipe: RecipeDetail | null; // Store selected recipe detail
    viewedRecipes: Recipe[]; // Store viewed recipes list
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: RecipesState = {
    recipes: {},
    selectedRecipe: null,
    viewedRecipes: [], // Initialize empty list for viewed recipes
    status: 'idle',
    error: null,
};

// Fetch recipes from the API
export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async (query: string, { getState, rejectWithValue }) => {
        const state = getState() as { recipes: RecipesState };
        console.log("checking the query", query, state.recipes.recipes[query])

        // Check if recipes for the query are already cached
        if (state.recipes.recipes[query]) {
            return { query, recipes: state.recipes.recipes[query] };
        }

        try {
            const response = await axios.get(`${API_URL}?query=${query}&&apiKey=${API_KEY}`);
            console.log("checking responses of query", response.data.results)
            const recipes = response.data.results.map((recipe: any) => ({
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
            }));

            return { query, recipes };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
        }
    }
);

// Fetch detailed recipe information
export const fetchRecipeDetailsById = createAsyncThunk(
    'recipes/fetchRecipeDetailsById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RECIPE_DETAIL_URL}/${id}/information?apiKey=${API_KEY}`);
            const recipeDetail = response.data;

            const ingredients = recipeDetail.extendedIngredients.map((ingredient: any) => ({
                id: ingredient.id,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
            }));

            return {
                id: recipeDetail.id,
                title: recipeDetail.title,
                image: recipeDetail.image,
                ingredients,
                instructions: recipeDetail.instructions,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe details');
        }
    }
);

// Recipes slice
const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        selectRecipe: (state: any, action: PayloadAction<Recipe>) => {
            // Save selected recipe in the store
            state.selectedRecipe = action.payload;
        },
        addViewedRecipe: (state, action: PayloadAction<Recipe>) => {
            if (!Array.isArray(state.viewedRecipes)) {
                state.viewedRecipes = []; // Default to empty array if undefined
            }
            // Add recipe to viewedRecipes if it's not already there
            const exists = state.viewedRecipes.some((recipe) => recipe.id === action.payload.id);
            if (!exists) {
                state.viewedRecipes.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchRecipes.fulfilled,
                (state, action: PayloadAction<{ query: string; recipes: Recipe[] }>) => {
                    state.status = 'succeeded';
                    state.recipes[action.payload.query] = action.payload.recipes;
                }
            )
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'An error occurred';
            })
            .addCase(fetchRecipeDetailsById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchRecipeDetailsById.fulfilled,
                (state, action: PayloadAction<RecipeDetail>) => {
                    state.status = 'succeeded';
                    state.selectedRecipe = action.payload;
                }
            )
            .addCase(fetchRecipeDetailsById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'An error occurred';
            });
    },
});

export const { selectRecipe, addViewedRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
