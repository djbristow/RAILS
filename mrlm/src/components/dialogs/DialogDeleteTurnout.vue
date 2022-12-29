<template>
    <v-card width="400">
      <v-card-title class="headline"> Delete Turnout? </v-card-title>
      <v-card-actions>
        <v-card-text>Are you sure you want to delete <strong>{{ turnout.toID }}</strong>?</v-card-text>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDeleteTurnoutDialog')" text> No </v-btn>
        <v-btn @click="deleteTurnout(turnout)" color="red darken-1" text>
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  <script>
  export default {
    name: "DialogDeleteTurnout",
    props: ["turnout"],
    methods: {
      deleteTurnout(turnout) {
        this.$store.dispatch("deleteTurnout", turnout);
        this.$emit("closeDeleteTurnoutDialog");
      },
    },
  };
  </script>