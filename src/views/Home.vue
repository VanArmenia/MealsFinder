<template>
  <div class="p-8 pb-0 text-orange-500">
    <h1 class="text-4xl font-bold mb-4">Random Meals</h1>
  </div>
  <Meals :meals="meals" />
  <div class="p-8 pb-0">
    <h1 class="text-4xl font-bold mb-4 text-orange-500">Categories</h1>
  </div>
  <div class="px-8">
    <input
        type="text"
        v-model="keyword"
        class="rounded border-2 bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500 mb-3 w-full"
        placeholder="Search for Ingredients"
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <a href="#"
         @click.prevent="openCategory(category)"
         v-for="category of computedCategories"
         :key="category.strCategory"
         class="block bg-white rounded p-3 mb-3 shadow"
      >
        <h3 class="text-2xl font-bold mb-2">{{ category.strCategory }}</h3>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import store from "../store";
import Meals from "../components/Meals.vue";
import axiosClient from "../axiosClient.js";
import {useRouter} from "vue-router";

const router = useRouter();
const meals = ref([]);
const keyword = ref("");
const categories = ref([]);
const computedCategories = computed(() => {
  return categories.value.filter((i) =>
      i.strCategory.toLowerCase().includes(keyword.value.toLowerCase())
  );
});

function openCategory(category) {
  store.commit('setCategory', category)
  router.push({
    name: "byCategory",
    params: { category: category.strCategory },
  });
}

onMounted(async () => {
  for (let i = 0; i < 6; i++) {
    axiosClient
      .get(`random.php`)
      .then(({ data }) => meals.value.push(data.meals[0]));
  }
  axiosClient.get("list.php?c=list").then(({ data }) => {
    categories.value = data.meals;
  });
});
</script>
