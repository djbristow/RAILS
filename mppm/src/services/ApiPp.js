import axios from 'axios'

const baseurl =  'http://' + import.meta.env.VITE_MYPPDS_TCP_ADDR + ':' + import.meta.env.VITE_MYPPDS_TCP_PORT;
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
