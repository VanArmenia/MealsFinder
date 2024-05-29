<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import axiosClient from "@/axiosClient.js";

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleClick  = () => {
  const hamburgerMenu = document.getElementById('hamburger');
  if (hamburgerMenu && (hamburgerMenu === event.target || hamburgerMenu.contains(event.target))) {
    return; // Do nothing if clicking on the hamburger menu
  }
  isOpen.value = false;
};

onMounted( () => {
  document.addEventListener('click', handleClick)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClick);
});

</script>
<template>
  <header class="bg-white shadow h-16 flex justify-between items-stretch">
    <router-link
      :to="{ name: 'home' }"
      class="inline-flex items-center h-full px-5 text-orange-500 font-bold"
    >
      Home
    </router-link>

    <div id="hamburger" class="hamburger block sm:hidden" @click="toggleMenu">
      <div class="hambLine"></div>
      <div class="hambLine"></div>
      <div class="hambLine"></div>
      <div :class="{ 'translate-x-0': isOpen , 'translate-x-36': !isOpen}" class="bg-orange-200 duration-500 transition-transform fixed right-0 top-16 text-black text-xl font-bold mb-2 h-screen">
        <div class="flex flex-col">
          <router-link
              :to="{ name: 'byName' }"
              class="inline-flex items-center p-4 h-full transition-colors hover:bg-orange-500 hover:text-white w-full"
          >
            Search
          </router-link>
          <router-link
              :to="{ name: 'ingredients' }"
              class="inline-flex items-center p-4 h-full transition-colors hover:bg-orange-500 hover:text-white w-full"
          >
            Ingredients
          </router-link>
          <router-link
              :to="{ name: 'categories' }"
              class="inline-flex items-center p-4 h-full transition-colors hover:bg-orange-500 hover:text-white w-full"
          >
            Categories
          </router-link>
        </div>

      </div>
    </div>
    <div class="flex items-center gap-1 menu sm:block hidden" :class="{ 'menu': true, 'show': isOpen }" id="menu">
       <router-link
            :to="{ name: 'byName' }"
            class="inline-flex items-center px-2 h-full transition-colors hover:bg-orange-500 hover:text-white"
        >
          Search
        </router-link>
      <!--      <router-link-->
      <!--        :to="{ name: 'byLetter' }"-->
      <!--        class="inline-flex items-center px-2 h-full transition-colors hover:bg-orange-500 hover:text-white"-->
      <!--      >-->
      <!--        By Letter-->
      <!--      </router-link>-->

      <router-link
            :to="{ name: 'ingredients' }"
            class="inline-flex items-center px-2 h-full transition-colors hover:bg-orange-500 hover:text-white"
        >
          Ingredients
        </router-link>
      <router-link
            :to="{ name: 'categories' }"
            class="inline-flex items-center px-2 h-full transition-colors hover:bg-orange-500 hover:text-white"
        >
          Categories
        </router-link>
    </div>
  </header>
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
