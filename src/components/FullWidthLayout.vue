<template>
  <Navbar />
  <div class="flex flex-col justify-between min-h-screen">
    <main>
      <div class="w-full">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
</script>
