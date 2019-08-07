<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Model Company
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        Company:
        <input
          v-model="name"
          type="text"
          name="name"
          size="40"
        >
        <br>Type:
        <input
          v-model="type"
          type="text"
          name="type"
          size="40"
        >
        <br>Website:
        <input
          v-model="website"
          type="text"
          name="website"
          size="40"
        >
        <br>Phone:
        <input
          v-model="phone"
          type="text"
          name="phone"
          size="40"
        >
        <br>Address:
        <input
          v-model="address"
          type="text"
          name="address"
          size="40"
        >
        <br>Notes:
        <textarea
          v-model="notes"
          rows="5"
          cols="40"
        />
        <br>
        <button
          class="button is-primary"
          @click="updateMco"
        >
          Update Model Compny
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'EditMco',
  data () {
    return {
      name: '',
      type: '',
      website: '',
      phone: '',
      address: '',
      notes: ''
    }
  },
  mounted () {
    this.getMco()
  },
  methods: {
    async getMco () {
      const response = await PpService.getMco({
        id: this.$route.params.id
      })
      this.name = response.data.name
      this.type = response.data.type
      this.website = response.data.website
      this.phone = response.data.phone
      this.address = response.data.address
      this.notes = response.data.notes
    },
    async updateMco () {
      await PpService.updateMco({
        id: this.$route.params.id,
        name: this.name,
        type: this.type,
        website: this.website,
        phone: this.phone,
        address: this.address,
        notes: this.notes
      })
      this.$router.push({
        name: 'Mcolist'
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
