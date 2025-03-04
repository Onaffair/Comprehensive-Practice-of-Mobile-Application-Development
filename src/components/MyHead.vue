<script setup>

import {useRouter} from "vue-router";

const props = defineProps({
    title:String
})
const router = useRouter()

</script>

<template>
    <nut-navbar :title="props.title" left-show @click-back="router.back">
        <template #right>
            <slot name="right"></slot>
        </template>
        <template #title-icon>
            <slot name="title-icon"/>
        </template>
        <template #content>
            <slot name="content"></slot>
        </template>
    </nut-navbar>
</template>

<style scoped>

</style>