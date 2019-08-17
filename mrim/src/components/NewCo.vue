<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Company
      </p>
    </div>
    <div class="form">
      <div class="content">
        <b-field label="Short Name">
          <b-input v-model="shortName" />
        </b-field>
        <b-field label="Long Name">
          <b-input v-model="longName" />
        </b-field>
        <b-field label="Type">
          <b-input v-model="industryType" />
        </b-field>
        <b-field label="Location">
          <b-input v-model="industryLocation" />
        </b-field>
        <button
          class="button is-light"
          @click="addCo"
        >
          Add Company
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'NewCo',
  data () {
    return {
      shortName: '',
      longName: '',
      industryType: '',
      industryLocation: ''
    }
  },
  methods: {
    async addCo () {
      await RsService.addCo({
        shortName: this.shortName,
        longName: this.longName,
        industryType: this.industryType,
        industryLocation: this.industryLocation
      })
      this.$router.push({
        name: 'Colist'
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
