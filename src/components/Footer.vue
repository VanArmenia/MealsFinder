<script setup>
// import {onMounted, onUnmounted, ref} from 'vue';
// import axiosClient from "@/axiosClient.js";

</script>
<template>
  <footer class="pt-2 bg-blue-600 text-white pb-4 mt-6">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <!-- Content aligned to the left -->
      <div class="w-full md:w-1/4 md:w-auto mb-4 md:mb-0 text-center">
        <router-link
            :to="{ name: 'home' }"
            class="inline-flex items-center h-full text-orange-200 font-bold p-2"
        >
          <img src="@/assets/logo.png" class="w-1/2 md:w-2/5 my-0 mx-auto p-2">
        </router-link>
        <p class="">&copy; 2024 FoodieBliss. All rights reserved.</p>
      </div>

      <!-- Content aligned to the center -->
      <div class="w-full md:w-auto mb-4 md:mb-0">
        <div class="flex p-2 justify-between">
          <router-link
              :to="{ name: 'home' }"
              class="inline-flex items-center h-full text-orange-200 font-bold p-2"
          >
            Home
          </router-link>
          <router-link
              :to="{ name: 'byName' }"
              class="inline-flex items-center h-full text-orange-200 font-bold p-2"
          >
            Search
          </router-link>
          <router-link
              :to="{ name: 'ingredients' }"
              class="inline-flex items-center h-full text-orange-200 font-bold p-2"
          >
            Ingredients
          </router-link>
          <router-link
              :to="{ name: 'categories' }"
              class="inline-flex items-center h-full text-orange-200 font-bold p-2"
          >
            Categories
          </router-link>
        </div>
        <p class="text-center">Follow us on social media:</p>
        <div class="flex justify-center mt-2">
          <a href="#" class="text-white mr-4 hover:text-gray-400"><i class="fab fa-facebook"></i></a>
          <a href="#" class="text-white mr-4 hover:text-gray-400"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-white mr-4 hover:text-gray-400"><i class="fab fa-instagram"></i></a>
        </div>
      </div>

      <!-- Content aligned to the right -->
      <div class="w-full md:w-auto text-center md:text-right">
        <p class="">Contact us: support@yourcompany.com</p>
      </div>
    </div>
  </footer>
</template>

<style>
  .hamburger {
    width: 35px;
    height: 30px;
    cursor: pointer;
    margin: 20px;
  }

  .hamburger .hambLine{
    width: 35px;
    height: 5px;
    background-color: black;
    margin: 6px 0;
  }

  .menu.show {
    right: 10px;
  }
</style>
