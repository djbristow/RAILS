<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete AAR Code? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ aarCode.aarCode }}</strong>?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteAarCodeDialog')" text> No </v-btn>
      <v-btn @click="deleteAarCode(aarCode._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogDeleteAarCode",
  props: ["aarCode"],
  methods: {
    deleteAarCode(id) {
      this.$store.dispatch("deleteAarCode", id);
      this.$emit("closeDeleteAarCodeDialog");
    },
  },
};
</script>