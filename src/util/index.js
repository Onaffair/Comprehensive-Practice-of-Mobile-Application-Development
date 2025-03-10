import Axios  from "axios";
import useUserStore from "../store/UserStore.js";


const url = "http://169.254.238.124"
const _axios = Axios.create({
    baseURL: url,
    timeout: 10000
})

const userStore = useUserStore()

_axios.defaults.headers["authorization"] = userStore.getToken?.token_type + " " + userStore.getToken?.access_token
_axios.interceptors.response.use(config =>{
    return config
},error => {
    return Promise.reject(error)
})
_axios.interceptors.request.use(config => {
    return config
}, error =>{
    return Promise.reject(error)
})

export {
    _axios
}
