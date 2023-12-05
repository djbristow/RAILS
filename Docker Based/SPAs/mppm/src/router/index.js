import { createRouter, createWebHashHistory } from "vue-router";
import Admin from "../views/Admin.vue";
import About from "../views/About.vue";
import MrCompanies from "../views/MrCompanies.vue";
import Projects from "../views/Projects.vue";
import Purchases from "../views/Purchases.vue";
import GroupedPurchases from "../views/GroupedPurchases.vue";

const routes = [
  {
    path: "/Admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/",
    name: "About",
    component: About,
  },
  {
    path: "/MrCompanies",
    name: "MrCompanies",
    component: MrCompanies,
  },
  {
    path: "/Projects",
    name: "Projects",
    component: Projects,
  },
  {
    path: "/Purchases",
    name: "Purchases",
    component: Purchases,
  },
  {
    path: "/GroupedPurchases",
    name: "GroupedPurchases",
    component: GroupedPurchases,
  },
];
const router = createRouter({ history: createWebHashHistory(), routes });
export default router;
