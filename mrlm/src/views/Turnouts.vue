<template>
    <div class="xx">
        <h1>Turnouts</h1>
        <v-btn @click="addTurnout()" width="200">Add Turnout</v-btn>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Controller</th>
                    <th class="text-left">Number</th>
                    <th class="text-left">Type</th>
                    <th class="text-left">Last Update</th>
                    <th class="text-left">State</th>
                    <th class="text-left">Points</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in turnoutsStore.turnouts" :key="item.id">
                    <td>{{ item.toID }}</td>
                    <td>{{ item.controller }}</td>
                    <td>{{ item.toNum }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ formatDate(item.lastUpdate) }}</td>
                    <td>{{ item.state }}</td>
                    <td>
                        <div v-if="item.lock !== ''">
                            <v-icon color="red darken-1">
                            mdi-lock
                        </v-icon>
                        </div>
                        <div v-else>
                            <div v-if="item.state === 'CLOSED'">
                                <v-icon @click="throwTo(item)"> mdi-electric-switch-closed</v-icon>
                            </div>
                            <div v-else>
                                <v-icon @click="closeTo(item)" >mdi-electric-switch</v-icon>
                            </div>
                        </div>
                    </td>
                    <td>
                        <v-icon color="blue darken-1" @click="editTurnout(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="red darken-1" @click="deleteTurnout(item)">mdi-delete</v-icon>
                    </td>
                </tr>
            </tbody>
            <v-dialog v-model="editTurnoutDialog">
                <dialog-edit-turnout :turnout="editableTurnout" @closeEditTurnoutDialog="editTurnoutDialog = false" />
            </v-dialog>
            <v-dialog v-model="deleteTurnoutDialog">
                <dialog-delete-turnout :turnout="editableTurnout"
                    @closeDeleteTurnoutDialog="deleteTurnoutDialog = false" />
            </v-dialog>
            <v-dialog v-model="addTurnoutDialog">
                <dialog-add-turnout @closeAddTurnoutDialog="addTurnoutDialog = false" />
            </v-dialog>
        </v-table>
        <br />
    </div>
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