<template>
  <v-app>
    <v-container class="xx">
      <v-card>
        <v-card-title>RFID Tags Read</v-card-title>
        <div v-if="connStatusStore.connStatus === 'Connected'">
          <v-icon color="green">mdi-cast-connected</v-icon>
        </div>
        <div v-else>
          <v-icon color="red">mdi-cast-connected</v-icon>
        </div>
        <v-data-table
          :headers="headers"
          :items="rsStore.rfid"
          item-key="item.id"
          density="compact"
          hide-default-footer
        >
          <template v-slot:item.time="{ item }">
            {{ formatDate(item.time) }}
          </template>
          <template v-slot:item.roadNameNumber="{ item }">
            <div v-if="item.roadNameNumber === 'Not Registered'">
              <span style="color: red">{{ item.roadNameNumber }}</span>
            </div>
            <div v-else>{{ item.roadNameNumber }}</div>
          </template>
          <template v-slot:item.actions="{ item }">
            <div v-if="item.roadNameNumber === 'Not Registered'">
              <v-icon color="red" @click="dialogRegister(item)"
                >mdi-checkbox-marked-circle-outline</v-icon
              >
            </div>
          </template>
        </v-data-table>
        <v-dialog v-model="registerDialog">
          <dialog-register-tag
            :rfid="dialogRfid"
            @closeRegisterDialog="registerDialog = false"
          />
        </v-dialog>
      </v-card>
      <br />
      <v-card-actions>
        <v-btn @click="reloadPage">Clear</v-btn>
      </v-card-actions>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";
import DialogRegisterTag from "@/components/dialogs/DialogRegisterTag.vue";
import { useConnStatusStore } from "@/stores/connStatus";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const connStatusStore = useConnStatusStore();
const dialogRfid = ref("");
const registerDialog = ref(false);
const headers = [
  { title: "Time", key: "time", sortable: false },
  { title: "Sensor", key: "sensor", sortable: false },
  { title: "Reader", key: "reader", sortable: false },
  { title: "Tag", key: "rfid", sortable: false },
  { title: "Road Name and Number", key: "roadNameNumber", sortable: false },
  { title: "AAR", key: "aarCode", sortable: false },
  { title: "Color", key: "color", sortable: false },
  { title: "Register", key: "actions", sortable: false },
];

const formatDate = (epochTime) => {
  if (epochTime === null || epochTime === "") {
    return "";
  } else {
    return moment
      .utc(epochTime * 1000)
      .local()
      .format("YYYY-MM-DD hh:mm:ss");
  }
};
const dialogRegister = (item) => {
  dialogRfid.value = item.rfid;
  registerDialog.value = true;
};
const reloadPage = () => {
  location.reload();
};
</script>

<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
