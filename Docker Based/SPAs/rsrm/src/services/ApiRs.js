
import axios from 'axios'

let baseurl;
// Check if we are in development mode (npm run dev)
if (import.meta.env.DEV) {
  // For local development
  baseurl = import.meta.env.VITE_MYRIDS_URI_DEV;
} else {
  // For production (Docker/Nginx)
  baseurl = import.meta.env.VITE_MYRIDS_URI;
}

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
