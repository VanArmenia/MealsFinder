<template>
  <div class="p-8 pb-0">
    <h1 class="text-4xl font-bold mb-4 text-orange-500">Meals for {{ category.strCategory }}</h1>
  </div>

  <Meals :meals="meals" />
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import Meals from '../components/Meals.vue'

const route = useRoute();
const category = computed(() => store.state.category)
const meals = computed(() => store.state.mealsByCategory)

onMounted(() => {
  store.dispatch('searchMealsByCategory', route.params.category)
})

</script>
