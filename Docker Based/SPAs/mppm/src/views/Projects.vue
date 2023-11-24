<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Model Railroad Projects</v-card-title>
        <v-card-actions>
          <v-btn @click="addProject()" width="200">Add Project</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="projectsStore.projects"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.startdate="{ item }">
            <span>{{ formatDate(item.startdate) }}</span>
          </template>
          <template v-slot:item.enddate="{ item }">
            <span>{{ formatDate(item.enddate) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editProject(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteProject(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editProjectDialog">
          <dialog-edit-project
            :project="editableProject"
            @closeEditProjectDialog="editProjectDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteProjectDialog">
          <dialog-delete-project
            :project="editableProject"
            @closeDeleteProjectDialog="deleteProjectDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addProjectDialog">
          <dialog-add-project
            @closeAddProjectDialog="addProjectDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useProjectsStore } from "@/stores/projects";
import moment from "moment";
import DialogEditProject from "@/components/dialogs/DialogEditProject.vue";
import DialogDeleteProject from "@/components/dialogs/DialogDeleteProject.vue";
import DialogAddProject from "@/components/dialogs/DialogAddProject.vue";

const editProjectDialog = ref(false);
const deleteProjectDialog = ref(false);
const addProjectDialog = ref(false);
const editableProject = ref(null);
const projectsStore = useProjectsStore();
const headers = [
  { title: "Title", key: "title" },
  { title: "Type", key: "type" },
  { title: "Description", key: "description" },
  { title: "Start", key: "startdate" },
  { title: "End", key: "enddate" },
  { title: "Actions", key: "actions", sortable: false },
];

const formatDate = (unformatDate) => {
  if (unformatDate === null || unformatDate === "") {
    return "";
  } else {
    return moment.utc(unformatDate).format("YYYY-MM-DD");
  }
};
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
