<template>
    <div>
        <div style="margin-bottom: 10px">
            <nut-button @click="router.push({name:'login'})">登录</nut-button>
        </div>
        <div>
            <nut-image :src="absoluteSrc" width="100" height="100" />
            <a :href="absoluteSrc">跳转</a>
        </div>
        <div>
            <span>压缩图片</span>
            <nut-switch
                v-model="isCompression"
                active-text="是"
                inactive-text="否"
                active-color="deepskyblue"
            />
        </div>
        <div style="margin-bottom: 10px">
            <ImageUpLoader
                :is-compression="isCompression"
                :max-width-or-height="1024"
                v-model:img-src="src"
            />
        </div>

    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import ImageUpLoader from "../components/ImageUpLoader.vue";
import {computed, ref} from "vue";
import {imageBaseUrl} from "../store/basic-data.js";


const router = useRouter()


const isCompression = ref(false)
const src = ref("")
const absoluteSrc = computed(() => imageBaseUrl+src.value)


</script>