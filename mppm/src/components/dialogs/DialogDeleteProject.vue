<template>
    <v-card width="400">
      <v-card-title class="headline"> Delete MR Project? </v-card-title>
      <v-card-actions>
        <v-card-text>Are you sure you want to delete <strong>{{ project.title }}</strong>?</v-card-text>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDeleteProjectDialog')" text> No </v-btn>
        <v-btn @click="deleteProject(project._id)" color="red darken-1" text>
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  <script>
  export default {
    name: "DialogDeleteProject",
    props: ["project"],
    methods: {
      deleteProject(id) {
        this.$store.dispatch("deleteProject", id);
        this.$emit("closeDeleteProjectDialog");
      },
    },
  };
  </script>