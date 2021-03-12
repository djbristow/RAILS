<template>
  <section>
    <div class="center">
      <p class="title is-5">Add Turnout Panel Light</p>
    </div>
    <div class="form">
      <div class="content">
        <b-field label="Panel Name">
          <b-input v-model="panelName" />
        </b-field>
        <b-field label="Panel Num">
          <b-input v-model="panelNum" />
        </b-field>
        <b-field label="TPL Cntrlr*">
          <b-input v-model="controller" />
        </b-field>
        <b-field label="TPL Num*">
          <b-input v-model="tplNum" />
        </b-field>
        <b-field label="TO Name">
          <b-input v-model="toID" />
        </b-field>
      </div>
      <button class="button is-light" @click="addTPL">Add TPL</button>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "NewTPL",
  data() {
    return {
      toID: "",
      controller: "",
      tplNum: "",
      panelName: "",
      panelNum: "",
    };
  },
  mounted() {
    this.getTolist();
  },
  methods: {
    async getTolist() {

    },
    async addTPL() {
      const resp = await RsService.getToByName (this.toID)
      let to_id = resp.data._id
      await RsService.addTPL({
        controller: this.controller,
        tplNum: this.tplNum,
        panelName: this.panelName,
        panelNum: this.panelNum,
        to_id: to_id
      });
      this.$router.push({
        name: "TPLList",
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
