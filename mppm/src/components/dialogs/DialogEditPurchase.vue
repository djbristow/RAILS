<template>
    <v-card width="800">
        <v-card-title class="headline"> Update MR Purchase </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field v-model="num" label="Number"></v-text-field>
                    <v-text-field v-model="date" label="Date"></v-text-field>
                    <v-text-field v-model="store" label="Store"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="item" label="Item"></v-text-field>
                    <v-text-field v-model="desciption" label="Description"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="manufacturer" label="Manufacturer"></v-text-field>
                    <v-text-field v-model="unitcost" label="Unit Cost"></v-text-field>
                    <v-text-field v-model="qty" label="Qty"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="project" label="Project"></v-text-field>
                    <v-text-field v-model="roadname" label="Road Name"></v-text-field>
                    <v-text-field v-model="roadnumbers" label="Road Numbers"></v-text-field>
                </v-row>
                <v-row>
                    <v-textarea v-model="notes" label="Notes"></v-textarea>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeEditPurchaseDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="purchaseEditDataInvalid" @click="editPurchase" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogEditPurchase",
    props: ["purchase"],
    data: () => ({
        num: "",
        date: null,
        store: "",
        item: "",
        desciption: "",
        manufacturer: "",
        unitcost: "",
        qty: "",
        project: "",
        roadname: "",
        roadnumbers: "",
        notes: ""
    }),
    computed: {
        purchaseEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        this.num = this.purchase.num;
        this.date = this.purchase.date;
        this.store = this.purchase.store;
        this.item = this.purchase.item;
        this.desciption = this.purchase.desciption;
        this.manufacturer = this.purchase.manufacturer;
        this.unitcost = this.purchase.unitcost;
        this.qty = this.purchase.qty;
        this.project = this.purchase.project;
        this.roadname = this.purchase.roadname;
        this.roadnumbers = this.purchase.roadnumbers;
        this.notes = this.purchase.notes;
    },
    methods: {
        editPurchase() {
            let updatedPurchase = {
                _id: this.purchase._id,
                num: this.num,
                date: this.date,
                store: this.store,
                item: this.item,
                desciption: this.desciption,
                manufacturer: this.manufacturer,
                unitcost: this.unitcost,
                qty: this.qty,
                project: (this.project === '') ? 'u' : this.project,
                roadname: this.roadname,
                roadnumbers: this.roadnumbers,
                notes: this.notes
            };
            this.$store.dispatch("updatePurchase", updatedPurchase);
            this.$emit("closeEditPurchaseDialog");
        },
    },
};
</script>