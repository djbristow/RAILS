<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add AAR Code
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        AAR Code: <input
          v-model="aarCode"
          type="text"
          name="aarCode"
        ><br>
        RS Type: <input
          v-model="rollingstockType"
          type="text"
          name="rollingstockType"
        ><br>
        Description: <input
          v-model="description"
          type="text"
          name="description"
        ><br>
        <button
          class="button is-primary"
          @click="addAar"
        >
          Add AAR Code
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'NewAar',
  data () {
    return {
      aarCode: '',
      rollingstockType: '',
      description: ''
    }
  },
  methods: {
    async addAar () {
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
