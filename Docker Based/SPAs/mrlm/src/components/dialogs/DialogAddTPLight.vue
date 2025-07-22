<template>
    <v-card width="400">
        <v-card-title class="headline"> New Turnout Panel Light </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field v-model="turnout" label="Turnout"></v-text-field>
                <v-text-field v-model="panelName" label="Panel Name"></v-text-field>
                <v-text-field v-model="panelNum" label="Panel Number"></v-text-field>
                <v-text-field v-model="controller" label="Controller"></v-text-field>
                <v-text-field v-model="tplNum" label="TPL Number"></v-text-field>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <div v-if="error" class="error">{{ error }}</div>
            <v-btn @click="$emit('closeAddTPLightDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="tpLightAddDataInvalid" @click="addTPLight" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, computed } from "vue";
import { useTurnoutsStore } from "@/stores/turnouts";
import { useTplightsStore } from "@/stores/tplights";
const turnoutsStore = useTurnoutsStore();
const tplightsStore = useTplightsStore();
const turnout = ref("");
const tplNum = ref("");
const controller = ref("");
const panelName = ref("");
const panelNum = ref("");
const error = ref("");

const emit = defineEmits(["closeAddTPLightDialog"]);

const tpLightAddDataInvalid = computed(() => {
    if ((turnout.value !== "" && controller.value !== "" && tplNum.value !== "") || error.value) {
        return false;
    } else {
        return true;
    }
});
const addTPLight = () => {
    let to = turnoutsStore.GET_TURNOUT_BY_ID(turnout.value);
    if (to == undefined) {
        error.value = "Turnout not found";
        return;
    } else {
        tplightsStore.ADD_NEW_TPLIGHT({
            to_id: to._id,
            tplNum: tplNum.value,
            controller: controller.value,
            panelName: panelName.value,
            panelNum: panelNum.value,
        });
        emit("closeAddTPLightDialog");
    }
};
</script>