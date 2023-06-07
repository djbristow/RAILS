<template>
    <v-card width="900">
      <v-card-title class="headline"> Structure Details </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="5">
            <v-text-field>Title: {{ structure.title }}</v-text-field>
            <v-text-field>Use: {{ structure.structureUse }}</v-text-field>
            <v-text-field>Description: {{ structure.description }}</v-text-field>
            <v-text-field>Owner: {{ structure.owner }}</v-text-field>
            <v-text-field>Location: {{ structure.location }}</v-text-field>
            <v-text-field>Construction: {{ structure.construction }}</v-text-field>
            <v-text-field>Built Date: {{ structure.builtDate }}</v-text-field>
            <v-text-field>Size: {{ structure.size }}</v-text-field>
          </v-col>
          <v-col cols="7">
            <v-img :src='imageServer'/>
          </v-col>
        </v-row>   
        </v-container>
        <v-btn @click="$emit('closeViewStructureDialog')" text> Close </v-btn>
    </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useStructuresStore } from "@/stores/structures";
const props = defineProps({
  structure: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['closeViewStructureDialog']);
const structuresStore = useStructuresStore();
const imageServer = ref("");
onMounted(() => {
  imageServer.value = 'http://' + import.meta.env.VITE_MRFM_TCP_ADDR +':'+ import.meta.env.VITE_MRFM_TCP_PORT +'/'+ props.structure.image;
});
</script>