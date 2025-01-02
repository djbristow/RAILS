<template>
  <div class="xx">
    <h1>About Model Railroad Layout Manager</h1>
    <h3>Version 3.2.12</h3>
    <p>
      The Railway Administration and Information Logical System (RAILS) Model
      Railroad Layout Manager is one of several applications in the RAILS family
      of applications. It uses MongoDB, Vue3, Vuetify and Node to build a single
      page application that provides a user with a web application to show
      inventories of micro controllers, turnouts, and turnout panel lights. The
      application provides reports on the various elements as well as the
      ability to export and import CSV files.
    </p>
    <br />
    <p>The user guide is available at: tbd</p>
    <br />
    <hr />
    <p>The database has the following number of documents:</p>
    <li>Micro Controllers: {{ microsStore.MICRO_COUNT }}</li>
    <li>Turnouts: {{ turnoutsStore.TURNOUT_COUNT }}</li>
    <li>Turnout Panel Lights: {{ tplightsStore.TPLIGHT_COUNT }}</li>
    <hr />
    <table>
      <tr>
        <td>Connection to ISTS Turnout Contacts</td>
        <td>
          <div v-if="connStatsStore.connToStatus === 'Connected'">
            <v-icon color="green">mdi-cast-connected</v-icon>
          </div>
          <div v-else>
            <v-icon color="red">mdi-cast-connected</v-icon>
          </div>
        </td>
      </tr>
      <tr>
        <td>Connection to ISTS Turnout Panel Buttons</td>
        <td>
          <div v-if="connStatsStore.connBtnStatus === 'Connected'">
            <v-icon color="green">mdi-cast-connected</v-icon>
          </div>
          <div v-else>
            <v-icon color="red">mdi-cast-connected</v-icon>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { useMicrosStore } from "@/stores/micros";
import { useTurnoutsStore } from "@/stores/turnouts";
import { useTplightsStore } from "@/stores/tplights";
import { useConnStatsStore } from "@/stores/connStats";

const microsStore = useMicrosStore();
const turnoutsStore = useTurnoutsStore();
const tplightsStore = useTplightsStore();
const connStatsStore = useConnStatsStore();
</script>
