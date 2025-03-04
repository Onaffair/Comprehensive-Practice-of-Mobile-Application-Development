<script setup>
import {useRouter} from "vue-router";
import useCounterStore from "../store/useCounterStore.js";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import {Del2} from "@nutui/icons-vue";
import MyHead from "../components/MyHead.vue";

const counterStore = useCounterStore()
const router = useRouter()
const counterRef = storeToRefs(counterStore)
const rangeVal =ref(counterStore.interval)
const articleCounterStatus = ref(counterStore.articleCounterEnabled)
const commentCounterStatus = ref(counterStore.commentCounterEnabled)

const statusChange= () =>{
    counterStore.setCommentCounterEnabled(commentCounterStatus.value)
    counterStore.setArticleCounterEnabled(articleCounterStatus.value)
}
const intervalChange = () => {
    counterStore.setInterval(rangeVal.value)
}

</script>

<template>
    <MyHead :title="'参数设置'"/>
    <nut-cell title="开启评论自动刷新">
        <template #desc>
            <nut-switch v-model="commentCounterStatus"
                        active-color="deepskyblue"
                        @change="statusChange"/>
        </template>
    </nut-cell>
    <nut-cell :title="counterRef.commentCounter"
              desc="当前评论计数器值"/>
    <nut-cell title="开启文章自动刷新">
        <template #desc>
            <nut-switch v-model="articleCounterStatus"
                        active-color="deepskyblue"
                        @change="statusChange"/>
        </template>
    </nut-cell>
    <nut-cell :title="counterRef.articleCounter"
              desc="当前文章计数器值"/>
    <nut-cell title="设置刷新间隔(ms)">
        <template #desc>
            <nut-input-number v-model="rangeVal" :max="20000" :min="100" :step="100" @change="intervalChange"/>
        </template>
    </nut-cell>
</template>

<style scoped>

</style>