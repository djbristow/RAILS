<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Turnouts</v-card-title>
        <v-card-actions>
          <v-btn @click="addTurnout()" width="200">Add Turnout</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="turnoutsStore.turnouts"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.lastUpdate="{ item }">
            {{ formatDate(item.lastUpdate) }}
          </template>
          <template v-slot:item.lock="{ item }">
            <div v-if="item.lock !== ''">
              <v-icon color="red darken-1"> mdi-lock </v-icon>
            </div>
            <div v-else>
              <div v-if="item.state === 'CLOSED'">
                <v-icon @click="throwTo(item)">
                  mdi-electric-switch-closed</v-icon
                >
              </div>
              <div v-else>
                <v-icon @click="closeTo(item)">mdi-electric-switch</v-icon>
              </div>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editTurnout(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteTurnout(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editTurnoutDialog">
          <dialog-edit-turnout
            :turnout="editableTurnout"
            @closeEditTurnoutDialog="editTurnoutDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteTurnoutDialog">
          <dialog-delete-turnout
            :turnout="editableTurnout"
            @closeDeleteTurnoutDialog="deleteTurnoutDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addTurnoutDialog">
          <dialog-add-turnout
            @closeAddTurnoutDialog="addTurnoutDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditTurnout from "@/components/dialogs/DialogEditTurnout.vue";
import DialogDeleteTurnout from "@/components/dialogs/DialogDeleteTurnout.vue";
import DialogAddTurnout from "@/components/dialogs/DialogAddTurnout.vue";
import moment from "moment";
import { useTurnoutsStore } from "@/stores/turnouts";

const turnoutsStore = useTurnoutsStore();
import RlService from "@/services/RlService";
const editTurnoutDialog = ref(false);
const deleteTurnoutDialog = ref(false);
const addTurnoutDialog = ref(false);
const editableTurnout = ref(null);
const headers = [
  { title: "ID", key: "toID" },
  { title: "Controller", key: "controller" },
  { title: "Number", key: "toNum" },
  { title: "Type", key: "type" },
  { title: "Last Update", key: "lastUpdate" },
  { title: "State", key: "state" },
  { title: "Points", key: "lock" },
  { title: "Actions", key: "actions" },
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
const addTurnout = () => {
  addTurnoutDialog.value = true;
};
const deleteTurnout = (item) => {
  editableTurnout.value = item;
  deleteTurnoutDialog.value = true;
};
const editTurnout = (item) => {
  editableTurnout.value = item;
  editTurnoutDialog.value = true;
};
const throwTo = async (item) => {
  item.lock = "MRLM";
  turnoutsStore.UPDATE_TURNOUT(item);
  pubToMsg(item.toID, "THROW");
  pubLightMsg(item);
};
const closeTo = async (item) => {
  item.lock = "MRLM";
  turnoutsStore.UPDATE_TURNOUT(item);
  pubToMsg(item.toID, "CLOSE");
  pubLightMsg(item);
};
const pubToMsg = async (id, cmd) => {
  const turnout = turnoutsStore.GET_TURNOUT_BY_ID(id);
  const msg = {
    topic: turnout.controller,
    to: turnout.toNum,
    cmd: cmd,
  };
  console.log(msg);
  await RlService.postToMsg(msg);
};
const pubLightMsg = (item) => {
  let tpl = turnoutsStore.GET_TURNOUT(item._id);
  console.log(tpl);
  if (tpl !== null) {
    const msg = {
      topic: tpl.controller,
      tplNum: tpl.tplNum,
      cmd: item.state,
    };
    console.log(msg);
    RlService.postTplMsg(msg);
  }
};
</script>
