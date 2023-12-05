<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Model Railroad Purchases</v-card-title>
        <v-card-actions>
          <v-btn @click="addPurchase()" width="200">Add Purchase</v-btn>
        </v-card-actions>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="purchasesStore.purchases"
          :search="search"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.date="{ item }">
            <span>{{ formatDate(item.date) }}</span>
          </template>
          <template v-slot:item.unitcost="{ item }">
            <span>{{ cnvtMoney(item.unitcost) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editPurchase(item)"
              >mdi-pencil</v-icon
            >
            <v-icon color="red darken-1" @click="deletePurchase(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
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
      </v-card>
    </v-container>
  </v-app>
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
const headers = [
  { title: "Number", key: "num", align: 'end' },
  { title: "Date", key: "date" },
  { title: "Store", key: "store" },
  { title: "Manufacturer", key: "manufacturer" },
  { title: "Description", key: "desciption" },
  { title: "Unit Cost", key: "unitcost", align: 'end' },
  { title: "Actions", key: "actions", sortable: false },
];
const search = ref("");

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
