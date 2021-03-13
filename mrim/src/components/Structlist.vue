<template>
  <section>
    <div class="center">
      <p class="title is-5">Structures Inventory</p>
    </div>
    <div class="tsize">
      <b-table
        :data="structures"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :paginated="isPaginated"
        :per-page="perPage"
        :current-page.sync="currentPage"
      >
        <b-table-column
          field="title"
          label="Title"
          width="150"
          sortable
          v-slot="props"
        >{{ props.row.title }}</b-table-column>
        <b-table-column
          field="structureUse"
          label="Use"
          width="120"
          sortable
          v-slot="props"
        >{{ props.row.structureUse }}</b-table-column>
        <b-table-column
          field="owner"
          label="Owner"
          width="120"
          sortable
          v-slot="props"
        >{{ props.row.owner }}</b-table-column>
        <b-table-column
          field="location"
          label="Location"
          width="200"
          v-slot="props"
        >{{ props.row.location }}</b-table-column>
        <b-table-column
          field="builtDate"
          label="Year Built"
          width="100"
          sortable
          v-slot="props"
        >{{ props.row.builtDate }}</b-table-column>
        <b-table-column field="_id" label="Action" width="100" v-slot="props">
          <a href="#" @click="cardModal(props.row._id)">
            <b-icon icon="details" />
          </a>
          <router-link :to="{ name: 'EditStruct', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a href="#" @click="deleteStruct(props.row._id)">
            <b-icon icon="delete-forever" />
          </a>
        </b-table-column>
      </b-table>
    </div>
    <b-modal :active.sync="isCardModalActive" :width="680">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Structure Details
          <br />
          <span style="font-size:14px">for {{mTitle}}</span>
        </p>
      </header>
      <section class="modal-card-body">
        <div v-if="isImage">
          <img :src="mImageURL" :width="600" />
        </div>
        <div class="columns">
          <div class="column is-half">
            <div class="content">
              Use: {{mStructureUse}}
              <br />
              Owner: {{mOwner}}
              <br />
              Location: {{mLocation}}
              <br />
              Image: {{mImage}}
              <br />
              <div v-if="isVisible">
                Type: {{mType}}
                <br />
                Raw Materials: {{mRawMaterials}}
                <br />
                RM Capacity: {{mRMCapacity}}
                <br />
                Consumption Rate: {{mConRate}}
                <br />
                Priority: {{mPriority}}
                <br />
                AAR Code Inbound: {{mAarCodeIn}}
                <br />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="content">
              Construction: {{mConstruction}}
              <br />
              Year Built: {{mBuiltDate}}
              <br />
              Size: {{mSize}}
              <br />
              <div v-if="isVisible">
                Product: {{mProduct}}
                <br />
                Production Capacity: {{mProductCap}}
                <br />
                Production Rate: {{mProdRate}}
                <br />
                AAR Code Outbound: {{mAarCodeOut}}
                <br />
                Unload Duration: {{mUnloadDuration}}
                <br />
                Load Duration: {{mLoadDuration}}
                <br />
                Siding Capacity: {{mSidingCap}}
                <br />
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          Description:
          <textarea rows="6" cols="50" v-model="mDescription"></textarea>
          <br />
        </div>
        <div class="center" v-if="isVisible">
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
export default {
  name: "Structures",
  data() {
    return {
      structures: [],
      currentPage: 1,
      perPage: 10,
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: "asc",
      isCardModalActive: false,
      isVisible: false,
      isImage: false,
      mId: "",
      mTitle: "",
      mStructureUse: "",
      mDescription: "",
      mOwner: "",
      mLocation: "",
      mConstruction: "",
      mBuiltDate: "",
      mSize: "",
      mImage: "",
      mImageURL: "",
      mIsIndustrial: false,
      mType: "",
      mRawMaterials: "",
      mRMCapacity: "",
      mConRate: "",
      mPriority: "",
      mAarCodeIn: "",
      mProduct: "",
      mProductCap: "",
      mProdRate: "",
      mAarCodeOut: "",
      mUnloadDuration: "",
      mLoadDuration: "",
      mSidingCap: "",
      mNotes: "",
    };
  },
  mounted() {
    this.getStructlist();
  },
  methods: {
    editClose() {
      this.isCardModalActive = false;
      this.$router.push({
        name: "EditStruct",
        params: { id: this.mId },
      });
    },
    modalClose() {
      this.isCardModalActive = false;
    },
    async getStructlist() {
      const response = await RsService.fetchStructlist();
      this.structures = response.data.structures;
    },
    async deleteStruct(id) {
      await RsService.deleteStruct(id);
      this.getStructlist();
    },
    async cardModal(id) {
      this.mImageURL = "";
      this.mId = id;
      const response = await RsService.getStruct({ id: id });
      var n = response.data.image.length;
      if (n > 0) {
        this.isImage = true;
        this.mImageURL = "./static/img/" + response.data.image;
      }
      this.isVisible = response.data.isIndustrial;
      this.mTitle = response.data.title;
      this.mStructureUse = response.data.structureUse;
      this.mDescription = response.data.description;
      this.mOwner = response.data.owner;
      this.mLocation = response.data.location;
      this.mConstruction = response.data.construction;
      this.mBuiltDate = response.data.builtDate;
      this.mSize = response.data.size;
      this.mImage = response.data.image;
      if (this.isVisible) {
        this.mType = response.data.type;
        this.mRawMaterials = response.data.rawMaterials;
        this.mRMCapacity = response.data.rMCapacity;
        this.mConRate = response.data.conRate;
        this.mPriority = response.data.priority;
        this.mAarCodeIn = response.data.aarCodeIn;
        this.mProduct = response.data.product;
        this.mProductCap = response.data.productCap;
        this.mProdRate = response.data.prodRate;
        this.mAarCodeOut = response.data.aarCodeOut;
        this.mUnloadDuration = response.data.unloadDuration;
        this.mLoadDuration = response.data.loadDuration;
        this.mSidingCap = response.data.sidingCap;
        this.mNotes = response.data.notes;
      }
      this.isCardModalActive = true;
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
  width: 850px;
}
.columns {
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
a {
  color: #474749;
}
</style>
