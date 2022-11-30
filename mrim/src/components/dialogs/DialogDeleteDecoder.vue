<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Decoder? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ decoderLoco.roadName }} {{ decoderLoco.roadNumber }}</strong>'s decoder?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteDecoderDialog')" text> No </v-btn>
      <v-btn @click="deleteDecoder(decoderLoco._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogDeleteDecoder",
  props: ["decoderLoco"],
  methods: {
    deleteDecoder(id) {
      this.$store.dispatch("deleteDecoder", id);
      this.$emit("closeDeleteDecoderDialog");
    },
  },
};
</script>
