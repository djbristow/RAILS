import axios from 'axios'

const baseurl =  'http://' + import.meta.env.VITE_MYRLDS_TCP_URI;
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