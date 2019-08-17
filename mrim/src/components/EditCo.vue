<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Company
      </p>
    </div>
    <br>
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
          @click="updateCo"
        >
          Update Company
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditCo',
  data () {
    return {
      shortName: '',
      longName: '',
      industryType: '',
      industryLocation: ''
    }
  },
  mounted () {
    this.getCo()
  },
  methods: {
    async getCo () {
      const response = await RsService.getCo({
        id: this.$route.params.id
      })
      this.shortName = response.data.shortName
      this.longName = response.data.longName
      this.industryType = response.data.industryType
      this.industryLocation = response.data.industryLocation
    },
    async updateCo () {
      await RsService.updateCo({
        id: this.$route.params.id,
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
