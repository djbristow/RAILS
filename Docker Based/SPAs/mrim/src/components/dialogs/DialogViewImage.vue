<template>
  <v-card width="800">
    <v-card-title class="headline"> Image Details </v-card-title>
      <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="5">
          <v-text-field>Title: {{ image.title }}</v-text-field>
          <v-text-field>File Name: {{ image.fileName }}</v-text-field>
          <v-text-field>Category: {{ image.category }}</v-text-field>
          <v-text-field>Notes: {{ image.notes }}</v-text-field>
        </v-col>
        <v-col cols="7">
          <v-img :src='imageServer' />
        </v-col>
      </v-row>
      </v-container>
      <v-btn @click="$emit('closeViewImageDialog')" text> Close </v-btn>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useImagesStore } from "@/stores/images";
const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});
const imagesStore = useImagesStore();
const imageServer = ref("");
onMounted(() => {
  imageServer.value = 'http://' + import.meta.env.VITE_MRFM_TCP_ADDR +':'+ import.meta.env.VITE_MRFM_TCP_PORT +'/'+ props.image.fileName;
});
</script>
