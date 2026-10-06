<template>
  <v-card width="800">
    <v-card-title class="headline">Image Details</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" md="5">
            <v-row compact>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="image.title" label="Title" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="image.fileName" label="File Name" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="image.category" label="Category" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-textarea :model-value="image.notes" label="Notes" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7">
            <v-img :src="imageServer" contain />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('closeViewImageDialog')" text>Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});
const imageServer = ref("");
onMounted(() => {
  if (import.meta.env.DEV) {
    imageServer.value = import.meta.env.VITE_MRFM_URI_DEV + "/" + props.image.fileName;
  } else {
    imageServer.value = import.meta.env.VITE_MRFM_URI + "/" + props.image.fileName;
  }
});
</script>
