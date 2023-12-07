<template>
  <v-card width="400">
    <v-card-title class="headline"> Rollingstock Registration </v-card-title>
    <v-card-text>RFID Tag {{ rfid }}</v-card-text>
    <v-card-text>
      <v-container>
        <v-text-field
          v-model="roadname"
          label="Road Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="roadnumber"
          label="Road Number"
          required
        ></v-text-field>
      </v-container>
      <v-container v-if="newrs">
        <div class="red--text mb-8">
          Rollingstock {{ roadname }} {{ roadnumber }} is not in the inventory
        </div>
        <v-text-field
          v-model="aarcode"
          label="AAR Code"
          required
        ></v-text-field>
        <v-text-field v-model="color" label="Color" required></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="cancelUpdateRs" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsDataInvalid" @click="checkUpdateRs" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed} from "vue";
import { useRSStore } from "@/stores/rs";

const newrfid = ref("");
const newrs = ref(false);
const roadname = ref("");
const roadnumber = ref("");
const namenumber = ref("");
const aarcode = ref("");
const color = ref("");
const new_rs = ref({
  aarCode: "",
  color: "",
  roadName: "",
  roadNumber: "",
  rfid: "",
  _id: "",
});
const props = defineProps({
  rfid: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["closeRegisterDialog"]);
const rsStore = useRSStore();

const rsDataInvalid = computed(() => {
  let result = true;
  if (!newrs.value) {
    if (roadnumber.value !== "" && roadname.value !== "") {
      result = false;
    }
  } else {
    if (aarcode.value !== "" && color.value !== "") {
      result = false;
    }
  }
  return result;
});
const cancelUpdateRs = () => {
  emit("closeRegisterDialog");
};
const checkUpdateRs = () => {
  new_rs.value.rfid = props.rfid;
  new_rs.value.roadName = roadname.value;
  new_rs.value.roadNumber = roadnumber.value;
  if (newrs.value) {
    new_rs.value.color = color.value;
    new_rs.value.aarCode = aarcode.value;
    rsStore.ADD_NEW_RS_RFID(new_rs.value);
    emit("closeRegisterDialog");
  } else {
    namenumber.value = roadname.value + "-" + roadnumber.value;
    let rsFound = rsStore.CHECK_ROAD_NAME_NUMBER(namenumber.value);
    if (rsFound === undefined) {
      newrs.value = true;
    } else {
      new_rs.value.aarCode = rsFound.aarCode;
      new_rs.value.color = rsFound.color;
      new_rs.value._id = rsFound._id;
      rsStore.UPDATE_RS_RFID(new_rs.value);
      emit("closeRegisterDialog");
    }
  }
};
</script>
