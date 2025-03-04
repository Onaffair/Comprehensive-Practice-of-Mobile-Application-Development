<template>
    <div>
        <keep-alive >
            <component :is="currentComponent" />
        </keep-alive>
        <nut-tabbar
           v-model="activeTab"
           @tab-switch="tabSwitch"
           unactive-color="#505050"
           bottom
           safe-area-inset-bottom
           placeholder
        >
            <nut-tabbar-item
                v-for="item in list"
                :key="item.name"
                :tab-title="item.title"
                :icon="item.icon"
            />
        </nut-tabbar>

    </div>
</template>
<script setup>
import AllArticles from "./AllArticles.vue";
import MyArticles from "./MyArticles.vue";
import MyComments from "./MyComments.vue";
import UserInfo from "./UserInfo.vue";
import {h, onMounted, ref, shallowRef, watchEffect} from "vue";
import {Comment, Find, Home, My} from "@nutui/icons-vue";
import {loginOnLaunch} from "../api/index.js";
import router from "../router/index.js";

const components = [
    AllArticles,
    MyArticles,
    MyComments,
    UserInfo
]
const  activeTab = ref(0)
const currentComponent = shallowRef(components[activeTab.value])

const list = [
    {
        title:'所有文章',
        icon:h(Find),
        name:'find'
    },
    {
        title:'我的文章',
        icon:h(Home),
        name:'home'
    },
    {
        title: '我的评论',
        icon: h(Comment),
        name: 'comment'
    },
    {
        title:'个人信息',
        icon: h(My),
        name:'my'
    }
]
onMounted(() =>{
    loginOnLaunch().catch(e =>{
        console.log(e)
        router.push({name:'login'})
    })
})
const tabSwitch = (_,index) =>{
    console.log(index)
    currentComponent.value = components[index]
}

watchEffect(() =>{
    currentComponent.value = components[activeTab.value]
})



</script>