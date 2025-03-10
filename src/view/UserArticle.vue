<script setup>

import MyHead from "../components/MyHead.vue";
import {apiChangeFollow, apiGetAllItemByUserId} from "../util/apiUtils.js";
import {computed, onBeforeMount, ref} from "vue";
import ArticleList from "../components/ArticleList.vue";
import ErrorState from "../components/ErrorState.vue";
import {imageBaseUrl} from "../store/basic-data.js";
import {IconStar,IconStarFill} from "@arco-design/web-vue/es/icon/index.js";
import useUserStore from "../store/UserStore.js";


const props = defineProps({
    id:String,
    name:String
})
const userStore = useUserStore()
const timeCounter = ref(0)
const {list,error,isLoading} = apiGetAllItemByUserId(timeCounter,props.id)
const refreshRun = () =>{
    timeCounter.value ++
}

const isFollowed = computed(() =>{
    let arr = userStore.getFollow
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].following_id === props.id) {
            return true
        }
    }
    return false
})

const changeFollow =async () =>{
    const params = {
        following_id:props.id
    }

    await apiChangeFollow(params)
}


onBeforeMount(() =>{
    refreshRun()
})

</script>

<template>
    <div>
        <MyHead :title="props.name+'的文章'"/>
        <div>
            <nut-cell v-if="list">
                <template #title>
                    <span style="align-items: center;display: flex;">
                        <nut-avatar>
                            <img :src="imageBaseUrl+list[0].owner.avatar" alt=""/>
                        </nut-avatar>
                            {{props.name}}
                    </span>
                </template>
                <template #desc>
                    <div
                        class="follow-button"
                    >
                        <nut-button
                            shape="square"
                            @click="changeFollow"
                        >
                            <div v-if="isFollowed">
                                <IconStarFill/>
                                <span>取消关注</span>
                            </div>
                            <div v-else>
                                <IconStar/>
                                <span >关注</span>
                            </div>
                        </nut-button>
                    </div>

                </template>
            </nut-cell>
        </div>
        <div>
            <ErrorState
                v-if="error"
                :isLoading="isLoading"
                @refreshRun="refreshRun"
            />
        </div>
        <div>
            <ArticleList :items="list"/>
        </div>
    </div>

</template>

<style scoped>
.follow-button {
    display: inline-block;
    cursor: pointer;
    position: relative;
}

.follow-text {
    font-size: 14px;
    color: #333;
}
</style>