import {_axios} from "../util/index.js";
import qs  from 'qs'
import {alertFail, showSuccess} from "../util/showMessages.js";
import useUserStore from "../store/UserStore.js";
import {apiGetAllFollow, apiGetReadByUserId, apiGetStarByUserId} from "../util/apiUtils.js";

const userStore = useUserStore()
const login = async (loginData) =>{
    return _axios({
        url:"auth/jwt/login",
        method:"post",
        data:qs.stringify(loginData)
    })
        .then(async res =>{
            try {
                const token = "Bearer " + res.data.access_token;
                _axios.defaults.headers["authorization"] = token
                userStore.setToken(res.data)
                userStore.setLoginState(true)
                userStore.setUserName(loginData.username)
                userStore.setPassword(loginData.password)

                await profile()  //获取用户信息
                await apiGetStarByUserId() //获取点赞信息
                await apiGetReadByUserId()
                await apiGetAllFollow()
                return res?.data
            }catch (e){
                userStore.setLoginState(false)
                alertFail(login.name,e?.message)
            }
        })
        .catch(error =>{
            alertFail(login.name,"登录发生错误，服务端未响应")
        })
}

const profile = () =>{
    return _axios({
        url:"/users/me/",
        method:"get"
    })
        .then(res => {
            userStore.setUser(res?.data)
            return res?.data
        })
        .catch(error => {
            alertFail(profile.name,error)
        })
}


const detailProfile = () =>{
    return _axios({
        url:"/users/mine/",
        method:"get"
    })
        .then(res => {
            userStore.setUserDetail(res?.data)
            return res.data
        })
        .catch(error => {
            alertFail(detailProfile.name,error)
        })
}

const logout =async () =>{
   let res
    try {
       res = await _axios.post('/auth/jwt/logout')
        userStore.setLoginState(false)
        userStore.setUserDetail({})
        userStore.setUser({})
        userStore.setToken("")
        userStore.setStar([])
        return Promise.resolve(res.data ? res.data : res?.statusText)
    }catch (e){
        alertFail(logout.name,e?.message)
        if (res?.status && res.status === 401){
            userStore.setLoginState(false)
            userStore.setUserDetail({})
            userStore.setUser({})
            userStore.setToken("")
            userStore.setStar([])
        }
    }
}

const userRename = async (postData) =>{
   try{
       let data = await _axios.post('/users/rename/',postData)
       showSuccess(userRename.name,data)
       return Promise.resolve(data)
   }catch (e){
       alertFail(userRename.name,e)
   }
}
const userModifyPwd = async (pwd) =>{
    try{
        let user = await detailProfile()
        if (user){
            user.password = pwd

            let res = await _axios.patch('/users/me',user)

            if (res.data){
                showSuccess(userModifyPwd.name,res?.data)
                return Promise.resolve(res.data)
            }else{
                alertFail(userModifyPwd.name,res?.data)
            }
        }else{
            alertFail(userModifyPwd.name,'获取用户信息失败')
        }
    }catch (e){
        alertFail(userModifyPwd.name,e)
    }
}

const userRegister =async (postData) =>{
    postData.is_active = true
    postData.is_superuser = false
    postData.is_verified = false
    try{
        let res = await _axios.post('/auth/register',postData)
        if(res?.data){
            let loginData = {username:postData.email,password:postData.password}

            await login(loginData)
            let out = await userRename({name:postData.email,avatar:""})
            showSuccess(userRegister.name,out.data)
            return Promise.resolve(out.data)
        }else{
            alertFail(userRegister.name,"fail to register")
        }
    }catch (e){
        let detail = e?.response?.data?.detail
        alertFail(userRegister.name,detail?detail:e?.message)
    }

}

const loginOnLaunch = async () =>{
    if (userStore.isLogin){
        let loginData ={
            username:userStore.username,
            password:userStore.getDecodePwd
        }
        try{
            let data = await login(loginData)
            if (data){
                let userDetail = await detailProfile()
                if (userDetail){
                    userStore.setUserDetail(userDetail)
                }
                return Promise.resolve(data)
            }else{
                return Promise.reject("login failed")
            }
        }catch (e){
            return Promise.reject(e)
        }
    }
}


export {
    login,
    detailProfile,
    logout,
    userRename,
    userModifyPwd,
    userRegister,
    loginOnLaunch
}
