<template>
    <div class="xx">
        <h1>About Model Railroad Layout Manager</h1>
        <h3>Version 2.0.1</h3>
        <p>
            The Railway Administration and Information Logical System (RAILS) Model Railroad Layout Manager is one of
            several applications in the RAILS family of applications. It uses MongoDB, Vue3, Vuetify and Node to
            build a single page application that provides a user with a web application to show inventories of micro
            controllers, turnouts, and turnout panel lights. The application provides reports on the various elements
            as well as the ability to export and import CSV files.</p>
        <br>
        <p>The user guide is available at: tbd</p>
        <p>Waiting for Vuetify 3.2 to format and paginate tables</p>
        <br>
        <hr>
        <p>The database has the following number of documents:</p>
        <ul>
            <li>Micro Controllers: {{ microslength }}</li>
            <li>Turnouts: {{ turnoutslength }}</li>
            <li>Turnout Panel Lights: {{ tplightslength }}</li>
        </ul>
        <hr>
        <p>Connection to ISTS Turnout Contacts</p>
        <div v-if="connToStatus === 'Connected'">
            <v-icon color="green">mdi-cast-connected</v-icon>
        </div>
        <div v-else>
            <v-icon color="red">mdi-cast-connected</v-icon>
        </div>
        <p>Connection to ISTS Turnout Panel Buttons</p>
        <div v-if="connBtnStatus === 'Connected'">
            <v-icon color="green">mdi-cast-connected</v-icon>
        </div>
        <div v-else>
            <v-icon color="red">mdi-cast-connected</v-icon>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "About",
    computed: {
        microslength() {
            return this.$store.state.micros.length;
        },
        turnoutslength() {
            return this.$store.state.turnouts.length;
        },
        tplightslength() {
            return this.$store.state.tplights.length;
        },
        connToStatus() {
            return this.$store.state.connToStatus;
        },
        connBtnStatus() {
            return this.$store.state.connBtnStatus;
        },
    },
};
</script>
