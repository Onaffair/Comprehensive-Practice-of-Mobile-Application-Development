<template>
    <router-view v-slot="{Component}">
        <keep-alive include="home">
            <component :is="Component" :key="$route.path"/>
        </keep-alive>
    </router-view>
</template>
<script setup >
import {onBeforeMount, onBeforeUnmount} from "vue";
import useCounterStore from "./store/useCounterStore.js";

const counterStore = useCounterStore()


onBeforeMount(() =>{
    counterStore.startTImer()
})
onBeforeUnmount(() =>{
    counterStore.stopTimer()
})

</script>