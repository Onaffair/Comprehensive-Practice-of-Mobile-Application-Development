<template>
    <div>
        
        <div style="display: flex;justify-content: center;">
            <img src='../img/forsaken.jpg' style="width: 100%;display: flex;justify-content: center"/>
        </div>
        <div>
            <NutForm >
                <NutFormItem label="用户名">
                    <NutInput v-model='loginData.username'/>
                </NutFormItem>
                <NutFormItem label="密码">
                    <NutInput type="password" v-model='loginData.password'/>
                </NutFormItem>
            </NutForm>
            <div style="display: flex;justify-content: center;">
                <NutButton type='info' @click="postLoginData">登录</NutButton>
            </div>
            <div>
                <nut-row type="flex" justify="center">
                   <nut-col :span="18" fill>
                       <nut-cell title="没有账号 去注册" is-link @click="router.push({name:'register'})"></nut-cell>
                   </nut-col>
                </nut-row>
            </div>
        </div>
    
    </div>
</template>
<script setup>
import { reactive } from 'vue';
import { login } from '../api';
import { showToast } from '@nutui/nutui';
import { useRouter } from 'vue-router';
import useUserStore from "../store/UserStore.js";

const userStore = useUserStore()

const router = useRouter()

const loginData = reactive({
    username: '',
    password: ''
})



const postLoginData = () =>{
    login(loginData)
        .then(res =>{
            showToast.success(JSON.stringify(res))
            if (res.access_token){
                userStore.setLoginState(true)
                userStore.setToken(res)
                router.push({name:'home'})
            }
        })

}


</script>