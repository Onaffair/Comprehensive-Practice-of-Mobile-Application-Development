<script setup>

import MyHead from "../components/MyHead.vue";
import {apiGetAllItemByUserId} from "../util/apiUtils.js";
import useCounterStore from "../store/useCounterStore.js";
import {storeToRefs} from "pinia";
import {onBeforeMount, ref} from "vue";
import ArticleList from "../components/ArticleList.vue";
import ErrorState from "../components/ErrorState.vue";

const props = defineProps({
    id:String,
    name:String
})

const timeCounter = ref(0)

const {list,error,isLoading} = apiGetAllItemByUserId(timeCounter,props.id)

const refreshRun = () =>{
    timeCounter.value ++
}


onBeforeMount(() =>{
    refreshRun()
})

</script>

<template>
    <div>
        <MyHead :title="props.name+'的文章'"/>
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

</style>