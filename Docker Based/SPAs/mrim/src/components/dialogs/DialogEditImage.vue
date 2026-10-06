<template>
  <v-card width="800">
    <v-card-title class="headline">Image Details</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="title" label="Title" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="fileName" label="File Name" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="category" label="Category" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="notes" label="Notes" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
const imageStore = useImagesStore();
const emit = defineEmits(["closeEditImageDialog"]);

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
