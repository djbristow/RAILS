<template>
  <div class="xx">
    <h1>Decoders</h1>
    <v-btn @click="addDecoder()" width="200">Add Decoder</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Road Name</th>
          <th class="text-left">Road Number</th>
          <th class="text-left">Manufacturer</th>
          <th class="text-left">Family</th>
          <th class="text-left">Model</th>
          <th class="text-left">Address</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in decoderLocos" :key="item.id">
          <td>{{ item.roadName }}</td>
          <td>{{ item.roadNumber }}</td>
          <td>{{ item.mfg }}</td>
          <td>{{ item.family }}</td>
          <td>{{ item.model }}</td>
          <td>{{ item.address }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editDecoder(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteDecoder(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editDecoderDialog">
        <dialog-edit-decoder
          :decoderLoco="editableDecoder"
          @closeEditDecoderDialog="editDecoderDialog = false"
        />
      </v-dialog>
      <v-dialog v-model="deleteDecoderDialog">
        <dialog-delete-decoder
          :decoderLoco="editableDecoder"
          @closeDeleteDecoderDialog="deleteDecoderDialog = false"
        />
      </v-dialog>
      <v-dialog v-model="addDecoderDialog">
        <dialog-add-decoder @closeAddDecoderDialog="addDecoderDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>
  
  <script>
import DialogEditDecoder from "../components/dialogs/DialogEditDecoder.vue";
import DialogDeleteDecoder from "../components/dialogs/DialogDeleteDecoder.vue";
import DialogAddDecoder from "../components/dialogs/DialogAddDecoder.vue";
export default {
  components: {
    DialogEditDecoder,
    DialogDeleteDecoder,
    DialogAddDecoder,
  },
  data: () => ({
    editDecoderDialog: false,
    deleteDecoderDialog: false,
    addDecoderDialog: false,
    editableDecoder: null,
  }),
  computed: {
    decoders() {
      return this.$store.state.decoders;
    },
    locos() {
      return this.$store.getters.listLocomotives;
    },
    decoderLocos() {
      let decoderLocos = [];
      for (let i = 0; i < this.decoders.length; i++) {
        var decoderLoco = {
          _id: null,
          locomotiveID: null,
          roadName: "",
          roadNumber: "",
          mfg: "",
          family: "",
          model: "",
          address: "",
        };
        decoderLoco._id = this.decoders[i]._id;
        decoderLoco.mfg = this.decoders[i].mfg;
        decoderLoco.family = this.decoders[i].family;
        decoderLoco.model = this.decoders[i].model;
        decoderLoco.address = this.decoders[i].address;
        decoderLoco.locomotiveID = this.decoders[i].locomotiveID;
        let loco = this.locos.find((l) => l._id === decoderLoco.locomotiveID);
        decoderLoco.roadName = loco.roadName;
        decoderLoco.roadNumber = loco.roadNumber;
        decoderLocos.push(decoderLoco);
      }
      return decoderLocos;
    },
  },
  methods: {
    addDecoder() {
      this.addDecoderDialog = true;
    },
    deleteDecoder(item) {
      this.editableDecoder = item;
      this.deleteDecoderDialog = true;
    },
    editDecoder(item) {
      this.editableDecoder = item;
      this.editDecoderDialog = true;
    },
  },
};
</script>
  