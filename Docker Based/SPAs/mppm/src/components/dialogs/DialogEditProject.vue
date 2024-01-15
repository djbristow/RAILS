<template>
    <v-card width="800">
        <v-card-title class="headline"> MR Project </v-card-title>
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
            <v-btn @click="$emit('closeEditProjectDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="projectEditDataInvalid" @click="editProject" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProjectsStore } from "@/stores/projects";

const props = defineProps({
    project: {
        type: Object,
        required: true,
    },
});
const projectsStore = useProjectsStore();
const projectEditDataInvalid = ref(false);
const title = ref("");
const type = ref("");
const description = ref("");
const priority = ref("");
const startdate = ref(null);
const enddate = ref(null);
const roadname = ref("");
const roadnumbers = ref("");
const notes = ref("");
const emit = defineEmits(["closeEditProjectDialog"]);

onMounted(() => {
    title.value = props.project.title;
    type.value = props.project.type;
    description.value = props.project.description;
    priority.value = props.project.priority;
    startdate.value = props.project.startdate;
    enddate.value = props.project.enddate;
    roadname.value = props.project.roadname;
    roadnumbers.value = props.project.roadnumbers;
    notes.value = props.project.notes;
});
const editProject = () => {
    console.log("editProject");
    let updatedProject = {
        _id: props.project._id,
        title: title.value,
        type: type.value,
        description: description.value,
        priority: priority.value,
        startdate: startdate.value,
        enddate: enddate.value,
        roadname: roadname.value,
        roadnumbers: roadnumbers.value,
        notes: notes.value,
    };
    projectsStore.UPDATE_PROJECT(updatedProject);
    emit("closeEditProjectDialog");
};
</script>