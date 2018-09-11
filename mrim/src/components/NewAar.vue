<template>
<section>
   <div class="center">
  <p class="title is-5">Add AAR Code</p>
  </div>
  <br>
  <div class="form">
   <div class="content">
      AAR Code: <input type="text" name="aarCode" v-model="aarCode"><br>
      RS Type: <input type="text" name="rollingstockType" v-model="rollingstockType"><br>
      Description: <input type="text" name="description" v-model="description"><br>
      <button class="button is-primary" @click="addAar">Add AAR Code</button>
    </div>
  </div>
</section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'NewAar',
  data() {
    return {
      aarCode: '',
      rollingstockType: '',
      description: ''
    }
  },
  methods: {
    async addAar() {
      console.log(this.aarCode)
      await RsService.addAar({
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
