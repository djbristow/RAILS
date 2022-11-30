<template>
  <div class="xx">
    <h1>Images</h1>
    <v-btn @click="addImage()" width="200">Add Image</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">File Name</th>
          <th class="text-left">Category</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in images" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.fileName }}</td>
          <td>{{ item.category }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editImage(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteImage(item)">mdi-delete</v-icon>
            <v-icon color="green darken-1" @click="viewImage(item)">mdi-eye</v-icon>
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editImageDialog">
        <dialog-edit-image :image="editableImage" @closeEditImageDialog="editImageDialog = false" />
      </v-dialog>
      <v-dialog v-model="deleteImageDialog">
        <dialog-delete-image :image="editableImage" @closeDeleteImageDialog="deleteImageDialog = false" />
      </v-dialog>
      <v-dialog v-model="addImageDialog">
        <dialog-add-image @closeAddImageDialog="addImageDialog = false" />
      </v-dialog>
      <v-dialog v-model="viewImageDialog">
        <dialog-view-image :image="editableImage" @closeViewImageDialog="viewImageDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script>
import DialogEditImage from "../components/dialogs/DialogEditImage.vue";
import DialogDeleteImage from "../components/dialogs/DialogDeleteImage.vue";
import DialogAddImage from "../components/dialogs/DialogAddImage.vue";
import DialogViewImage from "../components/dialogs/DialogViewImage.vue";
export default {
  components: {
    DialogEditImage,
    DialogDeleteImage,
    DialogAddImage,
    DialogViewImage,
  },
  data: () => ({
    editImageDialog: false,
    deleteImageDialog: false,
    addImageDialog: false,
    viewImageDialog: false,
    editableImage: null,
  }),
  computed: {
    images() {
      return this.$store.state.images;
    },
  },
  methods: {
    addImage() {
      this.addImageDialog = true;
    },
    deleteImage(item) {
      this.editableImage = item;
      this.deleteImageDialog = true;
    },
    editImage(item) {
      this.editableImage = item;
      this.editImageDialog = true;
    },
    viewImage(item) {
      this.editableImage = item;
      this.viewImageDialog = true;
    },
  },
};
</script>
