<template>
  <v-app>
    <div class="xx">
      <h1>RFID Tags Read</h1>
      <div v-if="connStatus === 'Connected'">
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
          <tr v-for="rs in rsRfid" :key="rs.rfid">
            <td>{{ rs.time }}</td>
            <td>{{ rs.sensor }}</td>
            <td>{{ rs.reader }}</td>
            <td>{{ rs.rfid }}</td>
            <td>
              <div v-if="rs.roadNameNumber === 'Not Registered'">
                <span style="color: red">{{ rs.roadNameNumber }}</span>
              </div>
              <div v-else>{{ rs.roadNameNumber }}</div>
            </td>
            <td>{{ rs.aarCode }}</td>
            <td>{{ rs.color }}</td>
            <td>
              <div v-if="rs.roadNameNumber === 'Not Registered'">
                <v-btn @click="dialogRegister(rs.rfid)" icon>
                  <v-icon color="red">mdi-checkbox-marked-circle-outline</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <dialog-register v-if="registerDialog" @close="registerDialog = false" :rfid="dialogRfid" />
    </div>
  </v-app>
</template>

<script>
import DialogRegister from "../components/dialogs/DialogRegister.vue";
export default {
  name: "Manager",
  data() {
    return {
      dialogRfid: "",
      rfid: "",
      updateRfid: "",
      newRoadNameNumber: "",
      newRoadName: "",
      newRoadNumber: "",
      name: "",
      number: "",
      foundRs: null,
      registerDialog: false,
    };
  },
  components: {
    DialogRegister,
  },
  computed: {
    rsRfid() {
      return this.$store.state.rsRfid
    },
    connStatus() {
      return this.$store.state.connStatus
    },
  },
  methods: {
    async dialogRegister(rfid) {
      console.log(rfid);
      this.registerDialog = true;
      this.dialogRfid = rfid;
    },
  },
};
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
