<template>
  <section>
    <div class="center">
      <p class="title is-5">Image Inventory</p>
    </div>
    <b-table
      :data="images"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="roadName"
    >
      <b-table-column
        field="title"
        label="Title"
        width="300"
        sortable
        v-slot="props"
      >{{ props.row.title }}</b-table-column>
      <b-table-column
        field="fileName"
        label="File"
        width="300"
        v-slot="props"
      >{{ props.row.fileName }}</b-table-column>
      <b-table-column field="_id" label="Action" width="150" sortable v-slot="props">
        <a href="#" @click="cardModal(props.row._id)">
          <b-icon icon="details" />
        </a>
        <router-link :to="{ name: 'EditImg', params: { id: props.row._id } }">
          <b-icon icon="pencil" />
        </router-link>
        <a href="#" @click="deleteImg(props.row._id)">
          <b-icon icon="delete-forever" />
        </a>
      </b-table-column>
    </b-table>
    <b-field grouped group-multiline>
      <b-select v-model="perPage" :disabled="!isPaginated">
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="30">30 per page</option>
        <option value="40">40 per page</option>
      </b-select>
    </b-field>
    <b-modal :active.sync="isCardModalActive" :width="600">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Image Details
          <br />
          <span style="font-size:14px">for {{mTitle}}</span>
        </p>
      </header>
      <section class="modal-card-body">
        <img :src="mImageURL" :width="500" />
        <div class="content">
          Filename: {{mFileName}}
          <br />
        </div>Notes:
        <textarea rows="6" cols="50" v-model="mNotes" />
        <br />
      </section>
      <footer class="modal-card-foot">
        <a href="#" @click="editClose()">
          <b-icon icon="pencil" />
        </a>
        <a href="#" @click="modalClose()">
          <b-icon icon="window-close" />
        </a>
      </footer>
    </b-modal>
  </section>
</template>

<script>
import RsService from "../services/RsService";

export default {
  name: "Images",
  data() {
    return {
      images: [],
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: "asc",
      currentPage: 1,
      perPage: 10,
      mTitle: "",
      mImageURL: "",
      mFileName: "",
      mId: "",
      mNotes: "",
      isCardModalActive: false,
    };
  },
  mounted() {
    this.getImglist();
  },
  methods: {
    editClose() {
      this.isCardModalActive = false;
      this.$router.push({
        name: "EditImg",
        params: { id: this.mId },
      });
    },
    modalClose() {
      this.isCardModalActive = false;
    },
    async getImglist() {
      const response = await RsService.fetchImglist();
      this.images = response.data.images;
    },
    async deleteImg(id) {
      await RsService.deleteImg(id);
      this.getImglist();
    },
    async cardModal(id) {
      const response = await RsService.getImgById(id);
      this.mImageURL = "./static/img/" + response.data.fileName;
      this.mFileName = response.data.fileName;
      this.mTitle = response.data.title;
      this.mId = response.data._id;
      this.mNotes = response.data.notes;
      this.isCardModalActive = true;
    },
  },
};
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
.animation-content.modal-content{
  margin: 0px !important;
  border: 0px;
  padding: 0px;
}
.modal-card-head {
  background-color: rgb(106, 181, 243);
  width: 600px;
}
.modal-card-body {
  margin: 0px !important;
  border: 0px;
  background-color: white;
  width: 600px;
  text-align: center;
}
.modal-card-foot {
  background-color: rgb(106, 181, 243);
  width: 600px;
}
.modal-content,
.modal-card {
  margin: 0 20px;
  max-height: calc(100vh - 160px);
  overflow-y: auto !important;
  overflow-x: hidden !important;
  position: relative;
  width: 100%;
}
</style>
