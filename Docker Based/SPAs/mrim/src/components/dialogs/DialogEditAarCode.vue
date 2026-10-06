<template>
  <v-card width="800">
    <v-card-title class="headline">AAR Code</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="AarCode" label="AAR Code" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="rsType" label="RS Type" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="description" label="Description" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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