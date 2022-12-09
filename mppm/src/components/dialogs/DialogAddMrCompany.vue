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
<script>
export default {
    name: "DialogAddMrCompany",
    data: () => ({
        name: "",
        type: "",
        website: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
    }),
    computed: {
        mrCompanyAddDataInvalid() {
            let result = false;
            return result;
        },
    },
    methods: {
        addMrCompany() {
            this.$store.dispatch("addNewMrco", {
                name: this.name,
                type: this.type,
                website: this.website,
                email: this.email,
                phone: this.phone,
                address: this.address,
                notes: this.notes,
            });
            this.$emit("closeAddMrCompanyDialog");
        },
    },
};
</script>