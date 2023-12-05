<template>
  <v-app class="xx" :key="componentKey">
    <v-container>
      <v-card>
        <v-card-title>Model Railroad Purchases</v-card-title>
        <v-select
          :items="items"
          label="Grouped By"
          v-model="selectedGroup"
          @update:model-value="changeGroupBy"
        ></v-select>
        <v-data-table
          :headers="headers"
          :items="purchasesStore.purchases"
          :group-by="groupBy"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.date="{ item }">
            <span>{{ formatDate(item.date) }}</span>
          </template>
          <template v-slot:item.unitcost="{ item }">
            <span>{{ cnvtMoney(item.unitcost) }}</span>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { usePurchasesStore } from "@/stores/purchases";
import moment from "moment";

const purchasesStore = usePurchasesStore();
const headers = [
  { title: "Number", key: "num", align: "end" },
  { title: "Date", key: "date" },
  { title: "Store", key: "store" },
  { title: "Manufacturer", key: "manufacturer" },
  { title: "Description", key: "desciption" },
  { title: "Unit Cost", key: "unitcost", align: "end" },
];
const groups = [
  { key: "project", order: "asc" },
  { key: "store", order: "asc" },
  { key: "manufacturer", order: "asc" },
];
const items = ["Project", "Store", "Manufacturer"];
const selectedGroup = ref("Project");
const componentKey = ref(0);
const groupBy = [groups[0]];

const changeGroupBy = () => {
  console.log(selectedGroup.value);
  if (selectedGroup.value === "Project") {
    groupBy[0] = groups[0];
  } else if (selectedGroup.value === "Store") {
    groupBy[0] = groups[1];
  } else if (selectedGroup.value === "Manufacturer") {
    groupBy[0] = groups[2];
  }
  componentKey.value += 1;
};
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
</script>
