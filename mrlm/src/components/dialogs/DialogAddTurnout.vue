<template>
    <v-card width="400">
        <v-card-title class="headline"> New Turnout </v-card-title>
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
            <v-btn @click="$emit('closeAddTurnoutDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="turnoutAddDataInvalid" @click="addTurnout" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, computed } from "vue";
import { useTurnoutsStore } from "@/stores/turnouts";

const turnoutsStore = useTurnoutsStore();
const toID = ref("");
const controller = ref("");
const toNum = ref("");
const type = ref("");
const lastUpdate = ref("");
const state = ref("");
const lock = ref("");
const toLoc = ref("");
const notes = ref("");
const emit = defineEmits(["closeAddTurnoutDialog"]);
const turnoutAddDataInvalid = computed(() => {
    if ((toID.value !== "" && controller.value !== "" && toNum.value !== "") ) {
        return false;
    } else {
        return true;
    }
});
const addTurnout = () => {
    turnoutsStore.ADD_NEW_TURNOUT({
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
    emit("closeAddTurnoutDialog");
};
</script>