<template>
    <v-card width="800">
        <v-card-title class="headline"> Edit Turnout </v-card-title>
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
            <v-btn @click="$emit('closeEditTurnoutDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="turnoutEditDataInvalid" @click="editTurnout" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogEditTurnout",
    props: ["turnout"],
    data: () => ({
        toID: "",
        controller: "",
        toNum: "",
        type: "",
        lastUpdate: "",
        state: "",
        lock: "",
        toLoc: "",
        notes: "",
    }),
    computed: {
        turnoutEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        this.toID = this.turnout.toID;
        this.controller = this.turnout.controller;
        this.toNum = this.turnout.toNum;
        this.type = this.turnout.type;
        this.lastUpdate = this.turnout.lastUpdate;
        this.state = this.turnout.state;
        this.lock = this.turnout.lock;
        this.toLoc = this.turnout.toLoc;
        this.notes = this.turnout.notes;
    },
    methods: {
        editTurnout() {
            let updatedTurnout = {
                _id: this.turnout._id,
                toID: this.toID,
                controller: this.controller,
                toNum: this.toNum,
                type: this.type,
                lastUpdate: this.lastUpdate,
                state: this.state,
                lock: this.lock,
                toLoc: this.toLoc,
                notes: this.notes,
            };
            this.$store.dispatch("updateTurnout", updatedTurnout);
            this.$emit("closeEditTurnoutDialog");
        },
    },
};
</script>