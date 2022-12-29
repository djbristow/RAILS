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
<script>
export default {
    name: "DialogAddMicroContlr",
    data: () => ({
        microID: "",
        microIP: "",
        purpose: "",
        et: "",
        status: "",
    }),
    computed: {
        microContlrAddDataInvalid() {
            if (this.microID !== "" && this.microIP !== "") {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        addMicroContlr() {
            this.$store.dispatch("addNewMicro", {
                microID: this.microID,
                microIP: this.microIP,
                purpose: this.purpose,
                et: this.et,
                status: this.status,
            });
            this.$emit("closeAddMicroContlrDialog");
        },
    },
};
</script>