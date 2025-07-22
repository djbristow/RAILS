<template>
    <v-card width="800">
        <v-card-title class="headline"> Edit Turnout </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field v-model="toID" label="ID"></v-text-field>
                <v-text-field v-model="controller" label="Controller"></v-text-field>
                <v-text-field v-model="toNum" label="Number"></v-text-field>
                <v-text-field v-model="type" label="Type"></v-text-field>
                <v-text-field v-model="lastUpdate" label="Last Update"></v-text-field>
                <v-text-field v-model="state" label="State"></v-text-field>
                <v-text-field v-model="lock" label="Lock"></v-text-field>
                <v-text-field v-model="toLoc" label="Location"></v-text-field>
                <v-textarea v-model="notes" label="Notes"></v-textarea>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeEditTurnoutDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="turnoutEditDataInvalid" @click="editTurnout" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useTurnoutsStore } from "@/stores/turnouts";

const emit = defineEmits(["closeEditTurnoutDialog"]);

const props = defineProps({
    turnout: {
        type: Object,
        required: true,
    },
});
const turnoutStore = useTurnoutsStore();
const turnoutEditDataInvalid = ref(false);
const _id = ref("");
const toID = ref("");
const controller = ref("");
const toNum = ref("");
const type = ref("");
const lastUpdate = ref("");
const state = ref("");
const lock = ref("");
const toLoc = ref("");
const notes = ref("");
const editTurnout = () => {
    turnoutStore.UPDATE_TURNOUT({
        _id: _id.value,
        toID: toID.value,
        controller: controller.value,
        toNum: toNum.value,
        type: type.value,
        lastUpdate: lastUpdate.value,
        state: state.value,
        lock: lock.value,
        toLoc: toLoc.value,
        notes: notes.value,
    });
    emit("closeEditTurnoutDialog");
};
onMounted(() => {
    _id.value = props.turnout._id;
    toID.value = props.turnout.toID;
    controller.value = props.turnout.controller;
    toNum.value = props.turnout.toNum;
    type.value = props.turnout.type;
    lastUpdate.value = props.turnout.lastUpdate;
    state.value = props.turnout.state;
    lock.value = props.turnout.lock;
    toLoc.value = props.turnout.toLoc;
    notes.value = props.turnout.notes;
});
</script>