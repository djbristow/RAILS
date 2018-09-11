<template>
<section>
   <div class="center">
  <p class="title is-5">Add Company</p>
  </div>
  <br>
  <div class="form">
   <div class="content">
      Short Name: <input type="text" name="shortName" v-model="shortName"><br>
      Long Name: <input type="text" name="longName" v-model="longName"><br>
      Type: <input type="text" name="industryType" v-model="industryType"><br>
      Location: <input type="text" name="industryLocation" v-model="industryLocation"><br>
      <button class="button is-primary" @click="addCo">Add Company</button>
    </div>
  </div>
</section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'NewCo',
  data() {
    return {
      shortName: '',
      longName: '',
      industryType: '',
      industryLocation: ''
    }
  },
  methods: {
    async addCo() {
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
