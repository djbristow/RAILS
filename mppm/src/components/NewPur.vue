<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Purchase
      </p>
    </div>
    <div
      class="form"
      enctype="multipart/form-data"
    >
      <div class="content">
        <div class="columns">
          <div class="column is-one-half">
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
            </div>
          </div>
          <div class="column is-one-half">
            <div class="content">
              <b-field label="Manufacturer">
                <b-input v-model="manufacturer" />
              </b-field>
              <b-field label="Quantity">
                <b-input v-model="qty" />
              </b-field>
              <b-field label="Unit Cost">
                <b-input v-model="unitcost" />
              </b-field>
              <b-field label="Project">
                <b-input v-model="project" />
              </b-field>
              <b-field
                v-if="needsRSInfo"
                label="Roadname"
              >
                <b-input v-model="roadname" />
              </b-field>
            </div>
          </div>
        </div>
        <b-field
          v-if="needsRSInfo"
          label="Roadnumbers"
        >
          <b-input v-model="roadnumbers" />
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
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
      num: '',
      date: null,
      store: '',
      item: '',
      desciption: '',
      manufacturer: '',
      unitcost: '',
      qty: '',
      project: '',
      roadname: '',
      roadnumbers: '',
      notes: ''
    }
  },
  computed: {
    needsRSInfo: function () {
      return (this.project === 'RTR')
    }
  },
  methods: {
    async addPur () {
      await PpService.addPur({
        num: this.num,
        date: this.date,
        store: this.store,
        item: this.item,
        desciption: this.desciption,
        manufacturer: this.manufacturer,
        unitcost: this.unitcost,
        qty: this.qty,
        project: this.project,
        roadname: this.roadname,
        roadnumbers: this.roadnumbers,
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
  width: 700px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: left;
}
.label {
  margin-bottom: 0.25em;
}
</style>
