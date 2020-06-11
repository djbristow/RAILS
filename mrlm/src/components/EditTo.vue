<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Turnout
      </p>
    </div>
    <br>
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
        @click="updateTo"
      >
        Update Turnout
      </button>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditTo',
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
  mounted () {
    this.getTo()
  },
  methods: {
    async getTo () {
      const response = await RsService.getTo({
        id: this.$route.params.id
      })
      this.toID = response.data.toID
      this.controller = response.data.controller
      this.toNum = response.data.toNum
      this.type = response.data.type
      this.state = response.data.state
      this.lock = response.data.lock
      this.notes = response.data.notes
      this.lastUpdate = response.data.lastUpdate
    },
    async updateTo () {
      await RsService.updateTo({
        id: this.$route.params.id,
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
