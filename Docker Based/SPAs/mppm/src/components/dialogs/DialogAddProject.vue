<template>
    <v-card width="700">
        <v-card-title class="headline"> New MR Project </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field v-model="title" label="Title"></v-text-field>
                    <v-text-field v-model="type" label="Type"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="description" label="Description"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="priority" label="Priority"></v-text-field>
                    <v-text-field v-model="startdate" label="Start"></v-text-field>
                    <v-text-field v-model="enddate" label="End"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="roadname" label="Road Name"></v-text-field>
                    <v-text-field v-model="roadnumbers" label="Road Number"></v-text-field>
                </v-row>
                <v-row>
                    <v-textarea v-model="notes" label="Notes"></v-textarea>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeAddProjectDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="projectAddDataInvalid" @click="addProject" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useProjectsStore } from "@/stores/projects";

const projectsStore = useProjectsStore();
const title = ref("");
const type = ref("");
const description = ref("");
const priority = ref("");
const startdate = ref(null);
const enddate = ref(null);
const roadname = ref("");
const roadnumbers = ref("");
const notes = ref("");
const projectAddDataInvalid = ref(false);
const emit = defineEmits(["closeAddProjectDialog"]);

const addProject = () => {
    const startdateValue = startdate.value ? new Date(startdate.value) : null;
    const enddateValue = enddate.value ? new Date(enddate.value) : null;
    projectsStore.ADD_PROJECT({
        title: title.value,
        type: type.value,
        description: description.value,
        priority: priority.value,
        startdate: startdateValue,
        enddate: enddateValue,
        roadname: roadname.value,
        roadnumbers: roadnumbers.value,
        notes: notes.value,
    });
    emit("closeAddProjectDialog");
};
</script>