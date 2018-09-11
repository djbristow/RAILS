<template>
   <section>
      <div class="center">
     <p class="title is-5">Update Image</p>
     </div>
     <br>
     <div class="form">
        <div class="content">
             AAR Code: <input type="text" name="aarCode" v-model="aarCode"><br>
             RS Type: <input type="text" name="rollingstockType" v-model="rollingstockType"><br>
             Description: <input type="text" name="description" v-model="description"><br>
         <button class="button is-primary" @click="updateAar">Update AAR Code</button>
       </div>
     </div>
   </section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'EditAar',
  data() {
    return {
      aarCode: '',
      rollingstockType: '',
      description: ''
    }
  },
  mounted() {
    this.getAar()
  },
  methods: {
    async getAar() {
      const response = await RsService.getAar({
        id: this.$route.params.id
      })
        this.aarCode = response.data.aarCode,
        this.rollingstockType = response.data.rollingstockType,
        this.description = response.data.description
    },
    async updateAar() {
      await RsService.updateAar({
        id: this.$route.params.id,
        aarCode: this.aarCode,
        rollingstockType: this.rollingstockType,
        description: this.description
      })
      this.$router.push({
        name: 'Aarlist'
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
