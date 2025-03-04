<script setup>

const props =defineProps({
    error:String,
    isLoading:Boolean,
})
const emits = defineEmits(['refreshRun'])
const refreshRun = () => {
    emits('refreshRun')
}
</script>

<template>
    <div>
        <nut-empty
            v-if="props.error"
            image="error"
            description="Error"
        >
            <nut-cell>
                <nut-ellipsis
                    :content="props.error"
                    expand-text="展开"
                    rows="3"
                    class="my-ellipsis"
                    collapse-text="收起"
                />
            </nut-cell>
        </nut-empty>
    </div>
</template>

<style scoped>
.my-ellipsis{
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: pre-wrap;
}
</style>