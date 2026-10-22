<template>
  <div class="xx">
    <h1>About Model Railroad Operations Manager</h1>
    <h3>Version 1.1.2</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) MROM
      Application is one of several single page applications (SPAs) in the RAILS
      family of applications. It uses MongoDB, Vue 3, Vuetify and Node to
      construct the SPA. MROM provides a user with a web SPA to assist in the management
      of modeled railroad operations, such as consists, AAR codes,
      structures, images, and companies.
    </p>
    <p>The user guide is available TBD</p>
    <br />
    <hr />
    <p>The database has the following number of documents:</p>
    <li>Rollingstock: {{ rsStore.RS_COUNT }}</li>
    <li>AAR Codes: {{ aarCodesStore.AARCODES_COUNT }}</li>
    <li>Structures: {{ structuresStore.STRUCTURES_COUNT }}</li>
    <li>Companies: {{ companiesStore.COMPANIES_COUNT }}</li>
    <li>Consists: {{ consistsStore.CONSISTS_COUNT }}</li>

  </div>
</template>

<script setup>
import { useConsistsStore } from "@/stores/consists";
import { useRSStore } from "@/stores/rs";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useStructuresStore } from "@/stores/structures";
import { useCompaniesStore } from "@/stores/companies";

const rsStore = useRSStore();
const aarCodesStore = useAarCodesStore();
const structuresStore = useStructuresStore();
const companiesStore = useCompaniesStore();
const consistsStore = useConsistsStore();
</script>
