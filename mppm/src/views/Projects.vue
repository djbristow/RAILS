<template>
  <div class="xx">
    <h1>Model Railroad Projects</h1>
    <v-btn @click="addProject()" width="200">Add Project</v-btn>
    <v-table density="compact" fixed-header height="800px">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Type</th>
          <th class="text-left">Description</th>
          <th class="text-left" style="width: 150px;">Start</th>
          <th class="text-left" style="width: 150px;">End</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projectsStore.projects" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatDate(item.startdate) }}</td>
          <td>{{ formatDate(item.enddate) }}</td>
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

<script setup>
import { ref } from "vue";
import { useProjectsStore } from "@/stores/projects";
import moment from 'moment'
import DialogEditProject from "@/components/dialogs/DialogEditProject.vue";
import DialogDeleteProject from "@/components/dialogs/DialogDeleteProject.vue";
import DialogAddProject from "@/components/dialogs/DialogAddProject.vue";

const editProjectDialog = ref(false);
const deleteProjectDialog = ref(false);
const addProjectDialog = ref(false);
const editableProject = ref(null);
const projectsStore = useProjectsStore();
const formatDate = (unformatDate) => {
  if (unformatDate === null || unformatDate === '') {
    return ''
  } else {
    return moment.utc(unformatDate).format('YYYY-MM-DD')
  }
}
const addProject = () => {
  addProjectDialog.value = true;
};
const editProject = (project) => {
  editableProject.value = project;
  editProjectDialog.value = true;
};
const deleteProject = (project) => {
  editableProject.value = project;
  deleteProjectDialog.value = true;
};
</script>
