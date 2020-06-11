<template>
  <section>
    <div class="mgr">
      <div class="center">
        <p class="title is-5">
          Model Railroad Layout Manager
        </p>
      </div>
      <div class="form">
        <b-table
          :data="turnouts"
          :striped="isStriped"
          :narrowed="isNarrowed"
        >
          <template slot-scope="props">
            <b-table-column
              field="toID"
              label="ID"
              width="100"
            >
              {{ props.row.toID }}
            </b-table-column>
            <b-table-column
              field="controller"
              label="Controller"
              width="100"
            >
              {{ props.row.controller }}
            </b-table-column>
            <b-table-column
              field="toNum"
              label="Num"
              width="50"
            >
              {{ props.row.toNum }}
            </b-table-column>
            <b-table-column
              field="type"
              label="Type"
              width="50"
            >
              {{ props.row.type }}
            </b-table-column>
            <b-table-column
              field="lastUpdate"
              label="Last Update"
              width="100"
            >
              {{ props.row.lastUpdate }}
            </b-table-column>
            <b-table-column
              field="state"
              label="State"
              width="100"
            >
              {{ props.row.state }}
            </b-table-column>
            <b-table-column
              field="_id"
              label="Action"
              width="100"
              sortable
            >
              <a
                href="#"
                @click="throwTo(props.row._id)"
              >
                <img
                  src="../assets/thrown.svg"
                  alt="An example icon"
                  style="width:32px;height:32px"
                >
              </a>
              <a
                href="#"
                @click="closeTo(props.row._id)"
              >
                <img
                  src="../assets/closed.svg"
                  alt="An example icon"
                  style="width:32px;height:32px;color:red"
                >
              </a>
              <router-link :to="{ name: 'EditTo', params: { id: props.row._id } }">
                <b-icon icon="pencil" />
              </router-link>
              <a
                href="#"
                @click="deleteTo(props.row._id)"
              >
                <b-icon icon="delete-forever" />
              </a>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
import io from 'socket.io-client'
import moment from 'moment'
var socket = io.connect('http://localhost:3010') // connection to ISTS

export default {
  name: 'Turnouts',
  data () {
    return {
      turnouts: [],
      connStatus: 'Disconnected',
      isNarrowed: true,
      isStriped: true,
      radio: ''
    }
  },
  mounted () {
    this.opensocketListener()
    this.getTolist()
  },
  methods: {
    async getTo (message) {
      const res = await RsService.getToByIdentity(message.cntrlr + '-' + message.to)
      await RsService.updateTo({
        id: res.data._id,
        toID: res.data.toID,
        toNum: res.data.toNum,
        controller: res.data.controller,
        state: message.dir,
        type: res.data.type,
        lock: res.data.lock,
        notes: res.data.notes,
        lastUpdate: message.et
      })
      const response = await RsService.fetchToList()
      this.turnouts = response.data.turnouts
    },
    opensocketListener () {
      socket.on('connect', () => {
        this.connStatus = 'Connected'
      })
      socket.on('disconnect', () => {
        this.connStatus = 'Disconnected'
      })
      socket.on('tocmsg', message => {
        this.getTo(message)
      })
    },
    async getTolist () {
      const response = await RsService.fetchToList()
      this.turnouts = response.data.turnouts
    },
    async deleteTo (id) {
      await RsService.deleteTo(id)
      this.getTolist()
    },
    async throwTo (id) {
      const turnout = this.turnouts.find(turnout => turnout._id === id)
      if (turnout.state.toLowerCase() !== 'thrown') {
        const msg = { topic: turnout.controller, to: turnout.toNum, cmd: 'throw' }
        this.pubMsg(msg)
      }
    },
    async closeTo (id) {
      const turnout = this.turnouts.find(turnout => turnout._id === id)
      if (turnout.state.toLowerCase() !== 'closed') {
        const msg = { topic: turnout.controller, to: turnout.toNum, cmd: 'close' }
        this.pubMsg(msg)
      }
    },
    async pubMsg (msg) {
      await RsService.postMsg(msg)
    },
    formatDate (epochTime) {
      if (epochTime === null || epochTime === '') {
        return ''
      } else {
        return moment.utc(epochTime * 1000).local().format('DD MM YY hh:mm:ss')
      }
    }
  }
}
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
