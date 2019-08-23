<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Purchase
      </p>
    </div>
    <div class="form">
      <div class="content">
        <b-field label="#">
          <b-input v-model="num" />
        </b-field>
        <b-field label="Date">
          <b-datepicker
            v-model="date"
            icon="calendar-today"
            editable
          />
        </b-field>
        <b-field label="Store">
          <b-input v-model="store" />
        </b-field>
        <b-field label="Item">
          <b-input v-model="item" />
        </b-field>
        <b-field label="Description">
          <b-input v-model="desciption" />
        </b-field>
        <b-field label="Manufacturer">
          <b-input v-model="manufacturer" />
        </b-field>
        <b-field label="Quantity">
          <b-input v-model="qty" />
        </b-field><b-field label="Unit Cost">
          <b-input v-model="unitcost" />
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
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
      num: 0,
      date: null,
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
      this.num = response.data.num
      this.date = new Date(response.data.date)
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
        num: this.num,
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
