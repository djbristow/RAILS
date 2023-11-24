<template>
    <v-card width="400">
        <v-card-title class="headline"> New MR Company </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field v-model="name" label="Name"></v-text-field>
                <v-text-field v-model="type" label="Type"></v-text-field>
                <v-text-field v-model="website" label="Website"></v-text-field>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="phone" label="Phone"></v-text-field>
                <v-text-field v-model="address" label="Address"></v-text-field>
                <v-textarea v-model="notes" label="Notes"></v-textarea>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeAddMrCompanyDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="mrCompanyAddDataInvalid" @click="addMrCompany" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useMrcosStore } from "@/stores/mrcos";
const mrcosStore = useMrcosStore();
const name = ref("");
const type = ref("");
const website = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");
const notes = ref("");
const mrCompanyAddDataInvalid = ref(false);
const addMrCompany = () => {
    mrcosStore.ADD_MRCO({
        name: name.value,
        type: type.value,
        website: website.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        notes: notes.value,
    });
    emit("closeAddMrCompanyDialog");
};
</script>