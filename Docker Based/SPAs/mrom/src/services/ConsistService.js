import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_MYRODS_URI_DEV
    : "/api/rods",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default {
  fetchConsistlist() {
    return api.get("/consistlist");
  },
  add(consist) {
    return api.post("/add_consist", consist);
  },
  delete(consistId) {
    return api.delete(`/consist/${consistId}`);
  },
  update(consist) {
    return api.put(`/consist/${consist._id}`, consist);
  },
};
