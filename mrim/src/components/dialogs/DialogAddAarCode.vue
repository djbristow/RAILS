<template>
  <v-card width="400">
    <v-card-title class="headline"> New AAR Code </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="aarCode" label="AAR Code"></v-text-field>
        <v-text-field v-model="rollingstockType" label="RS Type"></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddAarCodeDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="aarCodeAddDataInvalid" @click="addAarCode" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogAddAarCode",
  data: () => ({
    aarCode: "",
    rollingstockType: "",
    description: "",
  }),
  computed: {
    aarCodeAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addAarCode() {
      this.$store.dispatch("addNewAarCode", {
        aarCode: this.aarCode,
        rollingstockType: this.rollingstockType,
        description: this.description,
      });
      this.$emit("closeAddAarCodeDialog");
    },
  },
};
</script>