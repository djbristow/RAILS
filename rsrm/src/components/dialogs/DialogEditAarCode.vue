<template>
  <v-card width="800">
    <v-card-title class="headline"> AAR Code </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="AarCode" label="AAR Code"></v-text-field>
        <v-text-field v-model="rsType" label="RS Type"></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditAarCodeDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="aarCodeEditDataInvalid" @click="editAarCode" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogEditAarCode",
  props: ["aarCode"],
  data: () => ({
    AarCode: "",
    rsType: "",
    description: "",
  }),
  computed: {
    aarCodeEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
    this.AarCode = this.aarCode.aarCode;
    this.rsType = this.aarCode.rollingstockType;
    this.description = this.aarCode.description;
  },
  methods: {
    editAarCode() {
      let updatedAarCode = {
        _id: this.aarCode._id,
        aarCode: this.AarCode,
        rollingstockType: this.rsType,
        description: this.description,
      };
      this.$store.dispatch("updateAarCode", updatedAarCode);
      this.$emit("closeEditAarCodeDialog");
    },
  },
};
</script>