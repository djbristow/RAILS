<template>
  <v-app>
    <div class="xx">
      <h1>Inventory of Rollingstock</h1>
      <v-btn @click="addRollingstock()" width="175">New Rollingstock</v-btn>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">Road Name</th>
            <th class="text-left">Road Number</th>
            <th class="text-left">AAR</th>
            <th class="text-left">Color</th>
            <th class="text-left">RFID</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rs" :key="item.id">
            <td>{{ item.roadName }}</td>
            <td>{{ item.roadNumber }}</td>
            <td>{{ item.aarCode }}</td>
            <td>{{ item.color }}</td>
            <td>{{ item.rfid }}</td>
            <td>
              <v-icon color="blue darken-1" @click="editRollingstock(item)">
                mdi-pencil
              </v-icon>
              <v-icon color="red darken-1" @click="deleteRollingstock(item)">mdi-delete</v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="editRsDialog">
        <dialog-edit-rs :rollingstock="editableRs" @closeEditRsDialog="editRsDialog = false" />
      </v-dialog>
      <v-dialog v-model="deleteRsDialog">
        <dialog-delete-rs :rollingstock="editableRs" @closeDeleteRsDialog="deleteRsDialog = false" />
      </v-dialog>
      <v-dialog v-model="addRsDialog">
        <dialog-add-rs @closeAddRsDialog="addRsDialog = false" />
      </v-dialog>
    </div>
  </v-app>
</template>
<script>
import DialogEditRs from "../components/dialogs/DialogEditRs.vue";
import DialogDeleteRs from "../components/dialogs/DialogDeleteRs.vue";
import DialogAddRs from "../components/dialogs/DialogAddRs.vue";
export default {
  components: {
    DialogEditRs,
    DialogDeleteRs,
    DialogAddRs,
  },
  data: () => ({
    editRsDialog: false,
    deleteRsDialog: false,
    addRsDialog: false,
    editableRs: null,
    rollingstock: null,
  }),
  computed: {
    rs() {
      return this.$store.state.rs;
    },
  },
  methods: {
    editRollingstock(item) {
      this.editableRs = item;
      this.editRsDialog = true;
    },
    deleteRollingstock(item) {
      this.editableRs = item;
      this.deleteRsDialog = true;
    },
    addRollingstock() {
      this.addRsDialog = true;
    },
  },
};
</script>
<style lang="">
</style>