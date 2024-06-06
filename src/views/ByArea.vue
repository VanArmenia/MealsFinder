<template>
  <div class="p-8 pb-0">
    <h1 class="text-4xl font-bold mb-4 text-orange-500">Map</h1>
  </div>
  <div class="px-8">
    <input
      type="text"
      v-model="keyword"
      class="rounded border-2 bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 mb-3 w-full"
      placeholder="Search in specific area"
    />
  </div>
  <Map :recipesByArea="recipesByArea" />
</template>
<script setup>

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axiosClient from "../axiosClient";
import store from "../store";
import Map from '../components/Map.vue'

const router = useRouter();
const keyword = ref("");
const areas = ref([]);
const recipesByArea = ref([]);
const markers = ref([]);

// Function to fetch areas and then recipes by area
const fetchAreasAndRecipes = async () => {
  try {
    // Fetch the list of areas
    const { data } = await axiosClient.get('list.php?a=list');
    const areas = data.meals;

    // Define an array to store the recipes count by area
    const recipesByArea = [];

    // Iterate through the areas array
    for (const areaObj of areas) {
      const area = areaObj.strArea; // Access strArea property

      try {
        // Fetch recipes for the current area
        const response = await axiosClient.get(`filter.php?a=${area}`);
        // Store the number of meals for the current area in the array
        recipesByArea.push({
          area,
          count: response.data.meals.length
        });
      } catch (error) {
        // Handle errors for each area request
        console.error(`Error fetching data for ${area}:`, error);
      }
    }

    // Return the array with the recipes count by area
    return recipesByArea;
  } catch (error) {
    // Handle errors for the initial areas fetch
    console.error('Error fetching areas:', error);
    return [];
  }
};

onMounted(async () => {
  recipesByArea.value = await fetchAreasAndRecipes();
});
</script>
