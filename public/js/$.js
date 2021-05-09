//自定义的js函数
//获取
function $get(obj) {
    return document.querySelector(obj);
}
function $getAll(obj) {
    return document.querySelectorAll(obj);
}
//创建元素
function $create(string) {
    return document.createElement(string);
}
//秒数标准化
function timefy(time){
    let minute=parseInt(time/60);
    if(minute<10){
        minute='0'+minute;
    }
    let second=time%60;
    if(second<10){
        second='0'+second;
    }
    return minute+':'+second;
};
//对错互换
function rightChange(boolean) {
    return (boolean==true)?false:true;
}
