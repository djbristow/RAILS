<template>
<section>
  <div class="center">
    <p class="title is-5">Rollingstock Inventory</p>
  </div>
  <b-table :data="rollingstocks" :paginated="isPaginated" :per-page="perPage" :current-page.sync="currentPage" :default-sort-direction="defaultSortDirection" :striped="isStriped" default-sort="roadName">
    <template slot-scope="props">
          <b-table-column field="roadName" label="Road Name" width="100" sortable>
          {{ props.row.roadName }}
          </b-table-column>
          <b-table-column field="roadNumber" label="Road Number" width="150">
          {{ props.row.roadNumber }}
         </b-table-column>
         <b-table-column field="aarCode" label="AAR" width="60" sortable>
          {{ props.row.aarCode }}
         </b-table-column>
         <b-table-column field="description" label="Description" width="100">
           {{props.row.description}}
         </b-table-column>
         <b-table-column field="color" label="Color" width="150" sortable>
          {{ props.row.color }}
         </b-table-column>
         <b-table-column field="_id" label="Action" width="150" sortable>
             <a href="#" @click="cardModal(props.row._id)"><b-icon icon="details" /></a>
             <router-link v-bind:to="{ name: 'EditRs', params: { id: props.row._id } }"><b-icon icon="pencil" /></router-link>
             <a href="#" @click="deleteRs(props.row._id)"><b-icon icon="delete-forever" /></a>
         </b-table-column>
      </template>
  </b-table>
  <b-field grouped group-multiline>
    <b-select v-model="perPage" :disabled="!isPaginated">
      <option value="10">10 per page</option>
      <option value="20">20 per page</option>
      <option value="30">30 per page</option>
      <option value="40">40 per page</option>
    </b-select>
  </b-field>
</section>
</template>

<script>
import RsService from '@/services/RsService'
import moment from 'moment'
const ModalForm = {
   props: {
      aarCode: String,
      bldr: String,
      bltDate: String,
      capacity: String,
      color: String,
      description: String,
      homeLocation: String,
      imageID: String,
      inSvcDate: String,
      insideHeight: String,
      insideLength: String,
      insideWidth: String,
      lastMaintDate: String,
      loadLimit: String,
      locationNow: String,
      ltWeight: String,
      modelLength: String,
      modelWeight: String,
      notes: String,
      numberBlt: String,
      rfid: String,
      roadName: String,
      roadNumber: String,
      rsStatus: String,
      id: String,
      isImage: Boolean,
      imageURL: String
   },
   methods: {
      editClose(){
           this.$parent.close();
           this.$router.push({
             name: 'EditRs',
             params: { id: this.id }
           })
      }
   },
   template: `
   <div class="modal-card" style="width:600px ; background-color: white">
      <header class="modal-card-head">
         <p class="modal-card-title">Rolling Stock Details<br />
         <span style="font-size:14px">for {{roadName}} {{roadNumber}}</span></p>
      </header>
      <section class="modal-card-body">
      <div v-if="isImage">
       <img :src="imageURL" >
      </div>
      <div class="columns">
        <div class="column is-half">
          <div class="content">
           Color: {{color}} <br>
           AAR Code: {{aarCode}} <br>
           Description: {{description}} <br>
           Builder: {{bldr}} <br>
           Built Date: {{bltDate}} <br>
           Number Built: {{numberBlt}} <br>
           In Service Date: {{inSvcDate}} <br>
           Inside Length: {{insideLength}} <br>
           Inside Height: {{insideHeight}} <br>
           Inside Width: {{insideWidth}} <br>
      Capacity: {{capacity}} <br>
          </div>
        </div>
        <div class="column">
          <div class="content">
           Weight Empty: {{ltWeight}} <br>
           Load Limit: {{loadLimit}} <br>
           Last Maint Date: {{lastMaintDate}} <br>
           RS Status: {{rsStatus}} <br>
           Home Location: {{homeLocation}} <br>
           Location Now: {{locationNow}} <br>
           Image ID: {{imageID}} <br>
           Model Weight: {{modelLength}} <br>
           Model Length: {{modelWeight}} <br>
           RFID: {{rfid}} <br>
          </div>
        </div>
      </div>
      <div class="center">
            Notes: <textarea rows="6" cols="50">{{notes}}</textarea><br>
       </div>
       </section>
       <footer class="modal-card-foot">
         <a href="#" @click="editClose()"><b-icon icon="pencil" /></a>
       	<a href="#" @click="$parent.close()"><b-icon icon="window-close" /></a>
       </footer>
   </div>
       `
    }
export default {
  name: 'rollingstocks',
  data() {
    return {
      rollingstocks: [],
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 10
   }
  },
  mounted() {
    this.getRslist()
  },
  methods: {
    async getRslist() {
      const response = await RsService.fetchRslist()
      this.rollingstocks = response.data.rollingstocks
    },
    async deleteRs(id) {
      await RsService.deleteRs(id)
      this.getRslist()
      this.$router.push({
        name: 'Rslist'
      })
    },
    formatDate(unformatDate) {
      console.log(unformatDate)
      if(unformatDate === null || unformatDate === ""){
         console.log("date is either null or zero length string!")
         return "";
      } else {
         return moment.utc(unformatDate).format('MM/DD/YYYY')
      }
    },
    async cardModal(id) {
      var n = 0;
      const response = await RsService.getRsById(id);
      var isImage = false;
      var imageURL = null;
      n = response.data.imageID.length;
      //console.log(response.data.imageID)
      //console.log(n)
      if (n > 0){
         isImage = true;
         imageURL = "./static/img/" + response.data.imageID;
         console.log(imageURL);
      } else {
         isImage = false;
      }
      //console.log(this.formatDate(response.data.bltDate))
      this.$modal.open({
        parent: this,
        props: {
           aarCode: response.data.aarCode,
           bldr: response.data.bldr,
           bltDate: this.formatDate(response.data.bltDate),
           capacity: response.data.capacity,
           color: response.data.color,
           description: response.data.description,
           homeLocation: response.data.homeLocation,
           imageID: response.data.imageID,
           inSvcDate: this.formatDate(response.data.inSvcDate),
           insideHeight: response.data.insideHeight,
           insideLength: response.data.insideLength,
           insideWidth: response.data.insideWidth,
           lastMaintDate: this.formatDate(response.data.lastMaintDate),
           loadLimit: response.data.loadLimit,
           locationNow: response.data.locationNow,
           ltWeight: response.data.ltWeight,
           modelLength: response.data.modelLength,
           modelWeight: response.data.modelWeight,
           notes: response.data.notes,
           numberBlt: response.data.numberBlt,
           rfid: response.data.rfid,
           roadName: response.data.roadName,
           roadNumber: response.data.roadNumber,
           rsStatus: response.data.rsStatus,
           id: response.data._id,
           isImage: isImage,
           imageURL: imageURL
        },
        component: ModalForm,
        hasModalCard: true
      })
    }
  }
}
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 1000px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
