import axios from 'axios'

const baseurl =  'http://' + import.meta.env.VITE_MYIPTS_TCP_URI;
const ApiIp = axios.create({  
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
export default() => {
  return ApiIp
}