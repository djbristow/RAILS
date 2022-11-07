<template>
  <div class="xx">
    <h1>AAR Codes</h1>
    <v-btn @click="addAarCode()" width="200">Add AAR Code</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">AAR</th>
          <th class="text-left">RS Type</th>
          <th class="text-left">Description</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in aarCodes" :key="item.id">
          <td>{{ item.aarCode }}</td>
          <td>{{ item.rollingstockType }}</td>
          <td>{{ item.description }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editAarCode(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteAarCode(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editAarCodeDialog">
        <dialog-edit-aar-code :aarCode="editableAarCode" @closeEditAarCodeDialog="editAarCodeDialog = false" />
      </v-dialog>
      <v-dialog v-model="deleteAarCodeDialog">
        <dialog-delete-aar-code :aarCode="editableAarCode" @closeDeleteAarCodeDialog="deleteAarCodeDialog = false" />
      </v-dialog>
      <v-dialog v-model="addAarCodeDialog">
        <dialog-add-aar-code @closeAddAarCodeDialog="addAarCodeDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script>
import DialogEditAarCode from "../components/dialogs/DialogEditAarCode.vue";
import DialogDeleteAarCode from "../components/dialogs/DialogDeleteAarCode.vue";
import DialogAddAarCode from "../components/dialogs/DialogAddAarCode.vue";
export default {
  components: {
    DialogEditAarCode,
    DialogDeleteAarCode,
    DialogAddAarCode,
  },
  data: () => ({
    editAarCodeDialog: false,
    deleteAarCodeDialog: false,
    addAarCodeDialog: false,
    editableAarCode: null,
  }),
  computed: {
    aarCodes() {
      return this.$store.state.aarCodes;
    },
  },
  methods: {
    addAarCode() {
      this.addAarCodeDialog = true;
    },
    deleteAarCode(item) {
      this.editableAarCode = item;
      this.deleteAarCodeDialog = true;
    },
    editAarCode(item) {
      this.editableAarCode = item;
      this.editAarCodeDialog = true;
    },
  },
};
</script>