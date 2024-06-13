import axiosClient from '../axiosClient';

export function  searchMeals({ commit }, keyword) {
  axiosClient.get(`search.php?s=${keyword}`)
    .then(({ data }) => {
      commit('setSearchedMeals', data.meals)
    })
}

export function searchMealsByLetter({ commit }, letter) {
  axiosClient.get(`search.php?f=${letter}`)
    .then(({ data }) => {
      commit('setMealsByLetter', data.meals)
    })
}

export function searchMealsByIngredient({ commit }, ing) {
  axiosClient.get(`filter.php?i=${ing}`)
    .then(({ data }) => {
      commit('setMealsByIngredients', data.meals)
    })
}

export function searchMealsByCategory({ commit }, cat) {
    axiosClient.get(`filter.php?c=${cat}`)
        .then(({ data }) => {
            commit('setMealsByCategories', data.meals)
        })
}

export async function searchMealsByArea({ commit }) {
    try {
        // Fetch the list of areas
        const { data } = await axiosClient.get('list.php?a=list');
        const areas = data.meals;

        // Define an array to store the recipes count by area
        const recipesByArea = [];

        // Iterate through the areas array
        for (const areaObj of areas) {
            const country = areaObj.strArea; // Access strArea property

            try {
                // Fetch recipes for the current area
                const response = await axiosClient.get(`filter.php?a=${country}`);
                // Store the number of meals for the current area in the array
                recipesByArea.push({
                    country,
                    meals: response.data.meals,
                });
            } catch (error) {
                // Handle errors for each area request
                console.error(`Error fetching data for ${country}:`, error);
            }
        }

        commit('setMealsByArea', recipesByArea)

    } catch (error) {
        // Handle errors for the initial areas fetch
        console.error('Error fetching areas:', error);
        return [];
    }
}