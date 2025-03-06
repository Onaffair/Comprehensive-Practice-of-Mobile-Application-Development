<script setup>
import {
    IconThumbUp,
    IconMessage,
    IconMore,
    IconThumbUpFill
} from "@arco-design/web-vue/es/icon/index.js";
import {computed, onBeforeMount} from "vue";
import {imageBaseUrl} from "../store/basic-data.js";
import {formatDateTime} from "../util/formatUtils.js";
import router from "../router/index.js";
import useUserStore from "../store/UserStore.js";


const userStore = useUserStore()

const props = defineProps({
    src:String,
    title:String,
    description:String,
    star:Number,
    id:Number,
    modify_time:String,
    comment_count:Number,
    showMessage:{
        type:Boolean,
        default:() => true
    },
    owner:{
        type:Object,
        default:() =>{
            return {
                name:"",
                avatar:""
            }
        }
    },
    owner_id:String,
})
const emit = defineEmits([
    'onClickStar',
    'onClickComment',
    'onClickMoreActions',
    'onClickItem',
    'onCLickUnStar',
])

const modify_time = computed(() => formatDateTime(props.modify_time,true))

const onClickStar = () =>{
    emit('onClickStar',props.id)
}
const onClickMessage = () =>{
    emit('onClickComment',props.id)
}
const onClickMore = () =>{
    emit('onClickMoreActions',props.id)
}
const onClickItem = () =>{
    emit('onClickItem',props.id)
}
const onClickUnStar = () =>{
    emit('onCLickUnStar',props.id)
}
const avatarAlter = computed(() =>props.owner?.name ? props.owner.name : '')

const avatarSrc = computed(() => imageBaseUrl+props.owner.avatar)

const imgSrc = computed(() => imageBaseUrl+props.src)

onBeforeMount(() =>{
    // console.log("MyCard",props)
})
</script>

<template>
    <div>
        <a-card :style="{width:'96vw'}">
            <template #actions v-if="props.showMessage">
                <span class="icon-hover"
                      v-if="userStore.getStar.find(item => item.article_id === props.id)"
                      @click="onClickUnStar"
                >
                    <IconThumbUpFill/>
                    {{props.star}}
                </span>
                <span class="icon-hover"
                    v-else
                    @click="onClickStar"
                >
                    <IconThumbUp/>
                    {{props.star}}
                </span>
                <span class="icon-hover" @click="onClickMessage" >
                    <IconMessage />{{props.comment_count}}
                </span>
                <span class="icon-hover" @click="onClickMore">
                    <IconMore/>
                </span>
            </template>
            <template #cover>
                <div class="cover">
                    <img
                        class="cover-img"
                        alt="cover"
                        @click="onClickItem"
                        :src="imgSrc"
                    />
                </div>
            </template>
            <a-card-meta :title="props.title">
                <template #description>
                    <div @click="router.push({name:'userArticle',query:{id:props.owner_id,name:props.owner.name}})">
                        {{props.owner.name}}
                    </div>
                </template>
                <template #avatar>
                    <a-avatar :size="24" :style="{marginRight:'8px'}" @click="router.push({name:'userArticle',query:{id:props.owner_id,name:props.owner.name}})">
                        <img
                            :src="avatarSrc" :alt="avatarAlter"
                        />
                    </a-avatar>
                    <a-typography-text>{{modify_time}}</a-typography-text>
                </template>
            </a-card-meta>

        </a-card>



    </div>
</template>

<style scoped>
.icon-hover{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 24px;
    border-radius: 50%;
    transition: all 0.1s;
}
.icon-hover:hover{
    background-color: rgb(var(--gray-2));
}
.cover{
    height: 204px;
    overflow: hidden;
    justify-content: center;
    display: flex;
}
.cover-img{
    width: 92%;
    transform: translateY(10px);
    margin: auto;
}
.avatar{
    display: flex;
    align-items: center;
}
</style>