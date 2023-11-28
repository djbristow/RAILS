<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Image? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ image.title }}</strong>?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteImageDialog')" text> No </v-btn>
      <v-btn @click="deleteImage(image._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useImagesStore } from "@/stores/images";

const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});
const imageStore = useImagesStore();
const emit = defineEmits(["closeDeleteImageDialog"]);

const deleteImage = (id) => {
  imageStore.DELETE_IMAGE(id);
  emit("closeDeleteImageDialog");
};
</script>
