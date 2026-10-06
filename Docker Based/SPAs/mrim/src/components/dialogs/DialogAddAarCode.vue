<template>
  <v-card width="400">
    <v-card-title class="headline">New AAR Code</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="aarCode" label="AAR Code" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="rollingstockType" label="RS Type" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="description" label="Description" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('closeAddAarCodeDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="aarCodeAddDataInvalid" @click="addAarCode" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useAarCodesStore } from "@/stores/aarCodes";

const aarCode = ref('');
const rollingstockType = ref('');
const description = ref('');
const aarCodeAddDataInvalid = ref(false);
const aarCodeStore = useAarCodesStore();
const emit = defineEmits(['closeAddAarCodeDialog']);

const addAarCode = () => {
  aarCodeStore.ADD_NEW_AARCODE({
    aarCode: aarCode.value,
    rollingstockType: rollingstockType.value,
    description: description.value,
  });
  emit('closeAddAarCodeDialog');
}
</script>