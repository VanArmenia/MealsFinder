<template>
  <div class="p-2">
    <input
      type="text"
      v-model="keyword"
      class="rounded border-2 bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 w-full md:w-1/4 mx-auto float-right block w-full md:w-1/4"
      placeholder="Search in specific area"
    />
  </div>
  <Map v-if="Map" :recipesByArea="recipesByArea" />
  <div v-else class="">
    <img src="@/assets/loading.gif" class="w-1/4 mt-6 md:mt-16 mx-auto p-4 max-w-24">
  </div>
</template>
<script setup>

import {onMounted, ref, shallowRef} from "vue";
import {computed} from "@vue/reactivity";
import {useRouter} from "vue-router";
import store from "@/store/index.js";

const router = useRouter();
const keyword = ref("");
const Map = shallowRef(null);
const recipesByArea = computed(() => store.state.mealsByArea)

const loadComponent = async () => {
  try {
    if (!recipesByArea.value || recipesByArea.value.length === 0) {
      await store.dispatch('searchMealsByArea');
    }

    // Dynamically import the component
    const loadedComponent = await import('../components/Map.vue');
    Map.value =  loadedComponent.default
  } catch (error) {
    console.error('Error loading component or fetching data:', error);
  }
};

onMounted(async () => {
  await loadComponent();
});
</script>
