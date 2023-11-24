<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Decoder? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ decoderLoco.roadName }} {{ decoderLoco.roadNumber }}</strong>'s decoder?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteDecoderDialog')" text> No </v-btn>
      <v-btn @click="deleteDecoder(decoderLoco._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useDecodersStore } from "@/stores/decoders";

const props = defineProps({
  decoderLoco: {
    type: Object,
    required: true,
  },
});
const decoderStore = useDecodersStore();
const deleteDecoder = (id) => {
  decoderStore.DELETE_DECODER(id);
  emit("closeDeleteDecoderDialog");
};
</script>
