<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete MR Project? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete <strong>{{ project.title }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteProjectDialog')" text> No </v-btn>
      <v-btn @click="deleteProject(project._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useProjectsStore } from "@/stores/projects";
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
const projectsStore = useProjectsStore();
const deleteProject = (id) => {
  projectsStore.DELETE_PROJECT(id);
  emit("closeDeleteProjectDialog");
};
</script>
