import {onActivated, onDeactivated} from "vue";

export const useScrollPos = () =>{
    let pos = 0
    const update = () =>{
        pos = document.documentElement.scrollTop
    }
    onActivated(() =>{
        window.addEventListener('scroll', update)
        if (typeof pos =='number'){
            document.documentElement.scrollTo(0,pos)
        }
    })
    onDeactivated(() =>{
        window.removeEventListener('scroll', update)
    })
}