<template>
    <v-card width="400">
        <v-card-title class="headline"> New Micro Controller </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field v-model="microID" label="Name"></v-text-field>
                <v-text-field v-model="microIP" label="IP"></v-text-field>
                <v-text-field v-model="purpose" label="Purpose"></v-text-field>
                <v-text-field v-model="et" label="Last Update"></v-text-field>
                <v-text-field v-model="status" label="Status"></v-text-field>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeAddMicroContlrDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="microContlrAddDataInvalid" @click="addMicroContlr" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, computed } from "vue";
import { useMicrosStore } from "@/stores/micros";
const microsStore = useMicrosStore();
const microID = ref("");
const microIP = ref("");
const purpose = ref("");
const et = ref("");
const status = ref("");
const emit = defineEmits(["closeAddMicroContlrDialog"]);
const microContlrAddDataInvalid = computed(() => {
    if (microID.value !== "" && microIP.value !== "") {
        return false;
    } else {
        return true;
    }
});
const addMicroContlr = () => {
    microsStore.ADD_NEW_MICRO({
        microID: microID.value,
        microIP: microIP.value,
        purpose: purpose.value,
        et: et.value,
        status: status.value,
    });
    emit("closeAddMicroContlrDialog");
};
</script>