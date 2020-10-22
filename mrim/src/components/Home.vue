<template>
  <div class="home">
    <img src="../assets/kjc.png" />
    <h4>2.3.0</h4>
    <p>Number of Rolling Stock {{ rollingstocksize }}</p>
    <p>Number of Locomotives {{ locomotivesize }}</p>
    <p>Number of Decoders {{ dccsize }}</p>
    <p>Number of Images {{ imagesize }}</p>
    <p>Number of Companies {{ companysize }}</p>
    <p>Number of AAR codes {{ aarsize }}</p>
    <p>Number of Structures {{ structuresize }}</p>
  </div>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "Home",
  data() {
    return {
      rollingstocksize: 0,
      locomotivesize: 0,
      dccsize: 0,
      imagesize: 0,
      companysize: 0,
      aarsize: 0,
      structuresize: 0,
    };
  },
  mounted() {
    this.getSizes();
  },
  methods: {
    async getSizes() {
      var resp = await RsService.fetchRslist();
      this.rollingstocksize = resp.data.rollingstocks.length;
      resp = await RsService.fetchRSLocomotives();
      this.locomotivesize = resp.data.rollingstocks.length;
      resp = await RsService.fetchDcclist();
      this.dccsize = resp.data.dccs.length;
      resp = await RsService.fetchImglist();
      this.imagesize = resp.data.images.length;
      resp = await RsService.fetchColist();
      this.companysize = resp.data.industries.length;
      resp = await RsService.fetchAarlist();
      this.aarsize = resp.data.aarCodes.length;
      resp = await RsService.fetchStructlist();
      this.structuresize = resp.data.structures.length;
    },
  },
};
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
