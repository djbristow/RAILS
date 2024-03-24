
import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://' + import.meta.env.VITE_MYRIDS_URI
  })
}
