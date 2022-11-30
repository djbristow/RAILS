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
<script>
import axios from 'axios'
export default {
  name: "DialogAddImage",
  data: () => ({
    title: "",
    fileName: [],
    name: "",
    notes: "",
    file: null,
  }),
  computed: {
    imageAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0]
    },
    addImage() {
      let formData = new FormData();
      this.name = this.file.name
      formData.append('file', this.file);
      axios.post('http://localhost:3030/uploadimg',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(async response => {
        console.log('SUCCESS!!' + response.data);
        this.$emit('closeAddImageDialog');
        this.$store.dispatch("addNewImage", { title: this.title, fileName: this.name, notes: this.notes });
      }).catch(error => {
        console.log('FAILURE!!' + error);
      });
    },
  }
}
</script>
