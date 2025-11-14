import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

export default instance
