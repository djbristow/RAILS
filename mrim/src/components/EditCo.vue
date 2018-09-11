<template>
   <section>
      <div class="center">
     <p class="title is-5">Update Company</p>
     </div>
     <br>
     <div class="form">
        <div class="content">
             Short Name: <input type="text" name="shortName" v-model="shortName"><br>
             Long Name: <input type="text" name="longName" v-model="longName"><br>
             Type: <input type="text" name="industryType" v-model="industryType"><br>
             Location: <input type="text" name="industryLocation" v-model="industryLocation"><br>
         <button class="button is-primary" @click="updateCo">Update Company</button>
       </div>
     </div>
   </section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'EditCo',
  data() {
    return {
      shortName: '',
      longName: '',
      industryType: '',
      industryLocation: ''
    }
  },
  mounted() {
    this.getCo()
  },
  methods: {
    async getCo() {
      const response = await RsService.getCo({
        id: this.$route.params.id
      })
        this.shortName = response.data.shortName,
        this.longName = response.data.longName,
        this.industryType = response.data.industryType,
        this.industryLocation = response.data.industryLocation
    },
    async updateCo() {
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
  width: 500px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: right;
}
</style>
