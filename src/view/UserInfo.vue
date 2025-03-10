<template>
    <div>
        <nut-navbar title="22211860247-周智"/>
        <div v-if="userStore.getIsLogin">
            <nut-cell title="头像" is-link @click="changeUpLoaderView">
                <template #desc>
                    <nut-avatar size="large" >
                        <img :src="userStore.getUser.avatar"/>
                    </nut-avatar>
                </template>
            </nut-cell>
            <ImageUpLoader
                v-if="upLoaderView"
                v-model:img-src="renameData.avatar"
                :is-compression="true"
                @on-delete="modifyProfile"
                @on-success="modifyProfile"
            />
            <nut-cell :title="'UUID '+userStore.getUser.uuid"/>
            <nut-cell title="姓名" is-link @click="changeNameView">
                <template #desc>
                    <span>{{userStore.getUser.name}}</span>
                </template>
            </nut-cell>
            <nut-input
                v-model="renameData.name"
                placeholder="请输入姓名"
                clearable
                v-if="nameView"
            >
                <template #right>
                    <nut-button type="info" size="small" @click="modifyProfile">
                        确认
                    </nut-button>
                </template>
            </nut-input>
            <nut-cell title="Email">
                <template #desc>
                    <span>{{userStore.getUser.email}}</span>
                </template>
            </nut-cell>
            <nut-cell title="修改密码" is-link @click="changePwdView"/>
            <nut-input
                v-model="newPwd"
                placeholder="请输入新密码"
                clearable
                v-if="pwdView"
                :type="pwdStyle"
            >
                <template #left>
                    <Eye @click="changePwdType"/>
                </template>
                <template #right>
                    <nut-button type="info" size="small" @click="changePwd">确认</nut-button>
                </template>
            </nut-input>
            <nut-cell
                title="我的关注"
                is-link
                @click="router.push({name:'myFollow'})"
            >

            </nut-cell>
            <nut-cell title="发表文章数" is-link @click="userStore.setActiveTab(1)" >
                <template #desc>
                    <span v-if="userStore.getUser.items">{{userStore.getUser.items.length}}</span>
                </template>
            </nut-cell>

            <nut-cell title="发表评论数" is-link @click="userStore.setActiveTab(2)">
                <template #desc>
                    <span v-if="userStore.getUser.comments">{{userStore.getUser.comments.length}}</span>
                </template>
            </nut-cell>
            <nut-cell title="参数设置" is-link @click="router.push({name:'settings'})"/>
            <div style="display: flex;justify-content: center;">
                <NutButton type='primary' @click="userQuit">登出</NutButton>
            </div>
            <div>
            </div>
        </div>
        <div v-else class="center">
            <nut-button type="info" @click="router.push({name:'login'})">
                 去登录页面
            </nut-button>
        </div>
    </div>
</template>
<script setup>
import {onActivated, onBeforeMount, onMounted, reactive, ref} from 'vue';
import {logout, detailProfile, userModifyPwd, userRename} from '../api';
import { useRouter } from 'vue-router';
import useUserStore from "../store/UserStore.js";
import ImageUpLoader from "../components/ImageUpLoader.vue";
import {Eye} from "@nutui/icons-vue";
import {imageBaseUrl} from "../store/basic-data.js";

const router = useRouter()
const userStore = useUserStore()

const renameData = reactive({
    name:'',
    avatar:''
})
const nameView = ref(false)
const upLoaderView = ref(false)
const pwdView = ref(false)
const newPwd = ref(userStore.getDecodePwd)
const inputTypes = ['password','text']
const pwdStyle = ref(inputTypes[0])

const modifyProfile = async () =>{
    await userRename(renameData)
    await detailProfile()
        .then(res =>{
            renameData.avatar = res.avatar
            renameData.name = res.name
            res.avatar = imageBaseUrl+res.avatar
            userStore.setUser(res)
        })
}

const changePwd =  ()=>{
    userModifyPwd(newPwd.value)
        .then(res =>{
            if (res){
                userStore.setPassword(newPwd.value)
            }
        })
}

const changePwdType = () =>{
    if (pwdStyle.value === inputTypes[0]){
        pwdStyle.value = inputTypes[1]
    }else{
        pwdStyle.value = inputTypes[0]
    }
}
const changeNameView =() =>{
    nameView.value = !nameView.value
}
const changePwdView = () =>{
    pwdView.value = !pwdView.value
    if (pwdView.value){
        newPwd.value = userStore.getDecodePwd
    }
}
const changeUpLoaderView = () =>{
    upLoaderView.value = !upLoaderView.value
}

const userQuit = () =>{
    logout()
}
onBeforeMount( () =>{
     detailProfile()
        .then(res =>{
            renameData.avatar = res.avatar
            renameData.name = res.name
            res.avatar = imageBaseUrl+res.avatar
            userStore.setUser(res)
        })
})

onActivated(() =>{
    detailProfile()
        .then(res =>{
            renameData.avatar = res.avatar
            renameData.name = res.name
            res.avatar = imageBaseUrl+res.avatar
            userStore.setUser(res)
        })
})

</script>
<style scoped>


.center{
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

span{
    color: black;
    margin-right: 15px;
}

</style>