<template>
  <div class="xx">
    <h1>Model Railroad Projects</h1>
    <v-btn @click="addProject()" width="200">Add Project</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Type</th>
          <th class="text-left">Description</th>
          <th class="text-left">Start</th>
          <th class="text-left">End</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projects" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.startdate }}</td>
          <td>{{ item.enddate }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editProject(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteProject(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editProjectDialog">
        <dialog-edit-project :project="editableProject" @closeEditProjectDialog="editProjectDialog = false" />
      </v-dialog>
      <v-dialog v-model="deleteProjectDialog">
        <dialog-delete-project :project="editableProject" @closeDeleteProjectDialog="deleteProjectDialog = false" />
      </v-dialog>
      <v-dialog v-model="addProjectDialog">
        <dialog-add-project @closeAddProjectDialog="addProjectDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script>
import moment from 'moment'
import DialogEditProject from "../components/dialogs/DialogEditProject.vue";
import DialogDeleteProject from "../components/dialogs/DialogDeleteProject.vue";
import DialogAddProject from "../components/dialogs/DialogAddProject.vue";
export default {
  components: {
    DialogEditProject,
    DialogDeleteProject,
    DialogAddProject,
  },
  data: () => ({
    editProjectDialog: false,
    deleteProjectDialog: false,
    addProjectDialog: false,
    editableProject: null,
  }),
  computed: {
    projects() {
      function formatDate(unformatDate) {
        if (unformatDate === null || unformatDate === '') {
          return ''
        } else {
          return moment.utc(unformatDate).format('YYYY-MM-DD')
        }
      }
      let projects = this.$store.state.projects;
      projects.forEach((project) => {
        project.startdate = formatDate(project.startdate);
        project.enddate = formatDate(project.enddate);
      });
      return projects;
    },
  },

  methods: {
    addProject() {
      this.addProjectDialog = true;
    },
    deleteProject(item) {
      this.editableProject = item;
      this.deleteProjectDialog = true;
    },
    editProject(item) {
      this.editableProject = item;
      this.editProjectDialog = true;
    },
  },

};
</script>
