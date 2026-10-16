<template>
    <v-app class="xx">
        <v-container>
            <v-card>
                <v-card-title> Consists</v-card-title>
                <v-card-actions>
                    <v-btn @click="addConsist()">New Consist</v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" single-line
                        hide-details class="mb-4" />
                    <v-data-table :headers="headers" :items="consistsStore.consists" :search="search" item-key="item.id"
                        density="compact">
                        <template v-slot:item.actions="{ item }">
                            <v-icon color="blue darken-1" @click="editConsist(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon color="red darken-1" @click="deleteConsist(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-dialog v-model="editConsistDialog">
                    <dialog-edit-consist :consist="editableConsist"
                        @closeEditConsistDialog="editConsistDialog = false" />
                </v-dialog>
                <v-dialog v-model="deleteConsistDialog">
                    <dialog-delete-consist :consist="editableConsist"
                        @closeDeleteConsistDialog="deleteConsistDialog = false" />
                </v-dialog>
                <v-dialog v-model="addConsistDialog">
                    <dialog-add-consist @closeAddConsistDialog="addConsistDialog = false" />
                </v-dialog>
            </v-card>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogAddConsist from "@/components/dialogs/DialogAddConsist.vue";
import DialogDeleteConsist from "@/components/dialogs/DialogDeleteConsist.vue";
import DialogEditConsist from "@/components/dialogs/DialogEditConsist.vue";
import { useConsistsStore, } from "@/stores/consists";
const deleteConsistDialog = ref(false);
const editConsistDialog = ref(false);
const editableConsist = ref(null);

const headers = [
    { title: "Consist", key: "name" },
    { title: "Train Number", key: "trainNumber" },
    { title: "Type", key: "type" },
    { title: "Cars", key: "carCount" },
    { title: "Notes", key: "notes" },
    { title: "Actions", key: "actions" },
];

const addConsistDialog = ref(false);

const addConsist = () => {
    addConsistDialog.value = true;
};

const consistsStore = useConsistsStore();
const search = ref("");


const editConsist = (item) => {
    editableConsist.value = item;
    editConsistDialog.value = true;
};

const deleteConsist = (item) => {
    editableConsist.value = item;
    deleteConsistDialog.value = true;
};

</script>