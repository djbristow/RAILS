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
  <script>
export default {
  name: "DialogEditImage",
  props: ["image"],
  data: () => ({
    title: "",
    fileName: "",
    notes: "",
    category: "",
  }),
  computed: {
    imageEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
    this.title = this.image.title;
    this.fileName = this.image.fileName;
    this.category = this.image.category;
    this.notes = this.image.notes;
  },
  methods: {
    editImage() {
      let updatedImage = {
        _id: this.image._id,
        title: this.title,
        fileName: this.fileName,
        category: this.category,
        notes: this.notes,
      };
      this.$store.dispatch("updateImage", updatedImage);
      this.$emit("closeEditImageDialog");
    },
  },
};
</script>
