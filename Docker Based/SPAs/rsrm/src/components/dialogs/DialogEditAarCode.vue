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

<script setup>
import { ref, onMounted } from "vue";
import { useAarCodesStore } from "@/stores/aarCodes";

const props = defineProps({
  aarCode: {
    type: Object,
    required: true,
  },
});
const AarCode = ref("");
const rsType = ref("");
const description = ref("");
const id = ref("");
const aarCodeEditDataInvalid = ref(false);
const aarCodeStore = useAarCodesStore();
const emit = defineEmits(["closeEditAarCodeDialog"]);

const editAarCode = () => {
  aarCodeStore.UPDATE_AARCODE({
    _id: id.value,
    aarCode: AarCode.value,
    rollingstockType: rsType.value,
    description: description.value,
  });
  emit("closeEditAarCodeDialog");
};
onMounted(() => {
  id.value = props.aarCode._id;
  AarCode.value = props.aarCode.aarCode;
  rsType.value = props.aarCode.rollingstockType;
  description.value = props.aarCode.description;
});
</script>