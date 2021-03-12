<template>
  <section>
    <div class="mgr">
      <div class="center">
        <p class="title is-5">Turnout Panel Lights</p>
      </div>
      <b-table :data="tpls" :striped="isStriped" :narrowed="isNarrowed">
        <b-table-column field="toID" label="Turnout" width="100" v-slot="props">{{
          props.row.toID
        }}</b-table-column>
        <b-table-column
          field="panelNum"
          label="#"
          width="50"
          v-slot="props"
          >{{ props.row.panelNum }}</b-table-column
        >
        <b-table-column
          field="panelName"
          label="Panel Name"
          width="100"
          v-slot="props"
          >{{ props.row.panelName }}</b-table-column
        >
        <b-table-column
          field="tplCntlr"
          label="TPL Cntlr"
          width="100"
          v-slot="props"
          >{{ props.row.tplCntlr }}</b-table-column
        >
        <b-table-column
          field="tplNum"
          label="TPL Num"
          width="100"
          v-slot="props"
          >{{ props.row.tplNum }}</b-table-column
        >
        <b-table-column field="_id" label="Action" width="75" v-slot="props">
          <router-link :to="{ name: 'EditTPL', params: { id: props.row.tpl_id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a href="#" @click="deleteTo(props.row.tpl_id)">
            <b-icon icon="delete-forever" />
          </a>
        </b-table-column>
      </b-table>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";

export default {
  name: "TPLList",
  data() {
    return {
      tpls: [],
      isNarrowed: true,
      isStriped: true,
      radio: "",
    };
  },
  mounted() {
    this.getTPLlist();
  },
  methods: {
    async getTPLlist() {
      let response = await RsService.fetchToList();
      let turnouts = response.data.turnouts;
      response = await RsService.fetchTPLightList();
      let tplights = response.data.tplights;
      for (let i = 0; i < tplights.length; i++) {
        let tpl = {
          toID: "",
          panelName: "",
          panelNum: "",
          tplNum: "",
          tplCntlr: "",
          tpl_id: "",
        };
        tpl.panelName = tplights[i].panelName;
        tpl.panelNum = tplights[i].panelNum;
        tpl.tplNum = tplights[i].tplNum;
        tpl.tplCntlr = tplights[i].controller;
        tpl.tpl_id = tplights[i]._id;
        let foundTrnout = turnouts.find(
          (trnout) => trnout._id === tplights[i].to_id
        );
        tpl.toID = foundTrnout.toID;
        this.tpls.push(tpl);
      }
    },
    async deleteTo(id) {
      await RsService.deleteTPL(id);
      this.getTPLlist();
    },
  },
};
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 900px;
  padding: 10px;
}
.center {
  text-align: center;
}
a {
  color: #474749;
}
</style>
