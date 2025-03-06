<script setup>

import useUserStore from "../store/UserStore.js";
import {storeToRefs} from "pinia";
import {reactive, ref} from "vue";
import router from "../router/index.js";
import MyHead from "../components/MyHead.vue";
import PostComponent from "../components/PostComponent.vue";

const userStore = useUserStore()
const userRef = storeToRefs(userStore)
const isLogin = ref(userRef.getIsLogin)
const itemId =ref(0)
const formData = ref({
    title:"",
    description:"",
    price:0,
    vipPrice:0,
    content:"",
    src:"",
    id:0,
})
const imgContents = ref([
    reactive({
        name:"",
        url:"",
        img_content:"",
        order:0,
        id:0
    })
])
const replaceView = (id) =>{
    router.push({name:'showArticle',query:{id:id}})
}

</script>

<template>
    <div>
        <MyHead title="发布文章"/>
        <nut-cell
            title="请先登录"
            desc="未登录不能发布文章"
            v-if="!isLogin"
            @click="router.back()"
        />
        <div v-else>
            <PostComponent
                v-model:item-id="itemId"
                v-model:form-data="formData"
                v-model:img-contents="imgContents"
                @onSubmit="id => replaceView(id)"
            />
        </div>
    </div>
</template>

<style scoped>

</style>