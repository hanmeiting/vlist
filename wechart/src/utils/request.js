import axios from 'axios'

// create an axios instance
// axios.default.withCredentials = true
const service = axios.create({
  // baseURL: 'http://localhost:3001', // url = base url + request url
  // withCredentials: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  }
)

export default service