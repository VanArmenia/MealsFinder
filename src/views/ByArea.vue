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
    <h3 class="text-2xl font-bold mb-2">{{ recipesByArea }}</h3>
  </div>
  <div id="map"></div>
</template>
<style>
#map {
  width: 100%;
  height: 100vh;
}
</style>
<script setup>

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axiosClient from "../axiosClient";
import store from "../store";

// OpenLayers map lib
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Text, Fill, Stroke } from 'ol/style';
import Cluster from 'ol/source/Cluster';
// OpenLayers map lib //

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

        // Log the result
        console.log(`The number of recipes for ${area} is: ${response.data.meals.length}`);
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

  // Create map
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    }),
    interactions: [new MouseWheelZoom()],
  });

  // Create markers
  const newMarkers = [];

  recipesByArea.value.forEach(area => {
    for (let i = 0; i < area.count; i++) {
      const latitude = Math.random() * 10; // Example latitude
      const longitude = Math.random() * 10; // Example longitude

      const marker = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });

      newMarkers.push(marker);
    }
  });

  markers.value = newMarkers;

  // Create vector source for markers
  const vectorSource = new VectorSource({
    features: markers.value,
  });

  // Create cluster source
  const clusterSource = new Cluster({
    distance: 40,
    source: vectorSource,
  });

  // Define cluster style
  const createClusterStyle = (feature) => {
    const size = feature.get('features').length;
    let style;
    if (size === 1) {
      style = new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png', // URL to the marker image
          anchor: [0.5, 1],
        }),
      });
    } else {
      style = new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png', // URL to the marker image
          anchor: [0.5, 1],
        }),
        text: new Text({
          text: size.toString(),
          font: 'bold 20px Arial', // Increase font size and make it bold
          fill: new Fill({
            color: '#fff',
          }),
          stroke: new Stroke({
            color: '#000',
            width: 3,
          }),
        }),
      });
    }
    return style;
  };

  // Create vector layer for clusters
  const clusterLayer = new VectorLayer({
    source: clusterSource,
    style: (feature) => createClusterStyle(feature),
  });

  // Add cluster layer to map
  map.addLayer(clusterLayer);
});
</script>
