<template>
    <v-card width="800">
        <v-card-title class="headline"> Edit Micro Controller </v-card-title>
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
            <v-btn @click="$emit('closeEditMicroContlrDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="microContlrEditDataInvalid" @click="editMicroContlr" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogEditMicroContlr",
    props: ["micro"],
    data: () => ({
        microID: "",
        microIP: "",
        purpose: "",
        et: "",
        status: "",
    }),
    computed: {
        microContlrEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        this.microID = this.micro.microID;
        this.microIP = this.micro.microIP;
        this.purpose = this.micro.purpose;
        this.et = this.micro.et;
        this.status = this.micro.status;
    },
    methods: {
        editMicroContlr() {
            let updatedMicroContlr = {
                _id: this.micro._id,
                microID: this.microID,
                microIP: this.microIP,
                purpose: this.purpose,
                et: this.et,
                status: this.status,
            };
            this.$store.dispatch("updateMicro", updatedMicroContlr);
            this.$emit("closeEditMicroContlrDialog");
        },
    },
};
</script>