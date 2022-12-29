<template>
    <v-card width="400">
        <v-card-title class="headline"> New Turnout Panel Light </v-card-title>
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
            <div v-if="error" class="error">{{ error }}</div>
            <v-btn @click="$emit('closeAddTPLightDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="tpLightAddDataInvalid" @click="addTPLight" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogAddTPLight",
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
        tpLightAddDataInvalid() {
            if ((this.turnout !== "" && this.controller !== "" && this.tplNum !== "") || this.error){
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        addTPLight() {
            let to = this.$store.getters['getTurnoutById'](this.turnout);
            if (to == undefined) {
                this.error = "Turnout not found";
                return;
            } else {
                this.to_id = to._id;
                this.$store.dispatch("addNewTplight", {
                    to_id: this.to_id,
                    tplNum: this.tplNum,
                    controller: this.controller,
                    panelName: this.panelName,
                    panelNum: this.panelNum,
                });
                this.$emit("closeAddTPLightDialog");
            }
        },
    },
};
</script>