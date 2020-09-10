<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Turnout
      </p>
    </div>
    <div class="form">
      <div class="content">
        <b-field label="Name*">
          <b-input v-model="toID" />
        </b-field>
        <b-field label="Controller*">
          <b-input v-model="controller" />
        </b-field>
        <b-field label="Number">
          <b-input v-model="toNum" />
        </b-field>
        <b-field label="Type">
          <b-input v-model="type" />
        </b-field>
        <b-field label="State">
          <b-input v-model="state" />
        </b-field>
        <b-field label="Lock">
          <b-input v-model="lock" />
        </b-field>
        <b-field label="Last Update">
          <b-input v-model="lastUpdate" />
        </b-field>
      </div>
      <button
        class="button is-light"
        @click="addTo"
      >
        Add Turnout
      </button>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'NewTo',
  data () {
    return {
      toID: '',
      controller: '',
      toNum: '',
      type: '',
      state: '',
      lock: '',
      notes: '',
      lastUpdate: ''
    }
  },
  methods: {
    async addTo () {
      await RsService.addTo({
        toID: this.toID,
        controller: this.controller,
        toNum: this.toNum,
        type: this.type,
        state: this.state,
        lock: this.lock,
        notes: this.notes,
        lastUpdate: this.lastUpdate
      })
      this.$router.push({
        name: 'ToList'
      })
    }
  }
}
</script>
<style scoped>
section {
  width: 400px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: left;
}
</style>
