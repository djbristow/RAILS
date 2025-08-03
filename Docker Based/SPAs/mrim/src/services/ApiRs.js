
import axios from 'axios'

// --- CHANGE THIS LINE ---
// const baseurl =  'http://' + import.meta.env.VITE_MYRIDS_URI; // OLD, INCORRECT
const baseurl = import.meta.env.VITE_MYRIDS_URI; // NEW, CORRECT: This will be "/api/rids"
// --- END CHANGE ---

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