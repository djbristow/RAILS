
import axios from 'axios'

const baseurl =  'http://' + import.meta.env.VITE_MYRIDS_URI;
const ApiRs = axios.create({  
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
export default() => {
  return ApiRs
}