<template>
  <section>
    <div class="center">
      <p class="title is-5">Update Micro Controller</p>
    </div>
    <br />
    <div class="form">
      <div class="content">
        <b-field label="Name">
          <b-input v-model="microID" />
        </b-field>
        <b-field label="IP">
          <b-input v-model="microIP" />
        </b-field>
        <b-field label="Purpose">
          <b-input v-model="purpose" type="textarea" />
        </b-field>
        <b-field label="Last Update">
          <b-input v-model="et" />
        </b-field>
        <button class="button is-light" @click="updateMicro">Update Micro Controller</button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "EditMicro",
  data() {
    return {
      microID: "",
      microIP: "",
      purpose: "",
      et: "",
    };
  },
  mounted() {
    this.getMicro();
  },
  methods: {
    async getMicro() {
      const response = await RsService.getMicro({
        id: this.$route.params.id,
      });
      this.microID = response.data.microID;
      this.microIP = response.data.microIP;
      this.purpose = response.data.purpose;
      this.et = response.data.et;
    },
    async updateMicro() {
      await RsService.updateMicro({
        id: this.$route.params.id,
        microID: this.microID,
        microIP: this.microIP,
        purpose: this.purpose,
        et: this.et,
      });
      this.$router.push({
        name: "MicroList",
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
