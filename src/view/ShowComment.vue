<script setup>
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import useCounterStore from "../store/useCounterStore.js";
import {storeToRefs} from "pinia";
import useUserStore from "../store/UserStore.js";
import {imageBaseUrl} from "../store/basic-data.js";
import {apiDeleteCommentById, apiGetCommentsByItemId, apiGetItemById, apiPostComment} from "../util/apiUtils.js";
import {showDialog} from "@nutui/nutui";
import MyHead from "../components/MyHead.vue";
import MyCard from "../components/MyCard.vue";
import ErrorState from "../components/ErrorState.vue";
import {formatDateTime} from "../util/formatUtils.js";
import router from "../router/index.js";
import {
    IconMessage,
    IconDelete
} from "@arco-design/web-vue/es/icon/index.js";
const props = defineProps({
    id: String,
})

const showPop = ref(false)
const counterStore = useCounterStore()
const counterRef = storeToRefs(counterStore)
const userStore = useUserStore()
const userRef = storeToRefs(userStore)
const isLogin = ref(userRef.getIsLogin)
const uuid = userStore.uuid

const commentData = reactive({
    content:'',
    hint:'',
    order:0
})
const userAvatar = imageBaseUrl+userStore.getUserDetail.avatar
const commentCount = ref(counterRef.commentCounter)
const {comments,error,isLoading} = apiGetCommentsByItemId(commentCount,props.id)
const itemRefreshCount = ref(0)
const isNoComment =computed(() =>{
    return comments == null || comments.value == null || comments.value.length === 0
})
const {itemData} = apiGetItemById(props.id,itemRefreshCount)
const computedTitle = computed(() =>{
    return itemData?.value?.title ?? " "
})
const changePopStatus = () =>{
    showPop.value = !showPop.value
    if (showPop.value){
        itemRefreshCount.value++
    }
}
const refreshRun = () =>{
    counterStore.incrementCommentCounter()
}
const setReplyHint = (item) =>{
    commentData.hint = '引用:' + item.content + '@' + item.owner.name
}
const addReply = async () =>{
    console.log(commentData)
    await apiPostComment(props.id,commentData)
    refreshRun()
    commentData.hint = ''
    commentData.content = ''
}

const deleteComment = async (item) =>{
    await apiDeleteCommentById(item.id)
    refreshRun()
}
const commitDeleteComment = async (item) =>{
    let title = "确认删除"+item.owner.name+"的回复吗？",
        content = item.content,
        onCancel = () => {},
        onOk = () => deleteComment(item)
    showDialog({title,content,onCancel,onOk})
}
onMounted( async () =>{
    refreshRun()
    itemRefreshCount.value++

})
</script>

<template>
    <div>
        <MyHead :title="computedTitle" @click="changePopStatus"/>
        <nut-space
            v-if="showPop"
            direction="vertical"
            align="center"
            fill
        >
            <MyCard v-model="itemData"/>
        </nut-space>
    </div>
    <div v-if="error">
        <ErrorState
            :error="error"
            :isLoading="isLoading"
            @refreshRun="refreshRun"
        />
    </div>
    <div >
        <nut-empty
            v-if="isNoComment"
            image="empty"
            description="无评论信息"
        />
    </div>
    <div class="main-body">
        <a-comment
            align="right"
            v-for="item in comments"
            :author="item.owner.name"
            :avatar="imageBaseUrl+item.owner.avatar"
            :datetime="formatDateTime(item.create_time)"
            :key="item.id"
        >
            <template #actions>
                <div>
                     <span @click="setReplyHint(item)">
                        <IconMessage />引用
                    </span>
                    <span v-if="item.onwer_id===uuid" @click="commitDeleteComment(item)">
                        <IconDelete/>删除
                    </span>
                </div>
            </template>
           <template #content>
               <div v-if="item.hint" style="color:grey">
                   {{item.hint}}
               </div>
               <div>
                   {{item.content}}
               </div>
           </template>
        </a-comment>
        <a-comment
            align="right"
            v-if="isLogin"
            :avatar="userAvatar"
        >
            <template #actions>
                <div>
                    <a-button
                        type='primary'
                        :key="0"
                        v-if="!counterStore.commentCounterEnabled"
                        :loading="isLoading"
                        @click="refreshRun"
                    >
                        刷新
                    </a-button>
                    <a-button
                        key="1"
                        type='primary'
                        @click="addReply"
                    >
                        发送
                    </a-button>
                </div>
            </template>
            <template #content>
                <div v-if="commentData.hint" style="color:grey">
                    <a-input v-model="commentData.hint" readonly>
                        <template #append>
                            <span @click="commentData.hint = ''">取消引用</span>
                        </template>
                    </a-input>
                </div>
                <a-input
                    placeholder="Here is your reply."
                    v-model="commentData.content"
                />
            </template>
        </a-comment>
        <nut-cell
            v-else
            title="未登录 不能评论"
            is-link
            @click="router.push({name:'login'})"
        />
    </div>
</template>

<style scoped>
.action{
    display: flex;
    padding: 0 4px;
    color: var(--color-text-1);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor:pointer;
    transition: all 0.1s ease;
}
.action:hover{
    background: var(--color-fill-3);
}
.main-body{
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    width: 90%;
    margin: 5% auto auto;
}





</style>