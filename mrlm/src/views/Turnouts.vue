<template>
    <div class="xx">
        <h1>Turnouts</h1>
        <v-btn @click="addTurnout()" width="200">Add Turnout</v-btn>
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Controller</th>
                    <th class="text-left">Number</th>
                    <th class="text-left">Type</th>
                    <th class="text-left">Last Update</th>
                    <th class="text-left">State</th>
                    <th class="text-left">Points</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in turnouts" :key="item.id">
                    <td>{{ item.toID }}</td>
                    <td>{{ item.controller }}</td>
                    <td>{{ item.toNum }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.lastUpdate }}</td>
                    <td>{{ item.state }}</td>
                    <td>
                        <div v-if="item.lock !== ''">
                            <v-icon color="red darken-1">
                            mdi-lock
                        </v-icon>
                        </div>
                        <div v-else>
                            <div v-if="item.state === 'CLOSED'">
                                <v-icon @click="throwTo(item)"> mdi-electric-switch-closed</v-icon>
                            </div>
                            <div v-else>
                                <v-icon @click="closeTo(item)" >mdi-electric-switch</v-icon>
                            </div>
                        </div>
                    </td>
                    <td>
                        <v-icon color="blue darken-1" @click="editTurnout(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="red darken-1" @click="deleteTurnout(item)">mdi-delete</v-icon>
                    </td>
                </tr>
            </tbody>
            <v-dialog v-model="editTurnoutDialog">
                <dialog-edit-turnout :turnout="editableTurnout" @closeEditTurnoutDialog="editTurnoutDialog = false" />
            </v-dialog>
            <v-dialog v-model="deleteTurnoutDialog">
                <dialog-delete-turnout :turnout="editableTurnout"
                    @closeDeleteTurnoutDialog="deleteTurnoutDialog = false" />
            </v-dialog>
            <v-dialog v-model="addTurnoutDialog">
                <dialog-add-turnout @closeAddTurnoutDialog="addTurnoutDialog = false" />
            </v-dialog>
        </v-table>
        <br />
    </div>
</template>

<script>
import DialogEditTurnout from "../components/dialogs/DialogEditTurnout.vue";
import DialogDeleteTurnout from "../components/dialogs/DialogDeleteTurnout.vue";
import DialogAddTurnout from "../components/dialogs/DialogAddTurnout.vue";
import RlService from "../services/RlService";
export default {
    components: {
        DialogEditTurnout,
        DialogDeleteTurnout,
        DialogAddTurnout,
    },
    data: () => ({
        editTurnoutDialog: false,
        deleteTurnoutDialog: false,
        addTurnoutDialog: false,
        editableTurnout: null,
    }),
    computed: {
        turnouts() {
            return this.$store.state.turnouts;
        },
    },
    methods: {
        addTurnout() {
            this.addTurnoutDialog = true;
        },
        deleteTurnout(item) {
            this.editableTurnout = item;
            this.deleteTurnoutDialog = true;
        },
        editTurnout(item) {
            this.editableTurnout = item;
            this.editTurnoutDialog = true;
        },
        async throwTo(item) {
            item.lock = "MRLM";
            this.$store.dispatch("updateTurnout", item);
            this.pubToMsg(item.toID, "THROW");
            this.pubLightMsg(item);
        },
        async closeTo(item) {
            item.lock = "MRLM";
            this.$store.dispatch("updateTurnout", item);
            this.pubToMsg(item.toID, "CLOSE");
            this.pubLightMsg(item);
        },
        async pubToMsg(id, cmd) {
            const turnout = this.turnouts.find((turnout) => turnout.toID === id);
            const msg = {
                topic: turnout.controller,
                to: turnout.toNum,
                cmd: cmd,
            };
            console.log(msg);
            await RlService.postToMsg(msg);
        },
        pubLightMsg(item) {
            let tpl = this.$store.getters['getTplightByTo_Id'](item._id);
            console.log(tpl);
            if (tpl !== null) {
                const msg = {
                    topic: tpl.controller,
                    tplNum: tpl.tplNum,
                    color: "RED",
                };
                console.log(msg);
                RlService.postTplMsg(msg);
            }
            this.$store.dispatch("updateTurnout", item);
        },
        formatDate(epochTime) {
            if (epochTime === null || epochTime === "") {
                return "";
            } else {
                return moment
                    .utc(epochTime * 1000)
                    .local()
                    .format("DD MM YY hh:mm:ss");
            }
        },
    },
};
</script>