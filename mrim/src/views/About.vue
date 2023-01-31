<template>
  <div class="xx">
    <h1>About Model Railroad Inventory Manager</h1>
    <h3>Version 3.0.6</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) MRIM
      Application is one of several single page applications (SPAs) in the RAILS family of
      applications. It uses MongoDB, Vue 3, Vuetify and Node to construct the SPA. MRIM
      provides a user with a web SPA to show inventories of modeled railroad elements,
      such as rolling stock, AAR codes, structures, images, and companies.
      Rolling stock has a sub collections of locomotives along with DCC
      decoders. MRIM provides reports on the various elements as well
      as the ability to export and import CSV files.
    </p>
    <p>The user guide is available at: tbd</p>
    <p>Waiting for Vuetify 3.2 to format and paginate tables</p>
    <br>
    <hr>
    <p>The database has the following number of documents:</p>
    <ul>
      <li>Rollinkstock: {{ rslength }}</li>
      <li>Decoders: {{ decoderslength }}</li>
      <li>AAR Codes: {{ aarCodeslength }}</li>
      <li>Structures: {{ structureslength }}</li>
      <li>Companies: {{ companieslength }}</li>
      <li>Images: {{ imageslength }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "About",
  computed: {
    rslength() {
      return this.$store.state.rs.length;
    },
    aarCodeslength() {
      return this.$store.state.aarCodes.length;
    },
    structureslength() {
      return this.$store.state.structures.length;
    },
    companieslength() {
      return this.$store.state.companies.length;
    },
    decoderslength() {
      return this.$store.state.decoders.length;
    },
    imageslength() {
      return this.$store.state.images.length;
    },
  },
};
</script>
