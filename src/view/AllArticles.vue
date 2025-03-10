<script setup>
import {computed, onActivated, reactive, ref, watch} from "vue";
import {
    apiAddItemStar,
    apiGetAllItemsRefresh,
    apiGetStarByUserId,
    apiGetTopStarredItems,
    apiRemoveItemStar
} from "../util/apiUtils.js";
import MyCard from "../components/MyCard.vue";
import useCounterStore from "../store/useCounterStore.js";
import {storeToRefs} from "pinia";
import {useScrollPos} from "../util/strollUtils.js";
import router from "../router/index.js";
import {imageBaseUrl} from "../store/basic-data.js";

const counterStore = useCounterStore()
const counterRefObj = storeToRefs(counterStore)
const counterRef = ref(counterRefObj.articleCounter)

const hasMore = ref(true)
const currentPage = ref(0)


let pageSize = 5
const DEFAULT_PAGE_SIZE = 5

const DEFAULT_QUERY = computed(() =>{
    let offset = pageSize*currentPage.value
    return `skip=${offset}&limit=${pageSize}`
})

//没有启用搜索框时，默认查询条件
const q =  ref(DEFAULT_QUERY.value)

const allList = ref(new Map())
const topArticle = ref([])

const {list,error,isLoading} = apiGetAllItemsRefresh(counterRef,q)
const loadMore = () =>{
    pageSize=DEFAULT_PAGE_SIZE
    currentPage.value++
}

watch(list,() =>{
    if (list.value && list.value.length > 0){
        list.value.forEach(item =>{
            if (allList.value.has(item.id)){
                Object.assign(allList.value.get(item.id),item)
            }else{
                allList.value.set(item.id,item)
            }
        })
        hasMore.value = true
    }else{
        hasMore.value = false
    }
})
const clickStar = async (id) =>{
    let data = await apiAddItemStar(id)
    if (data){
        Object.assign(allList.value.get(id),data)
    }
}
const clickUnstar = async (id) =>{
    let data = await apiRemoveItemStar(id)
    if (data){
        Object.assign(allList.value.get(id),data)
    }
}

const gotoShowComment = (id) =>{
    router.push({name:'showComment',query:{id:id}})
}

watch(counterRef,() =>{
    pageSize = (currentPage.value+1)*DEFAULT_PAGE_SIZE
    currentPage.value = 0
})

onActivated(async () =>{
    topArticle.value = await apiGetTopStarredItems()
    console.log("topArticle",topArticle.value)
    refreshRun()
})

useScrollPos()
const refreshRun = () =>{
    counterStore.incrementArticleCounter()
}

//搜索功能

const searchVal = ref('')

watch([searchVal,DEFAULT_QUERY],() =>{
    let keyword = searchVal.value
    if (keyword !== ''){
        allList.value.clear()
        q.value = `keyword=${keyword}`
    }else{
        q.value = DEFAULT_QUERY.value
    }
})


</script>

<template>
    <div>
        <div v-if="error">
            <nut-empty  image="error" description="Error">
                <nut-cell>
                    <nut-ellipsis
                        :content="error"
                        direction="end"
                        expand-text="展开"
                        rows="3"
                        class="my-ellipsis"
                        collapse-text="收起"
                    />
                </nut-cell>
            </nut-empty>
            <nut-button type="primary"
                        style="margin-top: 5px"
                        :loading="isLoading"
                        @click="refreshRun"
            >Refresh</nut-button>
        </div>

        <nut-searchbar
            v-model="searchVal"
            @clear="searchVal = ''"
            placeholder="搜索"
        />

        <nut-swiper
            :loop="false"
            :init-page="2"
            :auto-play="3000"
            pagination-visible
            pagination-color="#426543"
            pagination-unselected-color="#808080"
        >
            <nut-swiper-item
                v-for="(item, index) in topArticle"
                :key="index"
                style="height: 150px"
            >
                <img
                    :src="imageBaseUrl+item.src"
                    alt=""
                    style="height: 100%; width: 100%"
                    draggable="false"
                    @click="router.push({name:'showArticle',query:{id:item.id}})"
                >
            </nut-swiper-item>
        </nut-swiper>

        <div v-if="allList" class="center">
            <nut-infinite-loading
                v-model="isLoading"
                :has-more="hasMore"
                @load-more="loadMore"
            >
                <nut-space
                    v-if="!counterRefObj.articleCounterEnabled.value"
                    direction="vertical"
                    align="center"
                    fill
                >
                    <nut-pull-refresh
                        v-model="isLoading"
                        @refresh="refreshRun"
                    >
                        <MyCard
                            v-for="([k,item]) in allList"
                            :key="k"
                            v-bind="item"
                            @onClickStar="clickStar(item.id)"
                            @onClickComment="gotoShowComment(item.id)"
                            @onClickItem="router.push({name:'showArticle',query:{id:item.id}})"
                            @onClickMoreActions="router.push({name:'showArticle',query:{id:item.id}})"
                            @onCLickUnStar="clickUnstar(item.id)"
                        />
                    </nut-pull-refresh>
                </nut-space>
                <nut-space
                    v-else
                    direction="vertical"
                    align="center"
                    fill
                >
                    <MyCard
                        v-for="([k,item]) in allList"
                        :key="k"
                        v-bind="item"
                        @onClickStar="id => clickStar(id)"
                        @onClickComment="(id) => gotoShowComment(id)"
                        @onClickItem="router.push({name:'showArticle',query:{id:item.id}})"
                        @onClickMoreActions="router.push({name:'showArticle',query:{id:item.id}})"
                        @onCLickUnStar="clickUnstar(item.id)"
                    />
                </nut-space>
            </nut-infinite-loading>
        </div>

    </div>
</template>

<style scoped>
.center{
    margin-top: 10px;
    display: block;
    justify-content: center;
}
.my-ellipsis{
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: pre-wrap;
}



</style>