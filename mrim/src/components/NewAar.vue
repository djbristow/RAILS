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
        <b-field label="AAR Code">
          <b-input v-model="aarCode" />
        </b-field>
        <b-field label="RS Type">
          <b-input v-model="rollingstockType" />
        </b-field>
        <b-field label="Description">
          <b-input
            v-model="description"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
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
  text-align: left;
}
</style>
