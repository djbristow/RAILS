<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update AAR Code
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
          @click="updateAar"
        >
          Update AAR Code
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditAar',
  data () {
    return {
      aarCode: '',
      rollingstockType: '',
      description: ''
    }
  },
  mounted () {
    this.getAar()
  },
  methods: {
    async getAar () {
      const response = await RsService.getAar({
        id: this.$route.params.id
      })
      this.aarCode = response.data.aarCode
      this.rollingstockType = response.data.rollingstockType
      this.description = response.data.description
    },
    async updateAar () {
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
