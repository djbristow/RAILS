<template>
  <v-card width="800">
    <v-card-title class="headline"> Update MR Purchase </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field v-model="num" label="Number"></v-text-field>
          <v-text-field v-model="date" label="Date"></v-text-field>
          <v-text-field v-model="store" label="Store"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="item" label="Item"></v-text-field>
          <v-text-field v-model="desciption" label="Description"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="manufacturer"
            label="Manufacturer"
          ></v-text-field>
          <v-text-field v-model="unitcost" label="Unit Cost"></v-text-field>
          <v-text-field v-model="qty" label="Qty"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="project" label="Project"></v-text-field>
          <v-text-field v-model="roadname" label="Road Name"></v-text-field>
          <v-text-field
            v-model="roadnumbers"
            label="Road Numbers"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-textarea v-model="notes" label="Notes"></v-textarea>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="$emit('closeEditPurchaseDialog')"
        color="red darken-1"
        text
      >
        Cancel
      </v-btn>
      <v-btn :disabled="purchaseEditDataInvalid" @click="editPurchase" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePurchasesStore } from "@/stores/purchases";

const props = defineProps({
  purchase: {
    type: Object,
    required: true,
  },
});
const purchasesStore = usePurchasesStore();
const purchaseEditDataInvalid = ref(false);
const num = ref("");
const date = ref(null);
const store = ref("");
const item = ref("");
const desciption = ref("");
const manufacturer = ref("");
const unitcost = ref("");
const qty = ref("");
const project = ref("");
const roadname = ref("");
const roadnumbers = ref("");
const notes = ref("");
const emit = defineEmits(["closeEditPurchaseDialog"]);

onMounted(() => {
  num.value = props.purchase.num;
  date.value = props.purchase.date;
  store.value = props.purchase.store;
  item.value = props.purchase.item;
  desciption.value = props.purchase.desciption;
  manufacturer.value = props.purchase.manufacturer;
  unitcost.value = props.purchase.unitcost;
  qty.value = props.purchase.qty;
  project.value = props.purchase.project;
  roadname.value = props.purchase.roadname;
  roadnumbers.value = props.purchase.roadnumbers;
  notes.value = props.purchase.notes;
});
const editPurchase = () => {
  let updatedPurchase = {
    _id: props.purchase._id,
    num: num.value,
    date: date.value,
    store: store.value,
    item: item.value,
    desciption: desciption.value,
    manufacturer: manufacturer.value,
    unitcost: unitcost.value,
    qty: qty.value,
    project: project.value,
    roadname: roadname.value,
    roadnumbers: roadnumbers.value,
    notes: notes.value,
  };
  purchasesStore.UPDATE_PURCHASE(updatedPurchase);
  emit("closeEditPurchaseDialog");
};
</script>
