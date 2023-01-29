<template>
  <div class="xx">
    <h1>About RAILS RS RFID Manager</h1>
    <h3>Version 3.2.6</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) RFID
      Application is one of several applications in the RAILS family of
      applications. It is a MongoDB, Express, Vue, and Node (MEVN) application
      that provides a user with a web application to show, when an RFID tag is
      read, the road name and number of the rolling stock associated with that
      tag. If there is no association with a peice of rolling stock input fields
      are provided to allow the user to enter the road name and number.
    </p>
    <p>The user guide is available at: tbd</p>
    <p>Waiting for Vuetify 3.2 to format and paginate tables</p>
    <hr>
    <p>The database has the following number of documents:</p>
    <ul>
      <li>Rollinkstock: {{ rslength }} of which {{ rfidlength }} have RFID tags.</li>
      <li>Micro Controllers: {{ microslength }} of which {{ rfidReaders }} are RFID readers</li>
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
    rfidlength() {
      return this.$store.getters.listRsWithRfids.length
    },
    microslength() {
            return this.$store.state.micros.length;
        },
        rfidReaders() {
          return this.$store.getters.listRfidReaders.length
        }
  }
};
</script>
