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
import ImageUpLoader from "../components/ImageUpLoader.vue";
const props = defineProps({
    id: String,
})

const showPop = ref(false)
const counterStore = useCounterStore()
const counterRef = storeToRefs(counterStore)
const userStore = useUserStore()
const userRef = storeToRefs(userStore)
const isLogin = ref(userRef.getIsLogin)
const uuid = userStore.getUserDetail.uuid
const commentData = reactive({
    content:'',
    hint:'',
    order:0,
    imgSrc:'',
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

//评论展示
const commentShow = computed(() =>{
    let allComment = comments.value
    if (allComment !== null){
        let res = organizeComments(allComment)
        console.log("整理后的评论",res)
        return res
    }
    return null
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
    console.log("评论内容",commentData)
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

const onImgSuccess = ({src}) =>{
    commentData.imgSrc = src
}
function organizeComments(allComments) {
    // 辅助函数：从hint中提取被引用的内容
    const getQuotedContent = (hint) => {
        if (!hint.startsWith('引用:')) return null;
        return hint.split('@')[0].substring(3).trim(); // 提取"引用:"后的内容
    };

    // 创建内容到评论的映射（假设内容唯一）
    const contentMap = new Map();
    allComments.forEach(comment => contentMap.set(comment.content, comment));

    // 查找根父级评论（一级评论）
    const findRootParent = (comment) => {
        let current = comment;
        while (current.hint !== '') {
            const quotedContent = getQuotedContent(current.hint);
            if (!quotedContent || !contentMap.has(quotedContent)) break;
            current = contentMap.get(quotedContent);
        }
        return current.hint === '' ? current : null;
    };

    // 初始化结果结构
    const resultMap = new Map();

    // 处理一级评论
    allComments.forEach(comment => {
        if (comment.hint === '') {
            resultMap.set(comment.id, {
                firstComment: comment,
                secondComment: []
            });
        }
    });

    // 处理二级评论
    allComments.forEach(comment => {
        if (comment.hint !== '') {
            const rootParent = findRootParent(comment);
            if (rootParent && resultMap.has(rootParent.id)) {
                resultMap.get(rootParent.id).secondComment.push(comment);
            }
        }
    });

    return Array.from(resultMap.values());
}
const getAbsoluteImgSrc = (src) =>{
    const res = imageBaseUrl + src
    return  res
}


onMounted( async () =>{
    refreshRun()
    itemRefreshCount.value++

})
</script>

<template>
    <div>
        <div >
            <MyHead :title="computedTitle" @click="changePopStatus"/>
            <nut-space
                v-if="showPop"
                direction="vertical"
                align="center"
                fill
            >
                <MyCard v-bind="itemData"/>
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
            <!--        一级评论-->
            <a-comment
                align="right"
                v-for="item in commentShow"
                :author="item.firstComment.owner.name"
                :avatar="imageBaseUrl+item.firstComment.owner.avatar"
                :datetime="formatDateTime(item.firstComment.create_time)"
                :key="item.firstComment.item_id"
            >
                <template #actions>
                    <div>
                     <span @click="setReplyHint(item.firstComment)">
                        <IconMessage />引用
                    </span>
                        <span v-if="item.firstComment.owner_id===uuid" @click="commitDeleteComment(item.firstComment)">
                        <IconDelete/>删除
                    </span>
                    </div>
                </template>
                <template #content>
                    <div v-if="item.firstComment.hint" style="color:grey">
                        {{item.firstComment.hint}}
                    </div>
                    <div>
                        {{item.firstComment.content}}
                    </div>
                    <div>
                        <nut-image :src="getAbsoluteImgSrc(item.firstComment.imgSrc)" width="30%"/>
                    </div>
                </template>
                <!--            二级评论-->
                <a-comment
                    align="right"
                    v-for="subItem in item.secondComment"
                    :author="subItem.owner.name"
                    :avatar="imageBaseUrl+subItem.owner.avatar"
                    :datetime="formatDateTime(subItem.create_time)"
                    :key="subItem.item_id"
                >

                    <template #actions>
                    <span @click="setReplyHint(subItem)">
                        <IconMessage />引用
                    </span>

                        <span v-if="subItem.owner_id === uuid" @click="commitDeleteComment(subItem)">
                            <IconDelete/>删除
                        </span>
                    </template>
                    <template #content>
                        <div v-if="subItem.hint" style="color:grey">
                            {{subItem.hint}}
                        </div>
                        <div>
                            {{subItem.content}}
                        </div>
                        <div>
                            <nut-image :src="getAbsoluteImgSrc(subItem.imgSrc)" width="30%"/>
                        </div>
                    </template>
                </a-comment>
            </a-comment>

        </div>
        <!--        输入评论-->
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
                <div>
                    <ImageUpLoader
                        :img-src="commentData.imgSrc"
                        @onSuccess="res => onImgSuccess(res)"
                    />
                </div>
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
    scrollbar-width: none;
    margin: 5% auto auto;
}





</style>