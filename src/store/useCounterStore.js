import {defineStore} from "pinia";


const useCounterStore = defineStore('counterStore',{
    state:() =>{
        return {
            articleCounter:0,
            commentCounter:0,
            timerId:null,
            articleCounterEnabled:false,
            commentCounterEnabled:false,
            interval:1000,
        }
    },
    getters:{},
    actions:{
        resetCounter(){
            this.articleCounter = 0
            this.commentCounter = 0
        },
        incrementArticleCounter(){
            this.articleCounter+=1
        },
        incrementCommentCounter(){
            this.commentCounter+=1
        },
        timerArticleCounter(){
            if (this.articleCounterEnabled){
                this.incrementArticleCounter()
            }
        },
        timerCommentCounter(){
            if (this.commentCounterEnabled){
                this.incrementCommentCounter()
            }
        },
        setArticleCounterEnabled(status = true){
            this.articleCounterEnabled = status
        },
        setCommentCounterEnabled(status = true){
            this.commentCounterEnabled = status
        },
        incrementTimerCounter(){
            this.timerCommentCounter()
            this.timerArticleCounter()
        },
        setInterval(interval = 1000){
            this.interval = interval
            this.stopTimer()
            this.startTImer()
        },
        startTImer(){
            this.timerId = setInterval(() => this.incrementTimerCounter(),this.interval)
        },
        stopTimer(){
            clearInterval(this.timerId)
        },
    },
    persist:true
})
export default useCounterStore
