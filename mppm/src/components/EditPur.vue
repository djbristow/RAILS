<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Purchase
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        Date:
        <input
          v-model="date"
          type="text"
          name="date"
          size="40"
        >
        <br>Store:
        <input
          v-model="store"
          type="text"
          name="store"
          size="40"
        >
        <br>Item:
        <input
          v-model="item"
          type="text"
          name="item"
          size="40"
        >
        <br>Desciption:
        <input
          v-model="desciption"
          type="text"
          name="desciption"
          size="40"
        >
        <br>Manufacturer:
        <input
          v-model="manufacturer"
          type="text"
          name="manufacturer"
          size="40"
        >
        <br>Unit Cost:
        <input
          v-model="unitcost"
          type="text"
          name="unitcost"
          size="40"
        >
        <br>Qty:
        <input
          v-model="qty"
          type="text"
          name="qty"
          size="40"
        >
        <br>Project:
        <input
          v-model="project"
          type="text"
          name="project"
          size="40"
        >
        <br>Notes:
        <textarea
          v-model="notes"
          rows="5"
          cols="40"
        /><br>
        <button
          class="button is-primary"
          @click="updatePur"
        >
          Update Purchase
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'EditPur',
  data () {
    return {
      date: '',
      store: '',
      item: '',
      desciption: '',
      manufacturer: '',
      unitcost: '',
      qty: '',
      project: '',
      notes: ''
    }
  },
  mounted () {
    this.getPur()
  },
  methods: {
    async getPur () {
      const response = await PpService.getPur({
        id: this.$route.params.id
      })
      console.log(response.data)
      this.date = response.data.date
      this.store = response.data.store
      this.item = response.data.item
      this.desciption = response.data.desciption
      this.manufacturer = response.data.manufacturer
      this.unitcost = response.data.unitcost
      this.qty = response.data.qty
      this.project = response.data.project
      this.notes = response.data.notes
    },
    async updatePur () {
      await PpService.updatePur({
        id: this.$route.params.id,
        date: this.date,
        store: this.store,
        item: this.item,
        desciption: this.desciption,
        manufacturer: this.manufacturer,
        unitcost: this.unitcost,
        qty: this.qty,
        project: this.project,
        notes: this.notes
      })
      this.$router.push({
        name: 'Purlist'
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
