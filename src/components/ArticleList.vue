<script setup>
import {IconThumbUp,IconMessage,IconDelete} from "@arco-design/web-vue/es/icon/index.js";
import {reactive} from "vue";
import {apiDeleteItemById} from "../util/apiUtils.js";
import {showDialog} from "@nutui/nutui";
import {formatDateTime} from "../util/formatUtils.js";
import router from "../router/index.js";
import {imageBaseUrl} from "../store/basic-data.js";

const props = defineProps({
    items:{
        type:Array,
        default:() => [
            reactive({
                title:"",
                description:"",
                src:"",
                price:"",
                vipPrice:0,
                content:"",
                id:0,
                modify_time:"",
                star:0,
                owner:{
                    name:"",
                    avatar:""
                },
                comment_count:0
            }),
        ]
    }
})
console.log(props.items)
const emits = defineEmits(['onRefresh'])

const dealDelete = async (itemId) =>{
    console.log('dealDelete',itemId)
    await apiDeleteItemById(itemId)
    emits('onRefresh')
}

const confirmDelete = (item) =>{
    showDialog({
        title:item.title,
        content:"确认删除该项内容吗？",
        onOk:() => dealDelete(item.id),
        onCancel:() => {
            console.log('onCancel')
        }
    })
}
const  getTitleMeta = (item)=>{
    return item.owner.name + ' ' + formatDateTime(item.modify_time,true)
}
</script>

<template>
    <div>
        <a-list
            class="list-demo-acton-layout"
            :bordered="false"
            :data="props.items"
        >
            <template #item="{item}">
                <a-list-item
                    class="list-demo-item"
                    action-layout="vertical"
                >
                    <template #actions>
                        <div class="list-action">
                            <nut-row type="flex" justify="space-between">
                                <nut-col :span="8">
                                    <span><IconThumbUp/>{{item.star}}</span>
                                </nut-col>
                                <nut-col :span="8">
                                    <span @click="router.push({name:'showComment',query:{id:item.id}})">
                                        <IconMessage/>{{item.comment_count}}
                                    </span>
                                </nut-col>
                                <nut-col :span="8">
                                    <span @click="confirmDelete(item)">
                                        <IconDelete/>
                                    </span>
                                </nut-col>
                            </nut-row>
                        </div>
                    </template>
                    <template #extra>
                        <div class="image-area">
                            <img
                                alt="arco-design"
                                :src="imageBaseUrl+item.src"
                                @click="router.push({name:'showArticle',query:{id:item.id}})"
                            />
                        </div>
                    </template>
                    <a-list-item-meta
                        :title="getTitleMeta(item)"
                        :description="item.title"
                        @click="router.push({name:'showArticle',query:{id:item.id}})"
                    />
                </a-list-item>
            </template>
            <template #empty>
                <a-empty/>
            </template>
        </a-list>
    </div>
</template>

<style scoped>

.list-demo-acton-layout{

    .image-area{
        display: block;
        width: 45vw;
        align-content: center;
        justify-items: center;
        height: 119px;
        border-radius: 2px;
        overflow: hidden;
        margin:  0 0 0 10px;
        img{
            width: 100%;
        }
    }
    .list-demo-item{
        padding: 20px 0;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        border-bottom: 1px solid var(--color-fill-3);
    }
    .arco-list-item-action{
        .arco-icon{
            margin: 0 4px;
        }
    }
}
.list-action{
    width: 40vw;
}

</style>