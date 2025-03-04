import {defineStore} from "pinia";
import CryptoJs from 'crypto-js'
const KEY = "onaffaironaffair"


//加密String
const encryptText = (text) =>{
    return CryptoJs.AES.encrypt(text,KEY).toString()
}
//解密String
const decryptText = (text) =>{
    return CryptoJs.AES.decrypt(text,KEY).toString(CryptoJs.enc.Utf8)
}
//加密Object
const encryptObject = (object) =>{
    return CryptoJs.AES.encrypt(JSON.stringify(object),KEY).toString()
}
//解密Object
const decryptObject = (object) =>{
    return JSON.parse(CryptoJs.AES.decrypt(object,KEY).toString(CryptoJs.enc.Utf8))
}


const useUserStore = defineStore('userStore',{
    state: () =>({
        isLogin:false,
        token:"",
        user:{},
        userDetail:{},
        username:"",
        password:"",
    }),
    getters:{
        getUser:(state) => state.user,
        getToken:(state) => state.token,
        getIsLogin:(state) => state.isLogin,
        getDecodePwd:(state) => decryptText(state.password),
        getUserDetail:(state) => state.userDetail,
    },
    actions:{
        setUser(user){
            this.user = user
        },
        setToken(token){
            this.token = token
        },
        setLoginState(isLogin){
            this.isLogin = isLogin
        },
        setUserName(username){
            this.username = username
        },
        setPassword(password){
            this.password = encryptText(password)
        },
        setUserDetail(userDetail){
            this.userDetail.uuid = userDetail.uuid??''
            this.userDetail.nickname = userDetail.name??''
            this.userDetail.avatar = userDetail.avatar??''
        },
        quit(){
            this.setLoginState(false)
            this.setUser({})
            this.setUserDetail({})
            this.setToken("")
            localStorage.removeItem('userStore')
        }
    },
    persist: {
        serializer:{
            serialize:(state) => encryptObject(state),
            deserialize:(state) => decryptObject(state)
        }
    }
})
export default useUserStore