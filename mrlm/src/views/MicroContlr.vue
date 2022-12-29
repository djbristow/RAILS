<template>
    <div class="xx">
        <h1>Micro Controllers</h1>
        <v-btn @click="addMicroContlr()" width="200">Add Micro Controller</v-btn>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">IP</th>
                    <th class="text-left">Purpose</th>
                    <th class="text-left">Last Update</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in micros" :key="item.id">
                    <td>{{ item.microID }}</td>
                    <td>{{ item.microIP }}</td>
                    <td>{{ item.purpose }}</td>
                    <td>{{ item.et }}</td>
                    <td>
                        <div v-if="item.status === 'Up'">
                            <v-icon color="green">mdi-server</v-icon>
                        </div>
                        <div v-else-if="item.status === 'Down'">
                            <v-icon color="red">mdi-server </v-icon>
                        </div>
                        <div v-else>
                            <v-icon color="yellow">mdi-server </v-icon>
                        </div>
                    </td>
                    <td>
                        <v-icon color="blue darken-1" @click="editMicroContlr(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="red darken-1" @click="deleteMicroContlr(item)">mdi-delete</v-icon>
                    </td>
                </tr>
            </tbody>
            <v-dialog v-model="editMicroContlrDialog">
                <dialog-edit-micro-contlr :micro="editableMicroContlr"
                    @closeEditMicroContlrDialog="editMicroContlrDialog = false" />
            </v-dialog>
            <v-dialog v-model="deleteMicroContlrDialog">
                <dialog-delete-micro-contlr :micro="editableMicroContlr"
                    @closeDeleteMicroContlrDialog="deleteMicroContlrDialog = false" />
            </v-dialog>
            <v-dialog v-model="addMicroContlrDialog">
                <dialog-add-micro-contlr @closeAddMicroContlrDialog="addMicroContlrDialog = false" />
            </v-dialog>
        </v-table>
        <br />
    </div>
</template>

<script>
import DialogEditMicroContlr from "../components/dialogs/DialogEditMicroContlr.vue";
import DialogDeleteMicroContlr from "../components/dialogs/DialogDeleteMicroContlr.vue";
import DialogAddMicroContlr from "../components/dialogs/DialogAddMicroContlr.vue";
export default {
    components: {
        DialogEditMicroContlr,
        DialogDeleteMicroContlr,
        DialogAddMicroContlr,
    },
    data: () => ({
        editMicroContlrDialog: false,
        deleteMicroContlrDialog: false,
        addMicroContlrDialog: false,
        editableMicroContlr: null,
    }),
    computed: {
        micros() {
            return this.$store.state.micros;
        },
    },
    methods: {
        addMicroContlr() {
            this.addMicroContlrDialog = true;
        },
        deleteMicroContlr(item) {
            this.editableMicroContlr = item;
            this.deleteMicroContlrDialog = true;
        },
        editMicroContlr(item) {
            this.editableMicroContlr = item;
            this.editMicroContlrDialog = true;
        },
    },
};
</script>