<template>
  <v-card width="400">
    <v-card-title class="headline"> New Image </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="title" label="Title"></v-text-field>
        <v-file-input v-model="fileName" accept="txt" label="File input" @change="onFileChange"></v-file-input>
        <v-textarea v-model="notes" label="Notes"></v-textarea>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddImageDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="imageAddDataInvalid" @click="addImage" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import axios from 'axios'
import { ref } from "vue";
import { useImagesStore } from "@/stores/images";

const title = ref("");
const fileName = ref([]);
const notes = ref("");
const file = ref(null);
const imageAddDataInvalid = ref(false);
const emit = defineEmits(['closeAddImageDialog']);
const imagesStore = useImagesStore();
const onFileChange = (e) => {
  file.value = e.target.files[0]
}
const addImage = () => {
  let formData = new FormData();
  title.value = file.value.name
  formData.append('file', file.value);
  axios.post('http://localhost:3030/uploadimg',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  ).then(async response => {
    console.log('SUCCESS!!' + response.data);
    emit('closeAddImageDialog');
    imagesStore.ADD_NEW_IMAGE({
      title: title.value,
      fileName: file.value.name,
      notes: notes.value,
    });
  }).catch(error => {
    console.log('FAILURE!!' + error);
  });
}
</script>
