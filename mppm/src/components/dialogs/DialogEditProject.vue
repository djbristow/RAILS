<template>
    <v-card width="800">
        <v-card-title class="headline"> MR Project </v-card-title>
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
            <v-btn @click="$emit('closeEditProjectDialog')" color="red darken-1" text>
                Cancel
            </v-btn>
            <v-btn :disabled="projectEditDataInvalid" @click="editProject" text>
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: "DialogEditProject",
    props: ["project"],
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
        projectEditDataInvalid() {
            let result = false;
            return result;
        },
    },
    mounted() {
        this.title = this.project.title;
        this.type = this.project.type;
        this.description = this.project.description;
        this.startdate = this.project.startdate;
        this.enddate = this.project.enddate;
        this.roadname = this.project.roadname;
        this.roadnumbers = this.project.roadnumbers;
        this.notes = this.project.notes;
    },
    methods: {
        editProject() {
            let updatedProject = {
                _id: this.project._id,
                title: this.title,
                type: this.type,
                description: this.description,
                startdate: this.startdate,
                enddate: this.enddate,
                roadname: this.roadname,
                roadnumbers: this.roadnumbers,
                notes: this.notes,
            };
            this.$store.dispatch("updateProject", updatedProject);
            this.$emit("closeEditProjectDialog");
        },
    },
};
</script>