<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Micro Controller
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        <b-field label="Name">
          <b-input v-model="microID" />
        </b-field>
        <b-field label="IP">
          <b-input v-model="microIP" />
        </b-field>
        <b-field label="Purpose">
          <b-input
            v-model="purpose"
            type="textarea"
          />
        </b-field>
        <b-field label="Last Update">
          <b-input v-model="et" />
        </b-field>
        <button
          class="button is-light"
          @click="addMicro"
        >
          Add Micro
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'NewMicro',
  data () {
    return {
      microID: '',
      microIP: '',
      purpose: '',
      et: ''
    }
  },
  methods: {
    async addMicro () {
      await RsService.addMicro({
        microID: this.microID,
        microIP: this.microIP,
        purpose: this.purpose,
        et: this.et
      })
      this.$router.push({
        name: 'MicroList'
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
