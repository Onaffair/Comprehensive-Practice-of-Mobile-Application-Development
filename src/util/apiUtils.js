import {_axios} from "./index.js";
import {alertFail, showFail, showSuccess} from "./showMessages.js";
import {ref, toValue, watch, watchEffect} from "vue";
import useUserStore from "../store/UserStore.js";

const userStore = useUserStore()
const apiDeleteImageByPath = async (path) =>{
    console.log(apiDeleteImageByPath.name,path)

    if (path){
        try{
            let data  = await  _axios({
                method:'delete',
                url:'/deleteimage-bypath' + path
            })
            showSuccess(apiDeleteImageByPath.name,data)
            return Promise.resolve(data)
        }catch (e) {
            showFail(apiDeleteImageByPath.name,e)
        }
    }else{
        showFail(apiDeleteImageByPath.name,'待删除path不能为空')
    }

}

const apiGetAllItemsRefresh = (timeCounter, query = ref('skip=0&limit=100')) =>{

    let list = ref(null),
        error = ref(null),
        isLoading = ref(true),
        url

    let timer
    const delay = 250

    watch([timeCounter,query],()=>{

        //防抖
        clearTimeout(timer)
        timer =setTimeout(() =>{
            url = '/items/auto-refresh/'+ toValue(timeCounter) + '?' + toValue(query)
            isLoading.value = true

            _axios.get(url)
                .then(res =>{
                    if (res?.data){
                        list.value = res.data
                    }
                    isLoading.value = false
                    error.value = null
                }).catch(e =>{
                error.value = e?.message ? e.message : JSON.stringify(e,null,1)
                isLoading.value = false
            })
        },delay)

    })
    return {
        list,
        error,
        isLoading,
    }
}

const apiGetAllItemByUserId = (timeCounter,user_UUID, query=ref('')) =>{
    let list = ref(null),
        error = ref(null),
        isLoading = ref(true),
        url

    let watchData = [
        () =>toValue(timeCounter),
        () => toValue(user_UUID),
        () => toValue(query)
    ]
    watch(watchData,() =>{
        let q = toValue(query)
        let uuid = toValue(user_UUID)
        console.log(apiGetAllItemByUserId.name,'UUID',uuid)
        if (!uuid){
            list.value = null
            isLoading.value = false
        }else{
            url = `/items/users/${uuid}`
            if (q){
                url = `${url}?keyword=${q}`
            }
            isLoading.value = true
            _axios.get(url)
                .then(res =>{
                    if (res?.data){
                        list.value = res.data
                    }
                    isLoading.value  = false
                    error.value = null
                }).catch(e =>{
                    if (e.status === 404){
                        showFail(apiGetAllItemByUserId.name,'无数据')
                        list.value = error.value = null
                    }else{
                        error.value = e?.message ? e.message : JSON.stringify(e,null,1)
                    }
                    isLoading.value = false
            })
        }
    })
    return {
        list,
        error,
        isLoading,
    }
}

const apiDeleteImageById = async (id) =>{
    try {
        let res = await _axios.delete(`/deleteimage-byid/${id}`)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiDeleteImageById.name,e?.message)
    }
}

const apiAddOrEditImageById = async (itemId,params) =>{
    try {
        let res  = await _axios.post(`/modifyimage/${itemId}/${params.id}`,params)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiAddOrEditImageById.name,e?.message)
    }
}

const apiPostItemTitle =async (params) =>{
    try {
        let res = await _axios.post(`/items/`,params)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiPostItemTitle.name,e?.message)
    }
}

const apiModifyItemTitle = async (itemId,params) =>{
    try {
        let res  = await _axios.post(`/items/put/`+ itemId,params)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiModifyItemTitle.name,e?.message)
    }
}

const apiGetItemById =  (itemId,refreshCount = ref(0)) =>{
    const error = ref(null),
        itemData = ref(null),
        isLoading = ref(true)

    watch(() => toValue(refreshCount), () =>{
        isLoading.value = true
        _axios.get('/items/'+itemId)
            .then(res =>{
                if (res?.data){
                    itemData.value = res.data
                    console.log(apiGetItemById.name,'itemData',itemData)
                }
                isLoading.value = false
                error.value = null
            }).catch(e =>{
                alertFail(apiGetItemById.name,e?.message)
                error.value = e?.message
                isLoading.value = false
        })
    })

    return {
        itemData,
        error,
        isLoading,
    }
}
const apiDeleteItemById = async (itemId) =>{
    try {
        let res = await _axios.delete('/deleteitem-byid/'+itemId)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiDeleteItemById.name,e?.message)
    }
}

const apiGetCommentsByItemId = (counter = ref(1), itemId) =>{
    const comments = ref(null)
    const error = ref(null)
    const isLoading = ref(true)
    const watchData = [
        () => toValue(counter),
        () => toValue(itemId)
    ]
    watch(watchData,() =>{
        let url = '/comments/by-itemid/'+toValue(itemId)
        console.log('comment_url',url)
        isLoading.value = true
        _axios.get(url)
            .then(res =>{
                if (res?.data){
                    comments.value = res.data
                }
                isLoading.value = false
                error.value = false
            }).catch(e =>{
                console.log('e',e)
                if (e.status === 404){
                    showFail(apiGetCommentsByItemId.name,'无评论数据')
                    comments.value = []
                }else{
                    alertFail(apiGetCommentsByItemId.name,e?.message)
                    error.value = e?.message
                }
            })
    })
    return {
        comments,
        error,
        isLoading,
    }
}

