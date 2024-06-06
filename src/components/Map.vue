<template>
  <div class="p-8 pb-0">
    <h1 class="text-4xl font-bold mb-4 text-orange-500">Map</h1>
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

import { onMounted, ref, watch } from "vue";


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

const { recipesByArea } = defineProps({
  meals: {
    required: true,
    type: Array,
  }
})

const markers = ref([]);

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

  // Function to create markers based on the recipe count
  const createMarkers = () => {
    // Clear existing markers
    markers.value = [];

    // Create new markers based on the recipe count
    recipesByArea.value.forEach(area => {
      for (let i = 0; i < area.count; i++) {
        const latitude = Math.random() * 10; // Example latitude
        const longitude = Math.random() * 10; // Example longitude

        const marker = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
        });

        markers.value.push(marker);
      }
    });
  };

  // Watch for changes in recipesByArea and recreate markers
  watch(recipesByArea, () => {
    createMarkers();
  });

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
</script>
