<template>
  <div class="xx">
    <h1>About Model Project & Purchase Manager</h1>
    <h3>Version 3.0.1</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) Model Railroad Purchases
      and Projects Manager is one of several applications in the RAILS family of applications.
      It uses MongoDB, Vue3, Vuetify and Node to build a single page application that provides
      a user with a web application to show inventories of model railroad companies, purchase
      and projects. The application provides reports on the various elements as well as the
      ability to export and import CSV files.</p>
    <br>
    <p>The user guide is available at: tbd</p>
    <p>Waiting for Vuetify 3.3 to format and paginate tables</p>
    <br>
    <hr>
    <p>The database has the following number of documents:</p>
      <li>Model Railroad Companies: {{ mrcosStore.MRCOS_COUNT }}</li>
      <li>Purchases: {{ purchasesStore.PURCHASES_COUNT }}</li>
      <li>Projects: {{ projectsStore.PROJECTS_COUNT }}</li>
  </div>
</template>

<script setup>
import { usePurchasesStore } from '@/stores/purchases';
import { useProjectsStore } from '@/stores/projects';
import { useMrcosStore } from '@/stores/mrcos';

const purchasesStore = usePurchasesStore();
const projectsStore = useProjectsStore();
const mrcosStore = useMrcosStore();
</script>
