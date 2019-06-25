<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Company
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        Short Name: <input
          v-model="shortName"
          type="text"
          name="shortName"
        ><br>
        Long Name: <input
          v-model="longName"
          type="text"
          name="longName"
        ><br>
        Type: <input
          v-model="industryType"
          type="text"
          name="industryType"
        ><br>
        Location: <input
          v-model="industryLocation"
          type="text"
          name="industryLocation"
        ><br>
        <button
          class="button is-primary"
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
  text-align: right;
}
</style>
