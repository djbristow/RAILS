<template>
  <v-card width="800">
    <v-card-title class="headline"> AAR Code </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="title" label="Title"></v-text-field>
        <v-text-field v-model="fileName" label="File Name"></v-text-field>
        <v-text-field v-model="category" label="Category"></v-text-field>
        <v-textarea v-model="notes" label="Notes"></v-textarea>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditImageDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="imageEditDataInvalid" @click="editImage" text>
        Save
      </v-btn>
    </v-card-actions>
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
const title = ref("");
const fileName = ref("");
const category = ref("");
const notes = ref("");
const id = ref("");
const imageEditDataInvalid = ref(false);
const emit = defineEmits(["closeEditImageDialog"]);
const imageStore = useImagesStore();
const editImage = () => {
  imageStore.UPDATE_IMAGE({
    _id: id.value,
    title: title.value,
    fileName: fileName.value,
    category: category.value,
    notes: notes.value,
  });
  emit("closeEditImageDialog");
};
onMounted(() => {
  id.value = props.image._id;
  title.value = props.image.title;
  fileName.value = props.image.fileName;
  category.value = props.image.category;
  notes.value = props.image.notes;
});
</script>
