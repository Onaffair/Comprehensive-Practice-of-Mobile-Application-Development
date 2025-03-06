<script setup>
import {reactive, watchEffect} from "vue";
import {imageBaseUrl, imgUpLoadUrl} from "../store/basic-data.js";
import useUserStore from "../store/UserStore.js";
import imageCompression from "browser-image-compression";
import {apiDeleteImageByPath} from "../util/apiUtils.js";
import {showFail, showSuccess} from "../util/showMessages.js";


const props = defineProps({
    isCompression:{
        type:Boolean,
        default:false
    },
    maxWidthOrHeight:{
        type:Number,
        default:800
    },
    url:{
        type:String,
        default:imgUpLoadUrl
    }
})
const imgSrc = defineModel('imgSrc',{required:true})
const emit = defineEmits(['onSuccess','onDelete'])

const userStore = useUserStore()
const headToken = {authorization: userStore.getToken.token_type+' ' + userStore.getToken.access_token}

const compressOptions ={
    maxSizeMB:1,
    maxWidthOrHeight:props.maxWidthOrHeight,
    useWebWorker:true
}
const defaultFileList = reactive([{
    url:imageBaseUrl+imgSrc.value,
    status:'success',
    type:'image',
    name:imgSrc.value
}])
watchEffect(() =>{
    if (imgSrc.value){
        if (defaultFileList.length === 0){
            defaultFileList.push({
                url:imageBaseUrl+imgSrc.value,
                status:'success',
                type:'image',
                name:imgSrc.value
            })
        }else{
            defaultFileList[0] = {
                url:imageBaseUrl+imgSrc.value,
                status:'success',
                type:'image',
                name:imgSrc.value
            }
        }
    }else{
        defaultFileList.shift()
    }
})

const beforeUpload = async (files) =>{
    let file =files[0]
    let fileName = file.name

    try{
        let blob = await imageCompression(file,compressOptions)
        let f = new File([blob],fileName)
        return [f]
    }catch (e){
        showFail("图片压缩失败",e)
        return []
    }
}
const deleteImageByFileName =async () =>{
    let path  = imgSrc.value
    let res = await apiDeleteImageByPath(path)
    if (res){
        showSuccess(deleteImageByFileName.name,res)
        imgSrc.value = ''
        emit('onDelete')
    }
}
const onImgSuccess = ({responseText}) =>{
    showSuccess(onImgSuccess.name,responseText)
    let resObj = JSON.parse(responseText)
    resObj.src = resObj?.src??resObj?.url
    imgSrc.value =resObj.src
    emit('onSuccess',resObj)
}
</script>

<template>
    <div>
        <div>
            <nut-uploader
                v-if="props.isCompression"
                :url="props.url"
                :headers="headToken"
                v-model:file-list="defaultFileList"
                list-type="list"
                @success="onImgSuccess"
                @delete="deleteImageByFileName"
                :before-upload="beforeUpload"
            >
                <nut-button type="info" size="small">上传图片</nut-button>
            </nut-uploader>
            <nut-uploader
                v-else
                :url="props.url"
                name="file"
                v-model:file-list="defaultFileList"
                :headers="headToken"
                @success="onImgSuccess"
                @delete="deleteImageByFileName"
            >
            </nut-uploader>
        </div>
    </div>
</template>

<style scoped>

</style>