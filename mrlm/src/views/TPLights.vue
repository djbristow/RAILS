<template>
    <div class="xx">
        <h1>Turnout Panel Lights</h1>
        <v-btn @click="addTPLight()" width="250">Add Turnout Panel Light</v-btn>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left">Turnout</th>
                    <th class="text-left">Panel Number</th>
                    <th class="text-left">Panel Name</th>
                    <th class="text-left">Controller</th>
                    <th class="text-left">TPL Number</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tplights" :key="item.id">
                    <td>{{ item.turnout }}</td>
                    <td>{{ item.panelNum }}</td>
                    <td>{{ item.panelName }}</td>
                    <td>{{ item.controller }}</td>
                    <td>{{ item.tplNum }}</td>
                    <td>
                        <div v-if="item.color === 'green'">
                            <v-icon color="green darken-1">mdi-circle</v-icon>
                        </div>
                        <div v-else-if="item.color === 'red'">
                            <v-icon color="red darken-1">mdi-circle</v-icon>
                        </div>
                        <div v-else>
                            <v-icon color="blue darken-1">mdi-circle</v-icon>
                        </div>
                    </td>
                    <td>
                        <v-icon color="blue darken-1" @click="editTPLight(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="red darken-1" @click="deleteTPLight(item)">mdi-delete</v-icon>
                    </td>
                </tr>
            </tbody>
            <v-dialog v-model="editTPLightDialog">
                <dialog-edit-t-p-light :tplight="editableTPLight" @closeEditTPLightDialog="editTPLightDialog = false" />
            </v-dialog>
            <v-dialog v-model="deleteTPLightDialog">
                <dialog-delete-t-p-light :tplight="editableTPLight"
                    @closeDeleteTPLightDialog="deleteTPLightDialog = false" />
            </v-dialog>
            <v-dialog v-model="addTPLightDialog">
                <dialog-add-t-p-light @closeAddTPLightDialog="addTPLightDialog = false" />
            </v-dialog>
        </v-table>
        <br />
    </div>
</template>

<script>
import DialogEditTPLight from "../components/dialogs/DialogEditTPLight.vue";
import DialogDeleteTPLight from "../components/dialogs/DialogDeleteTPLight.vue";
import DialogAddTPLight from "../components/dialogs/DialogAddTPLight.vue";
export default {
    components: {
        DialogEditTPLight,
        DialogDeleteTPLight,
        DialogAddTPLight,
    },
    data: () => ({
        editTPLightDialog: false,
        deleteTPLightDialog: false,
        addTPLightDialog: false,
        editableTPLight: null,
    }),
    computed: {
        tplights() {
            class TPLight {
                constructor(_id, turnout, panelNum, panelName, controller, tplNum, color, to_id) {
                    this._id = _id;
                    this.turnout = turnout;
                    this.panelNum = panelNum;
                    this.panelName = panelName;
                    this.controller = controller;
                    this.tplNum = tplNum;
                    this.color = color;
                    this.to_id = to_id
                }
            }
            let lights = this.$store.state.tplights;
            let tplights = [];
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];
                let color = "";
                let to = this.$store.getters['getTurnoutBy_Id'](light.to_id);
                if (to.lock !== "") {
                    color = "red";
                } else {
                    if (to.state === "CLOSED") {
                        color = "green";
                    } else {
                        color = "blue";
                    }
                }
                let tplight = new TPLight(
                    light._id,
                    to.toID,
                    light.panelNum,
                    light.panelName,
                    light.controller,
                    light.tplNum,
                    color,
                    to._id
                );
                tplights.push(tplight);
            }
            return tplights;
        },
    },
    methods: {
        addTPLight() {
            this.addTPLightDialog = true;
        },
        deleteTPLight(item) {
            this.editableTPLight = item;
            this.deleteTPLightDialog = true;
        },
        editTPLight(item) {
            this.editableTPLight = item;
            this.editTPLightDialog = true;
        },
    },
};
</script>