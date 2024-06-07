<template>
  <div class="px-8">
    <input
      type="text"
      v-model="keyword"
      class="rounded border-2 bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 mb-3 w-full"
      placeholder="Search in specific area"
    />
  </div>
  <Map v-if="Map" :recipesByArea="recipesByArea" />
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
