<script setup>
import MyHead from "../components/MyHead.vue";
import useUserStore from "../store/UserStore.js";
import {onBeforeMount, reactive, ref} from "vue";
import {apiAddItemStar, apiGetUnreadItemsFromFollow, apiRemoveItemStar} from "../util/apiUtils.js";
import router from "../router/index.js";
import MyCard from "../components/MyCard.vue";

const userStore = useUserStore()
const articleList = ref(new Map())

const clickStar = async (id) =>{
    let data = await apiAddItemStar(id)
    if (data){
        Object.assign(articleList.value.get(id),data)
    }
}
const clickUnstar = async (id) =>{
    let data = await apiRemoveItemStar(id)
    if (data){
        Object.assign(articleList.value.get(id),data)
    }
}

const gotoShowComment = (id) =>{
    router.push({name:'showComment',query:{id:id}})
}



onBeforeMount(async () =>{
    let res = await apiGetUnreadItemsFromFollow()
    res.forEach(item =>{
        if (articleList.value.has(item.id)){
            Object.assign(articleList.get(item.id),item)
        }else{
            articleList.value.set(item.id,item)
        }
    })
})

</script>

<template>
    <MyHead title="我的关注"/>
    <MyCard
        v-if="articleList"
        v-for="([k,item]) in articleList"
        :key="k"
        v-bind="item"
        @onClickStar="clickStar(item.id)"
        @onClickComment="gotoShowComment(item.id)"
        @onCLickUnStar="clickUnstar(item.id)"
        @onClickItem="router.push({name:'showArticle',query:{id:item.id}})"
        @onClickMoreActions="router.push({name:'showArticle',query:{id:item.id}})"
    />
</template>

<style scoped>

</style>