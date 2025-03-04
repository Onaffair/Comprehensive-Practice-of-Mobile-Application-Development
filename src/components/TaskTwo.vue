<script setup>

import {reactive, ref} from "vue";
import {login, logout, detailProfile} from "../api/index.js";
import useUserStore from "../store/UserStore.js";

const info = ref("No Content")

const userStore = useUserStore()

const loginData = reactive({
    username: "aa@wzu.edu.cn",
    password: "123456"
})


const userLogin =  () =>{
    login(loginData)
        .then(res =>{
            userStore.setToken(res)
            userStore.setLoginState(true)
            console.log(userStore.getToken)
            info.value = res
        })
}
const userProfile = () =>{
    detailProfile()
        .then(res =>{
            userStore.setUser(res)
            info.value = res
        })

}
const userLogout = () =>{
    logout()
        .then(res =>{
            userStore.setToken("")
            userStore.setUser({})
            userStore.setLoginState(false)
            info.value = res
        })
}

</script>

<template>
    <div>
        <div>
            <label>aa@wzu.edu.cn
            <input type="password"/></label>
        </div>
        <div><p>22211860247-周智</p></div>
    </div>
    <div>
        <button @click="userLogin">Login</button>
        <button @click="userProfile">Profile</button>
        <button @click="userLogout">Logout</button>
    </div>
    <div>
        {{info}}
    </div>
</template>

<style scoped>

</style>