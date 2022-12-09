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
<script>
export default {
    name: "DialogEditMrCompany",
    props: ["mrco"],
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
        mrCompanyEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        this.name = this.mrco.name;
        this.type = this.mrco.type;
        this.website = this.mrco.website;
        this.email = this.mrco.email;
        this.phone = this.mrco.phone;
        this.address = this.mrco.address;
        this.notes = this.mrco.notes;
    },
    methods: {
        editMrCompany() {
            let updatedMrCompany = {
                _id: this.mrco._id,
                name: this.name,
                type: this.type,
                website: this.website,
                email: this.email,
                phone: this.phone,
                address: this.address,
                notes: this.notes,
            };
            this.$store.dispatch("updateMrco", updatedMrCompany);
            this.$emit("closeEditMrCompanyDialog");
        },
    },
};
</script>