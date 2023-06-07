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
                <tr v-for="item in tplightsStore.TO_TPLIGHTS" :key="item.id">
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

<script setup>
import { ref } from "vue";
import DialogEditTPLight from "@/components/dialogs/DialogEditTPLight.vue";
import DialogDeleteTPLight from "@/components/dialogs/DialogDeleteTPLight.vue";
import DialogAddTPLight from "@/components/dialogs/DialogAddTPLight.vue";
import { useTplightsStore } from "@/stores/tplights";
import { useTurnoutsStore } from "@/stores/turnouts";

const turnoutsStore = useTurnoutsStore();
const tplightsStore = useTplightsStore();
const tplghts = ref([])
const editableTPLight = ref(null);
const editTPLightDialog = ref(false);
const deleteTPLightDialog = ref(false);
const addTPLightDialog = ref(false);
const addTPLight = () => {
    addTPLightDialog.value = true;
};
const deleteTPLight = (item) => {
    editableTPLight.value = item;
    deleteTPLightDialog.value = true;
};
const editTPLight = (item) => {
    editableTPLight.value = item;
    editTPLightDialog.value = true;
};
</script>