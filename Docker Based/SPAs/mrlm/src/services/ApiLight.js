import axios from 'axios'

const baseurl =  import.meta.env.VITE_MYIPLS_URI;

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