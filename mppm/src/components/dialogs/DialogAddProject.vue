<template>
    <v-card width="700">
        <v-card-title class="headline"> New MR Project </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field v-model="title" label="Title"></v-text-field>
                    <v-text-field v-model="type" label="Type"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="description" label="Description"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="startdate" label="Start"></v-text-field>
                    <v-text-field v-model="enddate" label="End"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="roadname" label="Road Name"></v-text-field>
                    <v-text-field v-model="roadnumbers" label="Road Number"></v-text-field>
                </v-row>
                <v-row>
                    <v-textarea v-model="notes" label="Notes"></v-textarea>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('closeAddProjectDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="projectAddDataInvalid" @click="addProject" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogAddProject",
    data: () => ({
        title: "",
        type: "",
        description: "",
        startdate: "",
        enddate: "",
        roadname: "",
        roadnumbers: "",
        notes: "",
    }),
    computed: {
        projectAddDataInvalid() {
            let result = false;
            return result;
        },
    },
    methods: {
        addProject() {
            this.$store.dispatch("addNewProject", {
                title: this.title,
                type: this.type,
                description: this.description,
                startdate: this.startdate,
                enddate: this.enddate,
                roadname: this.roadname,
                roadnumbers: this.roadnumbers,
                notes: this.notes,
            });
            this.$emit("closeAddProjectDialog");
        },
    },
};
</script>