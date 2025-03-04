

const showFail = (tag,msg) =>{
    console.log("fail at",tag,msg)
}
const alertFail = (tag,msg) =>{
    console.log(tag,msg)
}
const showSuccess = (tag,msg) =>{
    console.log("success at",tag,msg)
}

export {
    showFail,
    alertFail,
    showSuccess,
}