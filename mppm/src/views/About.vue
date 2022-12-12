<template>
  <div class="xx">
    <h1>About Model Project & Purchase Manager</h1>
    <h3>Version 2.0.1</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) Model Railroad Purchases
      and Projects Manager is one of several applications in the RAILS family of applications.
      It uses MongoDB, Vue3, Vuetify and Node to build a single page application that provides
      a user with a web application to show inventories of model railroad companies, purchase
      and projects. The application provides reports on the various elements as well as the
      ability to export and import CSV files.</p>
    <br>
    <p>The user guide is available at: tbd</p>
    <p>Waiting for Vuetify 3.2 to format and paginate tables</p>
    <br>
    <hr>
    <p>The database has the following number of documents:</p>
    <ul>
      <li>Model Railroad Companies: {{ mrcoslength }}</li>
      <li>Purchases: {{ purchaseslength }}</li>
      <li>Projects: {{ projectslength }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "About",
  computed: {
    mrcoslength() {
      return this.$store.state.mrcos.length;
    },
    purchaseslength() {
      return this.$store.state.purchases.length;
    },
    projectslength() {
      return this.$store.state.projects.length;
    },
  },
};
</script>
