

const formatDateTime = (dateStr,onlyDate=false) =>{
    if(dateStr === "" || !dateStr){
        return ""
    }

    let d = new Date(dateStr),
        y = d.getFullYear(),
        m = d.getMonth() + 1,
        day = d.getDate(),
        h = d.getHours(),
        min = d.getMinutes(),
        second = d.getSeconds();

    m = m < 10 ? '0' + m : m;
    day = day < 10 ? '0' + day : day;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    second = second < 10 ? '0' + second : second;

    let s = y + '-' + m + '-' + day

    if(onlyDate){
        return y + '-' + m + '-' + day;
    }else{
        return s + ' ' + h + ':' + min + ':' + second
    }
}


const simpleDateTime = (dateStr, onlyDate = false) =>{
    if (dateStr === "" || !dateStr){
        return ""
    }
    let d = new Date(dateStr),
        dateformat = require('dateformat-util')

    return onlyDate ? dateformat.format(d, 'yyyy-MM-dd')
        : dateformat.format(d, 'yyyy-MM-dd hh:mm:ss')
}

export {
    formatDateTime,
    simpleDateTime
}
