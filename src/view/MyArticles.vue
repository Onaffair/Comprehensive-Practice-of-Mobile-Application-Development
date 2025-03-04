<script setup>
import {onActivated, ref} from "vue";
import useUserStore from "../store/UserStore.js";
import {storeToRefs} from "pinia";
import {apiGetAllItemByUserId} from "../util/apiUtils.js";
import {useScrollPos} from "../util/strollUtils.js";
import router from "../router/index.js";
import {Search2} from "@nutui/icons-vue";
import ErrorState from "../components/ErrorState.vue";
import ArticleList from "../components/ArticleList.vue";

const searchVal = ref('')
const searchValCommit = ref('')
const counter = ref(0)
const userStore = useUserStore()
const userRef = storeToRefs(userStore)
const isLogin = ref(userStore.getIsLogin)
const uuid = ref(userRef.getUserDetail.value.uuid)
const {list,error,isLoading} = apiGetAllItemByUserId(counter,uuid,searchVal)

useScrollPos()

const refresh = () =>{
    counter.value++
}

const clearFun = () =>{
    console.log('clearFun')
    searchValCommit.value = searchVal.value
}
const addArticle = () =>{
    console.log('add article')
    router.push({name:'postArticle'})
}
const searchFun = () =>{
    searchValCommit.value = searchVal.value
    console.log('search',searchValCommit.value)
}
onActivated(() =>{
    refresh()
})
</script>

<template>
    <div>
        <nut-searchbar
            v-model="searchVal"
            @clear="clearFun"
            @search="searchFun"
            placeholder="搜索"
        >
            <template #rightin>
                <Search2 @click="searchFun"/>
            </template>
            <template #rightout>
                <nut-tag type="danger" @click="addArticle">发布文章</nut-tag>
            </template>
        </nut-searchbar>
        <ErrorState
            v-if="error"
            :isLoading="isLoading"
            @refreshRun="refresh"
        />
        <ArticleList :items="list"/>
        <div v-if="!isLogin" class="center">
            <nut-button type="info" @click="router.push({name:'login'})">
                去登录页面
            </nut-button>
        </div>
    </div>
</template>

<style scoped>
.center{
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>