const apiDeleteCommentById = async (commentId) =>{
    try {
        let res = await _axios.delete('/delete-comment/'+commentId)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiDeleteCommentById.name,e?.message)
    }
}

const apiPostComment = async (itemId,params) =>{
    try {
        let res = await _axios.post('/comments/'+itemId,params)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiPostComment.name,e?.message)
    }
}

const apiAddItemStar =async (itemId) =>{
    try {
        let res = await _axios.post('/items/put/addstar/'+itemId)

        await apiGetStarByUserId()

        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiAddItemStar.name,e?.message)
    }
}

const apiRemoveItemStar = async (itemId) =>{
    try{
        let res = await _axios.post('items/put/decreasestar/'+itemId)

        await apiGetStarByUserId()

        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiRemoveItemStar.name,e?.message)
    }
}

const apiGetStarByUserId = async () =>{
    try {
        let res = await _axios.get('/items/allStaredItem/')

        userStore.setStar(res?.data)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiGetStarByUserId.name,e?.message)
    }
}

const apiGetMyComments = (counter = ref(1)) =>{
    const comments = ref(null),
        error = ref(null),
        isLoading = ref(true)

    const watchData = [
        () => toValue(counter)
    ]

    watch(watchData,() =>{
        let url = '/comments/mine/'
        isLoading.value = true

        _axios.get(url)
            .then(res =>{
                if (res?.data){
                    console.log('res',res.data)
                    comments.value = res.data
                }
                isLoading.value = false
                error.value = null
            }).catch(e =>{
                console.log('e',e)
                if (e.status === 404){
                    showFail(apiGetMyComments.name,'无评论数据')
                    comments.value = []
                }else{
                    alertFail(apiGetMyComments.name,e?.message)
                    error.value = e?.message
                }
                isLoading.value = false
            })
    })
    return {
        comments,
        error,
        isLoading,
    }
}
const apiPostItemDetail = async (itemIdRef ,titleForm, imgContents) =>{

    console.log("TitleForm: ",titleForm)

    let itemId = itemIdRef.value
    if (itemId === 0){
        let item = await apiPostItemTitle(titleForm)
        console.log('item',item)
        itemIdRef.value = item.id
        itemId = item.id
        console.log(apiPostItemDetail.name,'itemRef未立即生效',
            'itemRef',itemIdRef.value,
            'itemId',itemId)
    }else{
        await apiModifyItemTitle(itemId,titleForm)
    }
    for (let i = 0; i < imgContents.length; i++) {
        let imgContent = imgContents[i]
        await apiAddOrEditImageById(itemId,imgContent)
    }
    console.log('异步循环结束的itemRef',itemIdRef.value)
    return Promise.resolve(itemId)
}

const apiGetReadByUserId = async () =>{
    try{
        let res = await _axios.get('/items/allReadItem/')
        userStore.setRead(res?.data)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiGetReadByUserId.name,e?.message)
    }
}
const apiAddRead = async (itemId) =>{
    try{
        let res = await _axios.post('/items/addRead/'+itemId)
        await apiGetReadByUserId()
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiAddRead.name,e?.message)
    }
}
const apiGetAllFollow = async () =>{
    try{
        let res = await  _axios.get('/user/follow/allFollow/')
        userStore.setFollow(res?.data)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiGetAllFollow.name,e?.message)
    }
}

const apiChangeFollow = async (params) =>{
    try{
        let res = await _axios.post('/user/follow/changeFollow/',params)
        userStore.setFollow(res?.data)
        return Promise.resolve(res?.data)
    }catch (e){
        alertFail(apiChangeFollow.name,e?.message)
    }
}
const apiGetUnreadItemsFromFollow = async () =>{
    try{
        let res = await  _axios.get('/items/following/unread/')
        return  res?.data
    }catch (e){
        alertFail(apiGetUnreadItemsFromFollow.name,e?.message)
    }

}
const apiGetTopStarredItems =async () =>{
    try{
        let res = await  _axios.get('/items/top-starred/')
        return  res?.data
    }catch (e){
        alertFail(apiGetTopStarredItems.name,e?.message)
    }
}


export {
    apiDeleteImageByPath,
    apiGetAllItemsRefresh,
    apiDeleteImageById,
    apiAddOrEditImageById,
    apiModifyItemTitle,
    apiGetItemById,
    apiDeleteItemById,
    apiGetCommentsByItemId,
    apiDeleteCommentById,
    apiPostComment,
    apiAddItemStar,
    apiGetMyComments,
    apiGetAllItemByUserId,
    apiPostItemDetail,
    apiRemoveItemStar,
    apiGetStarByUserId,
    apiGetReadByUserId,
    apiAddRead,
    apiGetAllFollow,
    apiChangeFollow,
    apiGetUnreadItemsFromFollow,
    apiGetTopStarredItems,
}