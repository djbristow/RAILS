<template>
  <div class="xx">
    <h1>Model Railroad Purchases</h1>
    <v-btn @click="addPurchase()" width="200">Add Purchase</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Number</th>
          <th class="text-left">Date</th>
          <th class="text-left">Store</th>
          <th class="text-left">Manufacturer</th>
          <th class="text-left">Description</th>
          <th class="text-left">Unit Cost</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purrows" :key="item.id">
          <td>{{ item.num }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.store }}</td>
          <td>{{ item.manufacturer }}</td>
          <td>{{ item.desciption }}</td>
          <td>{{ item.unitcost }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editPurchase(item)">mdi-pencil</v-icon>
            <v-icon color="red darken-1" @click="deletePurchase(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="editPurchaseDialog">
      <dialog-edit-purchase :purchase="editablePurchase" @closeEditPurchaseDialog="editPurchaseDialog = false" />
    </v-dialog>
    <v-dialog v-model="deletePurchaseDialog">
      <dialog-delete-purchase :purchase="editablePurchase" @closeDeletePurchaseDialog="deletePurchaseDialog = false" />
    </v-dialog>
    <v-dialog v-model="addPurchaseDialog">
      <dialog-add-purchase @closeAddPurchaseDialog="addPurchaseDialog = false" />
    </v-dialog>
  </div>
</template>
<script>
import moment from "moment";
import store from "../store";
import DialogEditPurchase from "../components/dialogs/DialogEditPurchase.vue";
import DialogDeletePurchase from "../components/dialogs/DialogDeletePurchase.vue";
import DialogAddPurchase from "../components/dialogs/DialogAddPurchase.vue";
export default {
  components: {
    DialogEditPurchase,
    DialogDeletePurchase,
    DialogAddPurchase,
  },
  data: () => ({
    editPurchaseDialog: false,
    deletePurchaseDialog: false,
    addPurchaseDialog: false,
    editablePurchase: null,
  }),
  computed: {
    purchases() {
      return this.$store.state.purchases;
    },
    purrows() {
      class Purchase {
        constructor(_id, num, date, store, manufacturer, description, unitcost) {
          this._id = _id;
          this.num = num;
          this.date = date;
          this.store = store;
          this.manufacturer = manufacturer;
          this.description = description;
          this.unitcost = unitcost;
        }
      }
      function formatDate(unformatDate) {
        if (unformatDate === null || unformatDate === '') {
          return ''
        } else {
          return moment.utc(unformatDate).format('YYYY-MM-DD')
        }
      }
      let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      let purrows = [];
      this.purchases.forEach((item) => {
        purrows.push(new Purchase(item._id, item.num, formatDate(item.date)
          , item.store, item.manufacturer, item.description, USDollar.format(item.unitcost)));
      });
      return purrows;
    },

  },
  methods: {
    addPurchase() {
      this.addPurchaseDialog = true;
    },
    deletePurchase(item) {
      this.editablePurchase = item;
      this.deletePurchaseDialog = true;
    },
    editPurchase(item) {
     this.editablePurchase = store.getters.getPurById(item._id);
     this.editPurchaseDialog = true;
    },
  },
};
</script>
