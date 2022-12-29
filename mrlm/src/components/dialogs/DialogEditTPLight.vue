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
<script>
export default {
    name: "DialogEditTPLight",
    props: ["tplight"],
    data: () => ({
        turnout: "",
        tplNum: "",
        controller: "",
        panelName: "",
        panelNum: "",
        to_id: "",
        error: "",
    }),
    computed: {
        tpLightEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        console.log(this.tplight)
        this.turnout = this.tplight.turnout;
        this.tplNum = this.tplight.tplNum;
        this.controller = this.tplight.controller;
        this.panelName = this.tplight.panelName;
        this.panelNum = this.tplight.panelNum;
        this.to_id = this.tplight.to_id;
        this._id = this.tplight._id;
    },
    methods: {
        editTPLight() {
            let updatedTPLight = {
                _id: this._id,
                controller: this.controller,
                panelName: this.panelName,
                panelNum: this.panelNum,
                to_id: this.to_id,
                tplNum: this.tplNum,
            };
            this.$store.dispatch("updateTplight", updatedTPLight);
            this.$emit("closeEditTPLightDialog");
        },
    },
};
</script>