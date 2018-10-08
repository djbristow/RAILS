<template>
<section>
  <div class="center">
    <p class="title is-5">Image Inventory</p>
  </div>
  <b-table :data="images" :paginated="isPaginated" :per-page="perPage" :current-page.sync="currentPage" :default-sort-direction="defaultSortDirection" :striped="isStriped" :narrowed="isNarrowed" default-sort="roadName">
    <template slot-scope="props">
          <b-table-column field="title" label="Title" width="300" sortable>
          {{ props.row.title }}
          </b-table-column>
          <b-table-column field="fileName" label="File" width="300">
          {{ props.row.fileName }}
         </b-table-column>
         <b-table-column field="_id" label="Action" width="150" sortable>
             <a href="#" @click="cardModal(props.row._id)"><b-icon icon="details" /></a>
             <router-link v-bind:to="{ name: 'EditImg', params: { id: props.row._id } }"><b-icon icon="pencil" /></router-link>
             <a href="#" @click="deleteImg(props.row._id)"><b-icon icon="delete-forever" /></a>
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
const ModalForm = {
   props: {
      title: String,
      fileName: String,
      notes: String,
      id: String,
      imageURL: String
   },
   methods: {
      editClose(){
           this.$parent.close();
           this.$router.push({
             name: 'EditImg',
             params: { id: this.id }
           })
      }
   },
   template: `
   <div class="modal-card" style="width:600px ; background-color: white">
      <header class="modal-card-head">
         <p class="modal-card-title">Image Details<br />
         <span style="font-size:14px">for {{title}}</span></p>
      </header>
      <section class="modal-card-body">
      <img :src="imageURL" >
      <div class="content">
         Filename: {{fileName}} <br>
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
   name: 'images',
   data() {
   return {
      images: [],
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
   this.getImglist()
   },
   methods: {
   async getImglist() {
      const response = await RsService.fetchImglist()
      this.images = response.data.images
   },
   async deleteImg(id) {
      await RsService.deleteImg(id)
      this.getImglist()
      this.$router.push({
        name: 'Imglist'
      })
   },
   async cardModal(id) {
      var n = 0;
      const response = await RsService.getImgById(id);
      var imageURL = "./static/img/" + response.data.fileName;
      this.$modal.open({
        parent: this,
        props: {
           fileName: response.data.fileName,
           title: response.data.title,
           id: response.data._id,
           notes: response.data.notes,
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
   width: 750px;
   padding: 10px;
   }
   .center {
   text-align: center;
   }
   </style>
