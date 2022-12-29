<template>
    <v-card width="400">
      <v-card-title class="headline"> Delete Turnout Panel Light? </v-card-title>
      <v-card-actions>
        <v-card-text>Are you sure you want to delete <strong>{{ tplight.microID }}</strong>?</v-card-text>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDeleteTPLightDialog')" text> No </v-btn>
        <v-btn @click="deleteTPLight(tplight)" color="red darken-1" text>
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  <script>
  export default {
    name: "DialogDeleteTPLight",
    props: ["tplight"],
    methods: {
      deleteTPLight(id) {
        this.$store.dispatch("deleteMicro", id);
        this.$emit("closeDeleteTPLightDialog");
      },
    },
  };
  </script>