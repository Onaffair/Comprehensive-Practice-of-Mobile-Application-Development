<script setup>

import {reactive} from "vue";
import {apiDeleteImageById, apiDeleteImageByPath, apiPostItemDetail} from "../util/apiUtils.js";
import ImageUpLoader from "./ImageUpLoader.vue";
import {IconCaretUp,IconCaretDown} from "@arco-design/web-vue/es/icon/index.js";

const itemId = defineModel('itemId')
const formData = defineModel('formData')
const imgContents = defineModel('imgContents')
const emits = defineEmits(['onSubmit'])
const addImageContent = () =>{
    let item = imgContents.value[-1]
    let orderValue = item?.order ? item.order + 1 : 0
    let imgItem = reactive({
        name:"",
        url:"",
        order:orderValue,
        id:0
    })
    imgContents.value.push(imgItem)
    console.log(addImageContent.name,'imgContents',imgContents.value)
}

const deleteImageByItemId =async (item) =>{
    let index = imgContents.value.indexOf(item)
    if (item.id > 0){
        await apiDeleteImageById(item.id)
    }else{
        if (item?.url){
            await apiDeleteImageByPath(item.url)
        }
    }
    imgContents.value.splice(index,1)
}
const onImgContentSuccess = (item,resObj) =>{
    item.name = resObj.name
}
const submitContent =async () =>{
    let id = await apiPostItemDetail(itemId,formData.value,imgContents.value)
    console.log(submitContent.name,'id',id)
    emits('onSubmit',id)
}

const swapUp = (currentItem) =>{

    let itemOfLast = imgContents.value.find(item => item.order ===currentItem.order - 1)

    let tmpOrder = itemOfLast.order
    itemOfLast.order = currentItem.order
    currentItem.order = tmpOrder

    imgContents.value.sort((a, b) => a.order - b.order);
}
const swapDown = (currentItem) =>{
    let itemOfNext = imgContents.value.find(item => item.order ===currentItem.order + 1)

    let tmpOrder = itemOfNext.order
    itemOfNext.order = currentItem.order
    currentItem.order = tmpOrder

    imgContents.value.sort((a, b) => a.order - b.order);
}


</script>

<template>
    <div>
        <nut-form>
            <nut-form-item label="文章标题">
                <nut-textarea
                    v-model="formData.title"
                    :rows="1"
                    autosize
                    :max-length="40"
                />
            </nut-form-item>
            <nut-form-item label="简介">
                <nut-textarea
                    v-model="formData.content"
                    :rows="3"
                    autosize
                    :max-length="2000"
                    limit-show
                />
            </nut-form-item>
            <nut-form-item label="封面内容">
                <ImageUpLoader  v-model:img-src="formData.src"/>
            </nut-form-item>
        </nut-form>
        <nut-swipe-group lock>
            <nut-swipe
                v-for="item in imgContents"
                :key="item.order"
                :name="item.order"
            >
                <a-button
                    type="primary"
                    v-if="item.order !== 0"
                    @click="swapUp(item)"
                >
                    <icon-caret-up />
                </a-button>

                <nut-textarea
                    v-model="item.img_content"
                    :rows="3"
                    autosize
                    :max-length="2000"
                    limit-show
                />
                <ImageUpLoader
                    v-model:img-src="item.url"
                    @on-success="res => onImgContentSuccess(item,res)"
                />

                <a-button
                    type="primary"
                    v-if="item.order !== imgContents.length-1"
                    @click="swapDown(item)"
                >
                    <icon-caret-down />
                </a-button>

                <a-divider/>
                <template #right>
                    <nut-button
                        shape="square"
                        style="height: 100%"
                        type="danger"
                        @click="deleteImageByItemId(item)"
                    >
                        删除
                    </nut-button>
                </template>
            </nut-swipe>
        </nut-swipe-group>
        <nut-space
            :gutter="20"
            style="margin-top: 10px"
        >
            <nut-button
                size="small"
                type="info"
                @click="addImageContent"
            >
                添加内容
            </nut-button>
            <nut-button
                size="small"
                type="primary"
                @click="submitContent"
            >
                提交
            </nut-button>
        </nut-space>
    </div>
</template>

<style scoped>

</style>