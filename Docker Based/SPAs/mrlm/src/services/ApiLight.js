import axios from 'axios'

let baseurl;
// Check if we are in development mode (npm run dev)
if (import.meta.env.DEV) {
  // For local development
  baseurl = import.meta.env.VITE_MYIPLS_URI_DEV;
} else {
  // For production (Docker/Nginx)
  baseurl = import.meta.env.VITE_MYIPLS_URI;
}

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