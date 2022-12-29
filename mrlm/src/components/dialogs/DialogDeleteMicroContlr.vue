<template>
    <v-card width="400">
      <v-card-title class="headline"> Delete Micro Controller? </v-card-title>
      <v-card-actions>
        <v-card-text>Are you sure you want to delete <strong>{{ micro.microID }}</strong>?</v-card-text>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDeleteMicroContlrDialog')" text> No </v-btn>
        <v-btn @click="deleteMicroContlr(micro)" color="red darken-1" text>
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  <script>
  export default {
    name: "DialogDeleteMicroContlr",
    props: ["micro"],
    methods: {
      deleteMicroContlr(id) {
        this.$store.dispatch("deleteMicro", id);
        this.$emit("closeDeleteMicroContlrDialog");
      },
    },
  };
  </script>