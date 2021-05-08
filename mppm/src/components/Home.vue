<template>
  <div class="home">
    <img src="../assets/kjc.png">
    <h4>v1.5.7</h4>
    <p>Number of Model Railroad Companies {{ companysize }}</p>
    <p>Number of Projects {{ projectsize }}</p>
    <p>Number of Purchases {{ purchasesize }}</p>
  </div>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'Home',
  data () {
    return {
      companysize: 0,
      projectsize: 0,
      purchasesize: 0,
      aarsize: 0
    }
  },
  mounted () {
    this.getSizes()
  },
  methods: {
    async getSizes () {
      const respMco = await PpService.fetchMcolist()
      this.companysize = respMco.data.companies.length
      const respProj = await PpService.fetchProjlist()
      this.projectsize = respProj.data.projects.length
      const respPur = await PpService.fetchPurlist()
      this.purchasesize = respPur.data.purchases.length
    }
  }
}
</script>

<style scoped>
.home {
  margin: auto;
  width: 500px;
  padding: 10px;
  text-align: center;
}
p {
  text-align: center;
}
</style>
