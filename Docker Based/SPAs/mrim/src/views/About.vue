<template>
  <div class="xx">
    <h1>About Model Railroad Inventory Manager</h1>
    <h3>Version 4.3.2</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) MRIM
      Application is one of several single page applications (SPAs) in the RAILS
      family of applications. It uses MongoDB, Vue 3, Vuetify and Node to
      construct the SPA. MRIM provides a user with a web SPA to show inventories
      of modeled railroad elements, such as rolling stock, AAR codes,
      structures, images, and companies. Rolling stock has a sub collections of
      locomotives along with DCC decoders. MRIM provides reports on the various
      elements as well as the ability to export and import CSV files.
    </p>
    <p>The user guide is available at: tbd</p>
    <br />
    <hr />
    <p>The database has the following number of documents:</p>
    <li>Rollinkstock: {{ rsStore.RS_COUNT }}</li>
    <li>Decoders: {{ decodersStore.DECODERS_COUNT }}</li>
    <li>AAR Codes: {{ aarCodesStore.AARCODES_COUNT }}</li>
    <li>Structures: {{ structuresStore.STRUCTURES_COUNT }}</li>
    <li>Companies: {{ companiesStore.COMPANIES_COUNT }}</li>
    <li>Images: {{ imagesStore.IMAGES_COUNT }}</li>
  </div>
</template>

<script setup>
import { useRSStore } from "@/stores/rs";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useDecodersStore } from "@/stores/decoders";
import { useStructuresStore } from "@/stores/structures";
import { useCompaniesStore } from "@/stores/companies";
import { useImagesStore } from "@/stores/images";

const rsStore = useRSStore();
const aarCodesStore = useAarCodesStore();
const decodersStore = useDecodersStore();
const structuresStore = useStructuresStore();
const companiesStore = useCompaniesStore();
const imagesStore = useImagesStore();
</script>
