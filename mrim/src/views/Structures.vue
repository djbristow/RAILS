<template>
  <div class="xx">
    <h1>Inventory of Structures</h1>
    <v-btn @click="addStructure()" width="200">Add Structure</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Use</th>
          <th class="text-left">Owner</th>
          <th class="text-left">Location</th>
          <th class="text-left">Year Built</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in structures" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.structureUse }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.builtDate }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editStructure(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteStructure(item)">mdi-delete</v-icon>
            <div v-if="item.image">
              <v-icon color="green darken-1" @click="viewStructure(item)">mdi-eye</v-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="editStructureDialog">
      <dialog-edit-structure :structure="editableStructure" @closeEditStructureDialog="editStructureDialog = false" />
    </v-dialog>
    <v-dialog v-model="deleteStructureDialog">
      <dialog-delete-structure :structure="editableStructure" @closeDeleteStructureDialog="deleteStructureDialog = false" />
    </v-dialog>
    <v-dialog v-model="addStructureDialog">
      <dialog-add-structure @closeAddStructureDialog="addStructureDialog = false" />
    </v-dialog>
    <v-dialog v-model="viewStructureDialog">
      <dialog-view-structure :structure="editableStructure" @closeViewStructureDialog="viewStructureDialog = false" />
    </v-dialog>
    <hr />
  </div>
</template>

<script>
import DialogAddStructure from "../components/dialogs/DialogAddStructure.vue";
import DialogDeleteStructure from "../components/dialogs/DialogDeleteStructure.vue";
import DialogEditStructure from "../components/dialogs/DialogEditStructure.vue";
import DialogViewStructure from "../components/dialogs/DialogViewStructure.vue";
export default {
  components: {
    DialogAddStructure,
    DialogEditStructure,
    DialogDeleteStructure,
    DialogViewStructure,
  },
  data: () => ({
    addStructureDialog: false,
    deleteStructureDialog: false,
    editStructureDialog: false,
    viewStructureDialog: false,
    editableStructure: null,
  }),
  computed: {
    structures() {
      return this.$store.state.structures;
    },
  },
  methods: {
    addStructure() {
      this.addStructureDialog = true;
    },
    editStructure(item) {
      this.editableStructure = item;
      this.editStructureDialog = true;
    },
    deleteStructure(item) {
      this.editableStructure = item;
      this.deleteStructureDialog = true;
    },
    viewStructure(item) {
      this.editableStructure = item;
      this.viewStructureDialog = true;
    }
  },
};
</script>