<template>
  <div class="xx">
    <h1>Model Railroad Purchases</h1>
    <v-btn @click="addPurchase()" width="200">Add Purchase</v-btn>
    <v-table density="compact" fixed-header height="800px">
      <thead>
        <tr>
          <th class="text-left">Number</th>
          <th class="text-left" style="width: 150px;">Date</th>
          <th class="text-left">Store</th>
          <th class="text-left">Manufacturer</th>
          <th class="text-left">Description</th>
          <th class="text-left">Unit Cost</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purchasesStore.purchases" :key="item.id">
          <td>{{ item.num }}</td>
          <td>{{ formatDate(item.date) }}</td>
          <td>{{ item.store }}</td>
          <td>{{ item.manufacturer }}</td>
          <td>{{ item.desciption }}</td>
          <td>{{ cnvtMoney(item.unitcost) }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editPurchase(item)"
              >mdi-pencil</v-icon
            >
            <v-icon color="red darken-1" @click="deletePurchase(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="editPurchaseDialog">
      <dialog-edit-purchase
        :purchase="editablePurchase"
        @closeEditPurchaseDialog="editPurchaseDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="deletePurchaseDialog">
      <dialog-delete-purchase
        :purchase="editablePurchase"
        @closeDeletePurchaseDialog="deletePurchaseDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="addPurchaseDialog">
      <dialog-add-purchase
        @closeAddPurchaseDialog="addPurchaseDialog = false"
      />
    </v-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePurchasesStore } from "@/stores/purchases";
import moment from "moment";
import DialogEditPurchase from "@/components/dialogs/DialogEditPurchase.vue";
import DialogDeletePurchase from "@/components/dialogs/DialogDeletePurchase.vue";
import DialogAddPurchase from "@/components/dialogs/DialogAddPurchase.vue";

const purchasesStore = usePurchasesStore();
const editPurchaseDialog = ref(false);
const deletePurchaseDialog = ref(false);
const addPurchaseDialog = ref(false);
const editablePurchase = ref(null);
const cnvtMoney = (money) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return USDollar.format(money);
};
const formatDate = (unformatDate) => {
  if (unformatDate === null || unformatDate === "") {
    return "";
  } else {
    return moment.utc(unformatDate).format("YYYY-MM-DD");
  }
};
const addPurchase = () => {
  addPurchaseDialog.value = true;
};
const deletePurchase = (item) => {
  editablePurchase.value = item;
  deletePurchaseDialog.value = true;
};
const editPurchase = (item) => {
  editablePurchase.value = purchasesStore.GET_PURCHASE_BY_ID(item._id);
  editPurchaseDialog.value = true;
};
</script>
