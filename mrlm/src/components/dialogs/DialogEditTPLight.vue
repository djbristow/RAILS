<template>
    <v-card width="800">
        <v-card-title class="headline"> Edit Turnout Panel Light </v-card-title>
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
            <v-btn @click="$emit('closeEditTPLightDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="tpLightEditDataInvalid" @click="editTPLight" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useTplightsStore } from "@/stores/tplights";

const props = defineProps({
    tplight: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(["closeEditTPLightDialog"]);
const tplightStore = useTplightsStore();
const _id = ref("");
const to_id = ref("");
const tplNum = ref("");
const controller = ref("");
const panelName = ref("");
const panelNum = ref("");
const editTPLight = (id) => {
    tplightStore.UPDATE_TPLIGHT({
        _id: _id.value,
        to_id: to_id.value,
        tplNum: tplNum.value,
        controller: controller.value,
        panelName: panelName.value,
        panelNum: panelNum.value,
    });
    emit("closeEditTPLightDialog");
};
onMounted(() => {
    _id.value = props.tplight._id;
    to_id.value = props.tplight.to_id;
    tplNum.value = props.tplight.tplNum;
    controller.value = props.tplight.controller;
    panelName.value = props.tplight.panelName;
    panelNum.value = props.tplight.panelNum;
    _id.value = props.tplight._id;
});
const tpLightEditDataInvalid = computed(() => {
    let result = false;
    return result;
});
</script>