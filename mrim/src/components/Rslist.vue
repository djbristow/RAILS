
<template>
  <section>
    <div class="center">
      <p class="title is-5">Rollingstock Inventory</p>
      <input v-model="rsSearch" type="text" placeholder="Road Name" />
      <input v-model="aarSearch" type="text" placeholder="AAR Code" />
    </div>
    <div class="tsize">
      <b-table
        :data="filteredRS"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :paginated="isPaginated"
        :per-page="perPage"
        :current-page.sync="currentPage"
      >
        <b-table-column
          field="roadName"
          label="Road Name"
          width="90"
          sortable
          v-slot="props"
        >{{ props.row.roadName }}</b-table-column>
        <b-table-column
          field="roadNumber"
          label="Road Number"
          width="100"
          numeric
          v-slot="props"
        >{{ props.row.roadNumber }}</b-table-column>
        <b-table-column
          field="aarCode"
          label="AAR"
          width="60"
          sortable
          v-slot="props"
        >{{ props.row.aarCode }}</b-table-column>
        <b-table-column
          field="description"
          label="Description"
          width="300"
          v-slot="props"
        >{{ props.row.description }}</b-table-column>
        <b-table-column
          field="color"
          label="Color"
          width="125"
          sortable
          v-slot="props"
        >{{ props.row.color }}</b-table-column>
        <b-table-column field="_id" label="Action" width="100" v-slot="props">
          <a href="#" @click="cardModal(props.row._id)">
            <b-icon icon="details" />
          </a>
          <router-link :to="{ name: 'EditRs', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a href="#" @click="deleteRs(props.row._id)">
            <b-icon icon="delete-forever" />
          </a>
        </b-table-column>
      </b-table>
      <b-modal :active.sync="isCardModalActive" :width="680">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Rolling Stock Details
            <br />
            <span style="font-size:14px">for {{mRoadName}} {{mRoadNumber}}</span>
          </p>
        </header>
        <section class="modal-card-body">
          <div v-if="isImage">
            <img :src="imageURL" :width="600" />
          </div>
          <div class="columns">
            <div class="column is-half">
              <div class="content">
                Color: {{mColor}}
                <br />
                AAR Code: {{mAarCode}}
                <br />
                Description: {{mDescription}}
                <br />
                Builder: {{mBldr}}
                <br />
                Built Date: {{mBltDate}}
                <br />
                Number Built: {{mNumberBlt}}
                <br />
                In Service Date: {{mInSvcDate}}
                <br />
                Inside Length: {{mInsideLength}}
                <br />
                Inside Height: {{mInsideHeight}}
                <br />
                Inside Width: {{mInsideWidth}}
                <br />
                Load Types: {{mLoadTypes}}
                <br />
                Capacity: {{mCapacity}}
                <br />
              </div>
            </div>
            <div class="column">
              <div class="content">
                Weight Empty: {{mLtWeight}}
                <br />
                Load Limit: {{mLoadLimit}}
                <br />
                Last Maint Date: {{mLastMaintDate}}
                <br />
                RS Status: {{mRsStatus}}
                <br />
                Home Location: {{mHomeLocation}}
                <br />
                Location Now: {{mLocationNow}}
                <br />
                Image ID: {{mImageID}}
                <br />
                Model Length: {{mModelLength}}
                <br />
                Model Weight: {{mModelWeight}}
                <br />
                RFID: {{mRfid}}
                <br />
              </div>
            </div>
          </div>
          <div class="center">
            Notes:
            <textarea rows="6" cols="50" v-model="mNotes"></textarea>
            <br />
          </div>
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
    </div>
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
import RsService from "../services/RsService";
import moment from "moment";
export default {
  name: "Rollingstocks",
  data() {
    return {
      rollingstocks: [],
      currentPage: 1,
      perPage: 10,
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: "asc",
      rsSearch: "",
      aarSearch: "",
      isCardModalActive: false,
      mAarCode: "",
      mBldr: "",
      mBltDate: "",
      mCapacity: "",
      mColor: "",
      mDescription: "",
      mHomeLocation: "",
      mImageID: "",
      mInSvcDate: "",
      mInsideHeight: "",
      mInsideLength: "",
      mInsideWidth: "",
      mLastMaintDate: "",
      mLoadLimit: "",
      mLoadTypes: "",
      mLocationNow: "",
      mLtWeight: "",
      mModelLength: "",
      mModelWeight: "",
      mNotes: "",
      mNumberBlt: "",
      mRfid: "",
      mRoadName: "",
      mRoadNumber: "",
      mRsStatus: "",
      mId: "",
      isImage: false,
      imageURL: "",
    };
  },
  computed: {
    filteredRS: function () {
      return this.rollingstocks.filter((rollingstock) => {
        return (
          rollingstock.roadName.match(this.rsSearch) &&
          rollingstock.aarCode.match(this.aarSearch)
        );
      });
    },
  },
  mounted() {
    this.getRslist();
  },
  methods: {
    editClose() {
      this.isCardModalActive = false;
      this.$router.push({
        name: "EditRs",
        params: { id: this.mId },
      });
    },
    modalClose() {
      this.isCardModalActive = false;
    },
    async getRslist() {
      const response = await RsService.fetchRslist();
      this.rollingstocks = response.data.rollingstocks;
    },
    async deleteRs(id) {
      await RsService.deleteRs(id);
      this.getRslist();
    },
    async cardModal(id) {
      this.imageURL = "";
      const response = await RsService.getRsById(id);
      var n = response.data.imageID.length;
      if (n > 0) {
        this.isImage = true;
        this.imageURL = "./static/img/" + response.data.imageID;
      }
      this.mRoadName = response.data.roadName;
      this.mRoadNumber = response.data.roadNumber;
      this.mAarCode = response.data.aarCode;
      this.mBldr = response.data.bldr;
      this.mBltDate = this.formatDate(response.data.bltDate);
      this.mCapacity = response.data.capacity;
      this.mColor = response.data.color;
      this.mDescription = response.data.description;
      this.mHomeLocation = response.data.homeLocation;
      this.mImageID = response.data.imageID;
      this.mInSvcDate = this.formatDate(response.data.inSvcDate);
      this.mInsideHeight = response.data.insideHeight;
      this.mInsideLength = response.data.insideLength;
      this.mInsideWidth = response.data.insideWidth;
      this.mLastMaintDate = this.formatDate(response.data.lastMaintDate);
      this.mLoadLimit = response.data.loadLimit;
      this.mLoadTypes = response.data.loadTypes;
      this.mLocationNow = response.data.locationNow;
      this.mLtWeight = response.data.ltWeight;
      this.mModelLength = response.data.modelLength;
      this.mModelWeight = response.data.modelWeight;
      this.numberBlt = response.data.numberBlt;
      this.mRfid = response.data.rfid;
      this.mRsStatus = response.data.rsStatus;
      this.mId = response.data._id;
      this.mNotes = response.data.notes;
      this.isCardModalActive = true;
    },
    formatDate(unformatDate) {
      if (unformatDate === null || unformatDate === "") {
        return "";
      } else {
        return moment.utc(unformatDate).format("MM/DD/YYYY");
      }
    },
  },
};
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 1100px;
  padding: 10px;
}
.center {
  text-align: center;
}
.tsize {
  display: block;
  margin: auto;
  width: 750px;
}
div.columns {
  width: 670px;
  background-color: white;
  padding: 10px;
}
.modal-card-head {
  background-color: rgb(106, 181, 243);
  width: 680px;
}
.modal-card-body {
  background-color: white;
  width: 680px;
}
.modal-card-foot {
  background-color: rgb(106, 181, 243);
  width: 680px;
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
a {
  color: #474749;
}
</style>
