<template>
  <div class="xx">
    <h1>About RAILS RS RFID Manager</h1>
    <h3>Version 4.2.9</h3>
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
    <hr />
    <p>The database has the following number of documents:</p>
      <li>
        Rollinkstock: {{ rsStore.RS_COUNT }} of which
        {{ rsStore.RS_WITH_RFID_COUNT }} have RFID tags.
      </li>
      <li>
        Micro Controllers: {{ microStore.MICRO_COUNT }} of which
        {{ microStore.RFID_READER_COUNT }} are RFID readers
      </li>
  </div>
</template>

<script setup>
import { useMicrosStore } from "@/stores/micros";
import { useRSStore } from "@/stores/rs";

const microStore = useMicrosStore();
const rsStore = useRSStore();
</script>
