<script setup>
import {IconDelete,IconBook} from "@arco-design/web-vue/es/icon/index.js";
import {computed, onActivated, ref, watch} from "vue";
import {apiDeleteCommentById, apiGetMyComments} from "../util/apiUtils.js";
import useUserStore from "../store/UserStore.js";
import {storeToRefs} from "pinia";
import {showDialog} from "@nutui/nutui";
import ErrorState from "../components/ErrorState.vue";
import router from "../router/index.js";
import {formatDateTime} from "../util/formatUtils.js";
import {imageBaseUrl} from "../store/basic-data.js";

const counter = ref(1)
const {comments,error,isLoading} = apiGetMyComments(counter)
const userStore = useUserStore()
const userRef = storeToRefs(userStore)
const isLogin = ref(userRef.getIsLogin)
const searchVal = ref('')
const commentShow = ref([])

let timer = null
const delay = 400

watch([comments,searchVal],() =>{

    clearTimeout(timer)

    timer = setTimeout(() =>{
        commentShow.value = comments.value.filter(c => c.content.includes(searchVal.value) || c.item.title.includes(searchVal.value))
        console.log(commentShow.value)
    },delay)

})


const deleteComment = async (c) =>{
    const onOk = async () =>{
        await apiDeleteCommentById(c.id)
        refreshRun()
    }
    showDialog({
        title:"确认删除评论吗？",
        content:c.content,
        onOk,
        onCancel:() => {}
    })
}

const refreshRun = () =>{
    counter.value++
}

onActivated(() =>{
    refreshRun()
})

</script>

<template>
    <div>
        <ErrorState
            :error="error"
            :isLoading="isLoading"
            @refreshRun="refreshRun"
        />
        <nut-searchbar
            v-model="searchVal"
            @clear="searchVal = ''"
            placeholder="搜索"
        />
        <a-list>
            <a-list-item v-for="c in commentShow" :key="c.id">
                <a-list-item-meta
                    :title="c.item.title"
                    @click="router.push({name:'showComment',query:{id:c.item_id}})"
                >
                    <template #description>
                        <div>
                            <span>{{c.content}}</span>
                        </div>
                        <div style="font-size: xx-small">
                            <span>{{formatDateTime(c.create_time)}}</span>
                        </div>
                    </template>
                    <template #avatar>
                        <a-avatar shape="square">
                            <img
                                alt="avatar"
                                :src="imageBaseUrl+c.owner.avatar"
                            />
                        </a-avatar>
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <icon-delete @click="deleteComment(c)"/>
<!--                    后期实现-->
                    <icon-book @click="router.push({name:'showArticle',query:{id:c.item_id}})"/>
                </template>
            </a-list-item>
            <template #empty>
                <a-empty/>
            </template>
        </a-list>
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