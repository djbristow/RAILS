import axios from 'axios'

const baseurl =  import.meta.env.VITE_MYPPDS_URI;
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
