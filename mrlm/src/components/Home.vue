<template>
  <div class="home">
    <img src="../assets/kjc.png">
    <h4>v1.2.1</h4>
    <p>Number of Micros {{ microsize }}</p>
    <p>Number of Turnouts {{ turnoutsize }}</p>
    <p>Number of Turnout Panel Lights {{ tplsize }}</p>
  </div>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'Home',
  data () {
    return {
      microsize: 0,
      turnoutsize: 0,
      tplsize: 0
    }
  },
  mounted () {
    this.getSizes()
  },
  methods: {
    async getSizes () {
      const respMicro = await RsService.fetchMicroList()
      this.microsize = respMicro.data.micros.length
      const respTo = await RsService.fetchToList()
      this.turnoutsize = respTo.data.turnouts.length
      const respTPL = await RsService.fetchTPLightList()
      this.tplsize = respTPL.data.tplights.length
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
