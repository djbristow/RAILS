<template>
    <v-card width="800">
        <v-card-title class="headline"> MR Company </v-card-title>
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
            <v-btn @click="$emit('closeEditMrCompanyDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="mrCompanyEditDataInvalid" @click="editMrCompany" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useMrcosStore } from "@/stores/mrcos";
const props = defineProps({
    mrco: {
        type: Object,
        required: true,
    },
});
const mrcosStore = useMrcosStore();
const mrCompanyEditDataInvalid = ref(false);
const name = ref("");
const type = ref("");
const website = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");
const notes = ref("");
onMounted(() => {
    name.value = props.mrco.name;
    type.value = props.mrco.type;
    website.value = props.mrco.website;
    email.value = props.mrco.email;
    phone.value = props.mrco.phone;
    address.value = props.mrco.address;
    notes.value = props.mrco.notes;
});
const editMrCompany = () => {
    let updatedMrCompany = {
        _id: props.mrco._id,
        name: name.value,
        type: type.value,
        website: website.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        notes: notes.value,
    };
    mrcosStore.UPDATE_MRCO(updatedMrCompany);
    emit("closeEditMrCompanyDialog");
};
</script>