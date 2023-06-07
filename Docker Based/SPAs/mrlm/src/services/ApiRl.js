import axios from 'axios'

const baseurl =  'http://' + import.meta.env.VITE_MYRLDS_TCP_ADDR + ':' + import.meta.env.VITE_MYRLDS_TCP_PORT;
const ApiRl = axios.create({  
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
export default() => {
  return ApiRl
}