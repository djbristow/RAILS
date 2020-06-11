<template>
  <div class="home">
    <img src="../assets/kjc.png">
    <h4>v1.3.4</h4>
    <p>Number of Rolling Stock {{ rollingstocksize }}</p>
    <p>Number of Images {{ imagesize }}</p>
    <p>Number of Companies {{ companysize }}</p>
    <p>Number of AAR codes {{ aarsize }}</p>
  </div>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'Home',
  data () {
    return {
      rollingstocksize: 0,
      imagesize: 0,
      companysize: 0,
      aarsize: 0
    }
  },
  mounted () {
    this.getSizes()
  },
  methods: {
    async getSizes () {
      const respRs = await RsService.fetchRslist()
      this.rollingstocksize = respRs.data.rollingstocks.length
      const respImg = await RsService.fetchImglist()
      this.imagesize = respImg.data.images.length
      const respCo = await RsService.fetchColist()
      this.companysize = respCo.data.industries.length
      const respAar = await RsService.fetchAarlist()
      this.aarsize = respAar.data.aarCodes.length
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
