<template>
  <v-app>
    <div class="xx">
      <h1>RFID Tags Read</h1>
      <div v-if="connStatusStore.connStatus === 'Connected'">
        <v-icon color="green">mdi-cast-connected</v-icon>
      </div>
      <div v-else>
        <v-icon color="red">mdi-cast-connected</v-icon>
      </div>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">Time</th>
            <th class="text-left">Sensor</th>
            <th class="text-left">Reader</th>
            <th class="text-left">Tag</th>
            <th class="text-left">Road Name and Number</th>
            <th class="text-left">AAR</th>
            <th class="text-left">Color</th>
            <th class="text-left">Register</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rsStore.rfid" :key="item.rfid">
            <td>{{ item.time }}</td>
            <td>{{ item.sensor }}</td>
            <td>{{ item.reader }}</td>
            <td>{{ item.rfid }}</td>
            <td>
              <div v-if="item.roadNameNumber === 'Not Registered'">
                <span style="color: red">{{ item.roadNameNumber }}</span>
              </div>
              <div v-else>{{ item.roadNameNumber }}</div>
            </td>
            <td>{{ item.aarCode }}</td>
            <td>{{ item.color }}</td>
            <td>
              <div v-if="item.roadNameNumber === 'Not Registered'">
                <v-btn @click="dialogRegister(item)" icon>
                  <v-icon color="red"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-dialog v-model="registerDialog">
        <dialog-register-tag :rfid="dialogRfid" @closeRegisterDialog="registerDialog = false" />
      </v-dialog>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogRegisterTag from "@/components/dialogs/DialogRegisterTag.vue";
import { useConnStatusStore } from "@/stores/connStatus";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const connStatusStore = useConnStatusStore();
const dialogRfid = ref("");
const registerDialog = ref(false);
    const dialogRegister = (item) => {
      dialogRfid.value = item.rfid;
      registerDialog.value = true;
    };
</script>

<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
