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
import coords from "@/Countries.js";


// OpenLayers map lib
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import DragPan from 'ol/interaction/DragPan';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Text, Fill, Stroke } from 'ol/style';
import Cluster from 'ol/source/Cluster';
// OpenLayers map lib //

const markers = ref([]);
let map;

const { recipesByArea } = defineProps({
  recipesByArea: {
    required: true,
    type: Object,
  }
})

const createMarkers = () => {
  // Clear existing markers
  markers.value = [];
  // Create new markers based on the recipe count
  recipesByArea.forEach(area => {
    let latitude
    let longitude

    const coord = coords.find(c => c.country === area.country);

    if (coord) {
      latitude = coord.latitude;
      longitude = coord.longitude;
    }

    for (let i = 0; i < area.meals.length; i++) {

      latitude += 0.03
      longitude -= 0.04

      // Create a marker feature for each meal and apply the resized image as icon
      const createMarker = async () => {
        const marker = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
        });

        const markerStyle = new Style({
          image: new Icon({
            src: area.meals[i].strMealThumb,
            scale: 0.08
          })
        });

        marker.setStyle(markerStyle);
        markers.value.push(marker);

        // Update the map layers if this is the last marker
        if (area === recipesByArea[recipesByArea.length - 1] && i === area.meals.length - 1) {
          updateMapLayers();
        }
      };

      createMarker();
    }
  });
};

const updateMapLayers = () => {
  // Create a vector source for the markers
  const vectorSource = new VectorSource({
    features: markers.value,
  });

  // Create a cluster source for the markers
  const clusterSource = new Cluster({
    distance: 40,
    source: vectorSource,
  });

  // Define the cluster style
  const createClusterStyle = (feature) => {
    const clusterFeatures = feature.get('features');

    if (!clusterFeatures || clusterFeatures.length === 0) {
      // Return a default style if there are no features in the cluster
      return new Style({
        image: new Icon({
          src: 'path/to/default/image.png', // Path to a default image
          anchor: [0.5, 1],
        }),
      });
    }

    const baseFeature = clusterFeatures[0];
    const baseStyle = baseFeature.getStyle ? baseFeature.getStyle() : null;
    const baseImage = baseStyle && baseStyle.getImage ? baseStyle.getImage() : null;
    const imageSrc = baseImage ? baseImage.getSrc() : null;

    // Fallback or default image source if imageSrc is null
    const defaultImageSrc = 'path/to/default/image.png';
    const src = imageSrc || defaultImageSrc;

    const size = clusterFeatures.length;
    let style;
    if (size === 1) {
      style = new Style({
        image: new Icon({
          src: src, // Use the image source of the single marker
          anchor: [0.5, 1],
          scale: 0.07
        }),
      });
    } else {
      style = new Style({
        image: new Icon({
          src: src, // Use the image source of the single marker
          anchor: [0.5, 1],
          scale: 0.07
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

  // Create a vector layer for the clusters
  const clusterLayer = new VectorLayer({
    source: clusterSource,
    style: (feature) => createClusterStyle(feature),
  });

  // Remove existing layers and add the new cluster layer to the map
  map.getLayers().clear();
  map.addLayer(new TileLayer({
    source: new OSM(),
  }));
  map.addLayer(clusterLayer);
};


const initializeMap = async () => {
  if (map) return; // Ensure the map is only initialized once

  map = new Map({
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
    interactions: ([
          new MouseWheelZoom(),
          new DragPan()
        ]),
  });

  if (recipesByArea && recipesByArea.length > 0) {
    await createMarkers(); // Call createMarkers initially if data is already present
  }
};

onMounted(async () => {
  await initializeMap();
});

watch(recipesByArea,() => {
  initializeMap();
});
</script>
