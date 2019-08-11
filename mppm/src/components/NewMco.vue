<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Model Company
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        <b-field label="Company">
          <b-input v-model="name" />
        </b-field>
        <b-field label="Type">
          <b-input v-model="type" />
        </b-field>
        <b-field label="Website">
          <b-input v-model="website" />
        </b-field>
        <b-field label="Phone">
          <b-input v-model="phone" />
        </b-field>
        <b-field label="Address">
          <b-input v-model="address" />
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
          @click="addMco"
        >
          Add Model Company
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'NewMco',
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
  methods: {
    async addMco () {
      console.log(this.name)
      await PpService.addMco({
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
