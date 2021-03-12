<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Turnout
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        <b-field label="Panel Num">
          <b-input v-model="panelNum" />
        </b-field>
        <b-field label="Panel">
          <b-input v-model="panelName" />
        </b-field>
        <b-field label="TPL Controller">
          <b-input v-model="controller" />
        </b-field>
        <b-field label="TPL Num">
          <b-input v-model="tplNum" />
        </b-field>
         <b-field label="Turnout">
          <b-input v-model="toID" />
        </b-field>
      </div>
      <button
        class="button is-light"
        @click="updateTPL"
      >
        Update TP Light
      </button>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditTPL',
  data () {
    return {
      toID: '',
      controller: '',
      tplNum: '',
      panelName: '',
      panelNum: '',
      tempToID: '',
      to_id: ''
    }
  },
  mounted () {
    this.getTPL()
  },
  methods: {
    async getTPL () {
      const respTpl = await RsService.getTPL({
        id: this.$route.params.id
      })
      this.controller = respTpl.data.controller
      this.tplNum = respTpl.data.tplNum
      this.panelName = respTpl.data.panelName
      this.panelNum = respTpl.data.panelNum
      this.to_id = respTpl.data.to_id
      const respTo = await RsService.getTo({
        id: respTpl.data.to_id
      })
      this.toID =  respTo.data.toID
      this.tempToID = this.toID
    },
    async updateTPL () {
      let t_id = ''
      if ( this.toID === this.tempToID ){
          t_id = this.to_id
        } else {
          const resp = await RsService.getToByName (this.toID)
          t_id = resp.data._id
        }
      console.log(t_id)
      await RsService.updateTPL({
        id: this.$route.params.id,
        to_id: t_id,
        controller: this.controller,
        tplNum: this.tplNum,
        panelName: this.panelName,
        panelNum: this.panelNum
      })
      this.$router.push({
        name: 'TPLList'
      })
    }
  }
}
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
