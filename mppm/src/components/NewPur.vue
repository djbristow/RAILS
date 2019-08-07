<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Purchase
      </p>
    </div>
    <br>
    <div
      class="form"
      enctype="multipart/form-data"
    >
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
        />
        <br>
        <button
          class="button is-primary"
          @click="addPur"
        >
          Add Purchase
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'NewPur',
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
  methods: {
    async addPur () {
      await PpService.addPur({
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
