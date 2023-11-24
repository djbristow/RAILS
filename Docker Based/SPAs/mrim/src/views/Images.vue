<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Images</v-card-title>
        <v-card-actions>
          <v-btn @click="addImage()" width="200">Add Image</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="imagesStore.images"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editImage(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteImage(item)"
              >mdi-delete</v-icon
            >
            <v-icon color="green darken-1" @click="viewImage(item)"
              >mdi-eye</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editImageDialog">
          <dialog-edit-image
            :image="editableImage"
            @closeEditImageDialog="editImageDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteImageDialog">
          <dialog-delete-image
            :image="editableImage"
            @closeDeleteImageDialog="deleteImageDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addImageDialog">
          <dialog-add-image @closeAddImageDialog="addImageDialog = false" />
        </v-dialog>
        <v-dialog v-model="viewImageDialog">
          <dialog-view-image
            :image="editableImage"
            @closeViewImageDialog="viewImageDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditImage from "@/components/dialogs/DialogEditImage.vue";
import DialogDeleteImage from "@/components/dialogs/DialogDeleteImage.vue";
import DialogAddImage from "@/components/dialogs/DialogAddImage.vue";
import DialogViewImage from "@/components/dialogs/DialogViewImage.vue";
import { useImagesStore } from "@/stores/images";

const imagesStore = useImagesStore();
const editImageDialog = ref(false);
const deleteImageDialog = ref(false);
const addImageDialog = ref(false);
const editableImage = ref(null);
const viewImageDialog = ref(false);
const headers = [
  { title: "Title", key: "title" },
  { title: "File Name", key: "fileName" },
  { title: "Category", key: "category" },
  { title: "Actions", key: "actions", sortable: false },
];

const addImage = () => {
  addImageDialog.value = true;
};
const editImage = (item) => {
  editableImage.value = item;
  editImageDialog.value = true;
};
const deleteImage = (item) => {
  editableImage.value = item;
  deleteImageDialog.value = true;
};
const viewImage = (item) => {
  editableImage.value = item;
  viewImageDialog.value = true;
};
</script>
