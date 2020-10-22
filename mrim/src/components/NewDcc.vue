<template>
  <section>
    <div class="center">
      <p class="title is-5">Add DCC Decoder</p>
    </div>
    <br />
    <div class="form">
      <div class="content">
        <b-field label="Road Name">
          <b-input v-model="roadName" />
        </b-field>
        <b-field label="Road Number">
          <b-input v-model="roadNumber" />
        </b-field>
        <b-field label="Manufacturer">
          <b-input v-model="mfg" />
        </b-field>
        <b-field label="Family">
          <b-input v-model="family" />
        </b-field>
        <b-field label="Model">
          <b-input v-model="model" />
        </b-field>
        <b-field label="Address">
          <b-input v-model="address" />
        </b-field>
        <button class="button is-light" @click="addDcc">Add DCC Decoder</button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "NewAar",
  data() {
    return {
      roadName: "",
      roadNumber: "",
      mfg: "",
      family: "",
      model: "",
      address: "",
      locomotiveID: null,
    };
  },
  methods: {
    async addDcc() {
      const response = await RsService.getRsRoad(
        this.roadName + "-" + this.roadNumber
      );
      this.locomotiveID = response.data._id;
      await RsService.addDcc({
        locomotiveID: this.locomotiveID,
        mfg: this.mfg,
        family: this.family,
        model: this.model,
        address: this.address,
      });
      this.$router.push({
        name: "Locomotivelist",
      });
    },
  },
};
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
